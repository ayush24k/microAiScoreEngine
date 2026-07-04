import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Layout } from './components/layout/Layout'
import { JobsSection } from './components/dashboard/JobsSection'
import { AddCandidateModal } from './components/modals/AddCandidateModal'
import { fetchActiveJobs } from './utils/jobs'
import type { Job, CandidateSubmission } from './types/dashboard'
import './App.css'

export default function App() {
  const matchSectionRef = useRef<HTMLDivElement>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Scoring / Serverless API State
  const [isScoring, setIsScoring] = useState(false)
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null)
  const [statusText, setStatusText] = useState<string | null>(null)
  const [lastScoreResult, setLastScoreResult] = useState<{
    name: string
    job: string
    matchScore: number
    matchedSkills: string[]
    evaluation: string
    fromCache?: boolean
  } | null>(null)

  // ── Load active jobs from Supabase on mount ────────────────────────────────
  useEffect(() => {
    fetchActiveJobs()
      .then((remoteJobs) => setJobs(remoteJobs))
      .catch((err) => console.warn('[App] Failed to load jobs from Supabase:', err.message))
      .finally(() => setJobsLoading(false))
  }, [])

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleRunMatch = async (submission: CandidateSubmission) => {
    setIsModalOpen(false)
    setIsScoring(true)
    setActiveCandidate(submission.name)
    setLastScoreResult(null)

    // Smoothly scroll down to the match evaluation section when calculation starts
    setTimeout(() => {
      matchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)

    const targetJob = selectedJob || jobs[0]
    setStatusText(`Scoring ${submission.name} against ${targetJob.title} via /api/match…`)

    try {
      const response = await axios.post('/api/match', {
        candidateData: {
          name: submission.name,
          email: submission.email,
        },
        cvText: submission.resumeText,
        vacancyRequirements: targetJob.requirements || [],
        jobTitle: targetJob.title,
      })

      const data = response.data
      setLastScoreResult({
        name: submission.name,
        job: targetJob.title,
        matchScore: data.matchScore,
        matchedSkills: data.matchedSkills || [],
        evaluation: data.evaluation || 'Evaluation completed successfully.',
        fromCache: data.fromCache,
      })
    } catch (err: any) {
      console.warn('[handleRunMatch] Error:', err.message)
      const errorMsg = err.response?.data?.details || err.response?.data?.error || err.message || 'Server endpoint offline'
      setLastScoreResult({
        name: submission.name,
        job: targetJob?.title || 'Unknown',
        matchScore: 0,
        matchedSkills: [],
        evaluation: `Match evaluation failed: ${errorMsg}`,
      })
    } finally {
      setIsScoring(false)
      setActiveCandidate(null)
      setStatusText(null)
    }
  }

  return (
    <Layout>
      {/* Active Jobs Section */}
      <JobsSection
        jobs={jobs}
        onJobClick={handleJobClick}
        isLoading={jobsLoading}
      />

      {/* Evaluation & Match Results Container (with automatic scroll target) */}
      <div ref={matchSectionRef} className="w-full transition-all duration-300">
        {/* Live Processing State Banner */}
        {isScoring && (
          <div className="mt-[24px] p-[24px] bg-[var(--surface)] border border-[var(--border)] rounded-[14px] shadow-sm flex items-center gap-4 animate-fadeIn">
            <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin shrink-0" />
            <div>
              <div className="text-[15px] font-bold text-[var(--ink)]">
                Evaluating {activeCandidate || 'Candidate'} via /api/match…
              </div>
              <div className="text-[13px] text-[var(--ink-soft)] mt-[2px]">
                {statusText || 'Comparing CV text against active vacancy requirements'}
              </div>
            </div>
          </div>
        )}

        {/* Match Result Card */}
        {lastScoreResult && !isScoring && (
          <div className="mt-[24px] p-[26px] bg-[var(--surface)] border-2 border-[var(--ink)] rounded-[14px] shadow-lg animate-fadeIn relative">
            <button
              onClick={() => setLastScoreResult(null)}
              className="absolute top-[18px] right-[18px] text-[var(--ink-faint)] hover:text-[var(--ink)] transition-colors text-[14px] font-bold px-2 py-1 rounded hover:bg-[rgba(0,0,0,0.04)]"
              title="Close match result"
            >
              ✕
            </button>

            <div className="flex items-start justify-between gap-4 flex-wrap mb-[16px] pr-[28px]">
              <div>
                <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-[var(--ink-soft)] mb-[6px] flex items-center gap-2">
                  <span>Match Completed</span>
                  {lastScoreResult.fromCache && (
                    <span className="bg-[rgba(0,0,0,0.05)] px-2 py-0.5 rounded text-[10.5px]">
                      Cached
                    </span>
                  )}
                </div>
                <div className="text-[18px] font-bold text-[var(--ink)]">
                  {lastScoreResult.name}{' '}
                  <span className="font-normal text-[var(--ink-soft)]">matched with</span>{' '}
                  {lastScoreResult.job}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[32px] font-extrabold text-[var(--accent)] leading-none">
                  {lastScoreResult.matchScore}%
                </div>
                <div className="text-[11.5px] text-[var(--ink-faint)] font-mono mt-[3px]">
                  Match Score
                </div>
              </div>
            </div>

            {lastScoreResult.matchedSkills.length > 0 && (
              <div className="mb-[14px] flex items-center gap-[8px] flex-wrap">
                <span className="text-[13px] font-semibold text-[var(--ink-soft)] mr-[4px]">
                  Matched Skills:
                </span>
                {lastScoreResult.matchedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="font-mono text-[12.5px] bg-[var(--accent-soft)] text-[var(--accent)] font-semibold px-[10px] py-[3.5px] rounded-[6px]"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            )}

            <div className="text-[14.5px] text-[var(--ink-soft)] leading-[1.6] pt-[14px] border-t border-[var(--border)]">
              <span className="font-semibold text-[var(--ink)]">Evaluation: </span>
              {lastScoreResult.evaluation}
            </div>
          </div>
        )}
      </div>

      {/* Match Modal */}
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRunMatch}
        isSubmitting={isScoring}
        selectedJob={selectedJob}
      />
    </Layout>
  )
}
