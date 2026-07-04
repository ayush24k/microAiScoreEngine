import { useState, useEffect } from 'react'
import axios from 'axios'
import { Layout } from './components/layout/Layout'
import { JobsSection } from './components/dashboard/JobsSection'
import { AddCandidateModal } from './components/modals/AddCandidateModal'
import { EvaluationDrawer } from './components/modals/EvaluationDrawer'
import { fetchActiveJobs } from './utils/jobs'
import type { Job, CandidateSubmission } from './types/dashboard'
import './App.css'

export default function App() {
  const [selectedTenant, setSelectedTenant] = useState<string>('ayush')
  const [jobs, setJobs] = useState<Job[]>([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  // Scoring / Serverless API State
  const [isScoring, setIsScoring] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeCandidate, setActiveCandidate] = useState<string | null>(null)
  const [activeJobTitle, setActiveJobTitle] = useState<string | null>(null)
  const [lastScoreResult, setLastScoreResult] = useState<{
    name: string
    job: string
    matchScore: number
    matchedSkills: string[]
    evaluation: string
    fromCache?: boolean
  } | null>(null)

  // ── Load active jobs from Supabase when selectedTenant changes ─────────────
  useEffect(() => {
    setJobsLoading(true)
    fetchActiveJobs(selectedTenant)
      .then((remoteJobs) => {
        setJobs(remoteJobs)
        setSelectedJob(null)
      })
      .catch((err) => console.warn('[App] Failed to load jobs from Supabase:', err.message))
      .finally(() => setJobsLoading(false))
  }, [selectedTenant])

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setIsModalOpen(true)
  }

  const handleRunMatch = async (submission: CandidateSubmission) => {
    setIsModalOpen(false)
    setIsScoring(true)
    setIsDrawerOpen(true)
    setActiveCandidate(submission.name)
    setLastScoreResult(null)

    const targetJob = selectedJob || jobs[0]
    setActiveJobTitle(targetJob?.title || null)

    try {
      const response = await axios.post('/api/match', {
        candidateData: {
          name: submission.name,
          email: submission.email,
        },
        cvText: submission.resumeText,
        vacancyRequirements: targetJob.requirements || [],
        jobTitle: targetJob.title,
        tenantId: selectedTenant,
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
    }
  }

  return (
    <Layout selectedTenant={selectedTenant} onSelectTenant={setSelectedTenant}>
      {/* Active Requisitions Section */}
      <JobsSection
        jobs={jobs}
        onJobClick={handleJobClick}
        isLoading={jobsLoading}
      />

      {/* Slide-Over Evaluation Drawer */}
      <EvaluationDrawer
        isOpen={isDrawerOpen}
        isScoring={isScoring}
        candidateName={activeCandidate}
        jobTitle={activeJobTitle || selectedJob?.title || null}
        tenantName={selectedTenant}
        scoreResult={lastScoreResult}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      />

      {/* Candidate Selection Modal */}
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
