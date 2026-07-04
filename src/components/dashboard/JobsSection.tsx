import React from 'react'
import type { Job } from '../../types/dashboard'
import { JobRow } from './JobRow'

interface JobsSectionProps {
  jobs: Job[]
  onJobClick?: (job: Job) => void
  isLoading?: boolean
}

export const JobsSection: React.FC<JobsSectionProps> = ({ jobs, onJobClick, isLoading = false }) => {
  return (
    <div className="w-full">
      <div className="mb-[28px]">
        <h1 className="text-[22px] font-semibold text-[var(--ink)] m-[0_0_6px] tracking-[-0.2px]">
          Active Jobs{' '}
          {isLoading ? (
            <span className="text-[0.75em] font-medium text-[var(--ink-faint)]">Loading…</span>
          ) : (
            <span className="text-[0.75em] font-medium text-[var(--ink-faint)]">({jobs.length})</span>
          )}
        </h1>
        <p className="m-0 text-[var(--ink-soft)] text-[14px]">
          Open cases across your agency
        </p>
      </div>

      {isLoading ? (
        /* Skeleton rows while Supabase loads */
        <div className="flex flex-col">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-[26px] border-b border-[var(--border)] animate-pulse">
              <div className="h-[14px] w-[20%] bg-[var(--border)] rounded mb-3" />
              <div className="h-[20px] w-[45%] bg-[var(--border)] rounded mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-[24px] w-[80px] bg-[var(--border)] rounded" />
                <div className="h-[24px] w-[100px] bg-[var(--border)] rounded" />
              </div>
              <div className="h-[16px] w-[85%] bg-[var(--border)] rounded opacity-60" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} onJobClick={onJobClick} />
          ))}
        </div>
      )}
    </div>
  )
}
