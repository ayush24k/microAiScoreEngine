import React, { useEffect, useState } from 'react'

interface EvaluationDrawerProps {
  isOpen: boolean
  isScoring: boolean
  candidateName: string | null
  jobTitle: string | null
  tenantName: string
  scoreResult: {
    name: string
    job: string
    matchScore: number
    matchedSkills: string[]
    evaluation: string
    fromCache?: boolean
  } | null
  onClose: () => void
  onOpen?: () => void
}

const R = 32
const CIRC = 2 * Math.PI * R

export const EvaluationDrawer: React.FC<EvaluationDrawerProps> = ({
  isOpen,
  isScoring,
  candidateName,
  jobTitle,
  tenantName,
  scoreResult,
  onClose,
  onOpen,
}) => {
  const [animatedOffset, setAnimatedOffset] = useState(CIRC)

  useEffect(() => {
    if (scoreResult && !isScoring) {
      // Trigger SVG circular stroke dashoffset animation smoothly
      const targetOffset = CIRC - (scoreResult.matchScore / 100) * CIRC
      const timer = setTimeout(() => {
        setAnimatedOffset(targetOffset)
      }, 50)
      return () => clearTimeout(timer)
    } else {
      setAnimatedOffset(CIRC)
    }
  }, [scoreResult, isScoring])

  const displayCandidate = candidateName || scoreResult?.name || 'Candidate'
  const displayJob = jobTitle || scoreResult?.job || 'Requisition'

  return (
    <>
      {/* Scrim backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-[rgba(20,20,20,0.25)] transition-opacity duration-200 z-50 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Small floating minimized box when drawer is closed */}
      {!isOpen && (isScoring || scoreResult) && onOpen && (
        <button
          onClick={onOpen}
          aria-label="Open Evaluation Drawer"
          title="Open Evaluation Drawer"
          className="fixed top-[80px] right-0 z-40 bg-[var(--surface)] border border-[var(--border)] border-r-0 shadow-lg py-[10px] px-[14px] rounded-l-[10px] cursor-pointer text-[var(--ink)] hover:bg-[var(--bg)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200 flex items-center gap-[8px] group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:-translate-x-[3px]">
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span className="text-[12.5px] font-bold font-mono tracking-wide uppercase">
            {isScoring ? 'Evaluating…' : `${scoreResult?.matchScore || 0}% Match`}
          </span>
          {isScoring && (
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping shrink-0" />
          )}
        </button>
      )}

      {/* Slide-over drawer */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 h-full w-[400px] max-w-[92vw] bg-[var(--bg)] border-l border-[var(--border)] transition-transform duration-280 ease-out z-51 flex flex-col shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-[24px_26px_18px] border-b border-[var(--border)] flex justify-between items-start">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[var(--ink-faint)] m-[0_0_6px]">
              {isScoring ? 'Matching in progress…' : 'Match completed'}
            </p>
            <h2 className="text-[16px] font-semibold m-0 leading-[1.4] tracking-[-0.1px] text-[var(--ink)]">
              {isScoring ? (
                <span>
                  Evaluating <b>{displayCandidate}</b> for <b>{displayJob}</b>
                </span>
              ) : (
                <span>
                  <b>{displayCandidate}</b> matched with <b>{displayJob}</b>
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Minimize drawer"
            title="Minimize drawer"
            className="bg-transparent border border-[var(--border)] rounded-[6px] cursor-pointer text-[var(--ink-soft)] p-[6px] leading-none hover:bg-[var(--surface)] hover:text-[var(--ink)] hover:border-[var(--ink)] transition-all duration-150 flex items-center justify-center shadow-2xs group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-[2px]">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-[28px_26px_32px] overflow-y-auto flex-1">
          {isScoring ? (
            <div>
              <p className="text-[12.5px] text-[var(--ink-soft)] m-[0_0_4px]">
                Comparing CV against requisition requirements for {tenantName}…
              </p>
              <div className="loading-line">
                <span />
              </div>
              <div className="mt-[20px] p-[16px] bg-[var(--surface)] border border-[var(--border)] rounded-[8px] text-[13px] text-[var(--ink-soft)] leading-[1.6]">
                Our AI Score Engine is analyzing semantic skill matches, verifying required technologies, and formulating a detailed assessment...
              </div>
            </div>
          ) : scoreResult ? (
            <div>
              {/* Score ring and stats */}
              <div className="flex items-center gap-[18px] mb-[28px]">
                <div className="relative w-[76px] h-[76px] shrink-0 score-ring">
                  <svg width="76" height="76" viewBox="0 0 76 76">
                    <circle className="track" cx="38" cy="38" r={R} fill="none" strokeWidth="5" />
                    <circle
                      className="fill"
                      cx="38"
                      cy="38"
                      r={R}
                      fill="none"
                      strokeWidth="5"
                      strokeDasharray={CIRC}
                      strokeDashoffset={animatedOffset}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-[16px] font-semibold text-[var(--ink)]">
                    {scoreResult.matchScore}%
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[var(--ink)] m-[0_0_2px]">
                    Match score {scoreResult.fromCache && <span className="text-[10px] bg-[var(--border)] px-[6px] py-[2px] rounded ml-[6px] text-[var(--ink-soft)] font-normal">Cached</span>}
                  </p>
                  <p className="text-[12.5px] text-[var(--ink-faint)] m-0">
                    {scoreResult.matchedSkills.length} requirement{scoreResult.matchedSkills.length === 1 ? '' : 's'} verified
                  </p>
                </div>
              </div>

              {/* Matched skills chips */}
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-[var(--ink-faint)] m-[0_0_10px]">
                Verified Skills
              </p>
              {scoreResult.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-[7px] mb-[24px]">
                  {scoreResult.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-[5px] text-[12.5px] font-medium bg-[var(--accent-soft)] text-[var(--accent)] px-[10px] py-[5px] rounded-full"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-[13px] text-[var(--ink-faint)] mb-[24px]">No direct keyword matches found.</div>
              )}

              {/* Evaluation block */}
              <div className="pt-[20px] border-t border-[var(--border)]">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-[var(--ink-faint)] m-[0_0_8px]">
                  Evaluation Analysis
                </p>
                <p className="m-0 text-[13.5px] leading-[1.65] text-[var(--ink-soft)] whitespace-pre-line">
                  {scoreResult.evaluation}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  )
}
