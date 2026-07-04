import React from 'react'
import type { Job } from '../../types/dashboard'
import { Card } from '../common/Card'
import { JobRow } from './JobRow'

interface JobsSectionProps {
  jobs: Job[]
  onJobClick?: (job: Job) => void
  isLoading?: boolean
}

export const JobsSection: React.FC<JobsSectionProps> = ({ jobs, onJobClick, isLoading = false }) => {
  return (
    <Card className="w-full">
      <div className="flex items-center justify-between mb-[22px] flex-wrap gap-[16px]">
        <div>
          <span className="text-[17px] font-bold text-[var(--ink)]">
            Active Jobs{' '}
            {isLoading ? (
              <span className="text-[13px] text-[var(--ink-faint)] font-normal">Loading…</span>
            ) : (
              <span className="text-[14px] text-[var(--ink-faint)] font-normal">({jobs.length})</span>
            )}
          </span>
          <div className="text-[13px] text-[var(--ink-soft)] mt-[4px]">
            Open requisitions across your agency
          </div>
        </div>
      </div>

      {isLoading ? (
        /* Skeleton rows while Supabase loads */
        <div className="mt-[12px] divide-y divide-[var(--border)]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-[24px] px-[8px] animate-pulse">
              <div className="h-[18px] w-[40%] bg-[var(--border)] rounded mb-3" />
              <div className="h-[13px] w-[70%] bg-[var(--border)] rounded mb-2 opacity-60" />
              <div className="h-[13px] w-[85%] bg-[var(--border)] rounded opacity-40" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-[12px] divide-y divide-[var(--border)]">
          {jobs.map((job) => (
            <JobRow key={job.id} job={job} onJobClick={onJobClick} />
          ))}
        </div>
      )}
    </Card>
  )
}
