import React, { useState } from 'react'
import type { Job } from '../../types/dashboard'

interface JobRowProps {
  job: Job
  onJobClick?: (job: Job) => void
}

export const JobRow: React.FC<JobRowProps> = ({ job, onJobClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const reqs = job.requirements || []

  const getTag = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('react') || t.includes('ui') || t.includes('frontend') || t.includes('designer')) return 'Frontend / UI'
    if (t.includes('ai') || t.includes('ml') || t.includes('model') || t.includes('research')) return 'AI / ML'
    if (t.includes('devops') || t.includes('cloud') || t.includes('infra') || t.includes('security')) return 'Infra / Cloud'
    if (t.includes('mobile') || t.includes('ios') || t.includes('android')) return 'Mobile'
    return 'Backend / Systems'
  }

  // Format the date posted from created_at timestamp or deterministic fallback
  const formatDatePosted = (dateStr?: string, id?: string) => {
    if (dateStr) {
      try {
        const d = new Date(dateStr)
        if (!isNaN(d.getTime())) {
          return `Posted ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        }
      } catch (e) {
        // ignore invalid date
      }
    }
    // Deterministic fallback based on job id if created_at is missing
    let hash = 0
    const str = id || 'job'
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i)
      hash |= 0
    }
    const day = (Math.abs(hash) % 28) + 1
    const months = ['May', 'Jun', 'Jul']
    const month = months[Math.abs(hash) % months.length]
    return `Posted ${month} ${day}, 2026`
  }
  const datePosted = formatDatePosted(job.created_at, job.id)
  const isLongDesc = Boolean(job.description && job.description.length > 80)
  const shortDesc = job.description
    ? (!isLongDesc || isExpanded ? job.description : job.description.slice(0, 80).trim() + '…')
    : 'No detailed description provided.'

  return (
    <article className="py-[26px] border-b border-[var(--border)] first:pt-0 last:border-b-0">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-[16px] mb-[14px]">
        <div className="flex flex-col gap-[5px]">
          <span className="font-mono text-[11px] text-[var(--ink-faint)]">{datePosted}</span>
          <div className="flex items-center gap-[9px] flex-wrap">
            <h2 className="text-[17px] font-semibold text-[var(--ink)] m-0 tracking-[-0.1px]">{job.title}</h2>
            <span className="text-[11px] tracking-[0.03em] px-[9px] py-[2px] rounded-full font-medium text-[var(--ink-soft)] border border-[var(--border-strong)]">
              {getTag(job.title)}
            </span>
          </div>
        </div>

        <button
          onClick={() => onJobClick && onJobClick(job)}
          className="shrink-0 inline-flex items-center gap-[7px] bg-[var(--bg)] text-[var(--ink)] border border-[var(--border-strong)] py-[8px] px-[14px] rounded-[8px] text-[13px] font-semibold cursor-pointer transition-all duration-120 hover:border-[var(--ink)] hover:bg-[var(--surface)] shadow-2xs group"
        >
          <span>Run match</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-[2px]">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Requirements section */}
      <p className="text-[11.5px] font-semibold text-[var(--ink-faint)] m-[0_0_8px] uppercase tracking-[0.04em]">
        Requirements
      </p>
      {reqs.length > 0 ? (
        <div className="flex flex-wrap gap-[6px] mb-[14px]">
          {reqs.map((req, i) => (
            <span key={i} className="text-[12.5px] text-[var(--ink-soft)] bg-[var(--surface)] border border-[var(--border)] px-[10px] py-[4px] rounded-[6px]">
              {req}
            </span>
          ))}
        </div>
      ) : (
        <div className="text-[12.5px] text-[var(--ink-faint)] mb-[14px]">General qualifications apply</div>
      )}

      {/* Description Row */}
      {job.description && (
        <div className="text-[14px] leading-[1.6] text-[var(--ink)]">
          <span className="font-semibold">Job Description: </span>
          <span className="text-[var(--ink-soft)]">{shortDesc}</span>
          {isLongDesc && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-transparent border-none p-0 ml-[6px] font-inherit text-[14px] font-semibold text-[var(--ink)] cursor-pointer whitespace-nowrap hover:text-[var(--accent)] transition-colors underline decoration-[var(--border)] underline-offset-4"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </article>
  )
}
