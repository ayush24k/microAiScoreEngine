import React from 'react'
import type { Job } from '../../types/dashboard'
import { Card } from '../common/Card'
import { JobRow } from './JobRow'
import { Button } from '../common/Button'

interface JobsSectionProps {
  jobs: Job[]
  onJobClick?: (job: Job) => void
  onAddCandidateClick?: () => void
}

export const JobsSection: React.FC<JobsSectionProps> = ({ jobs, onJobClick, onAddCandidateClick }) => {
  return (
    <Card className="mt-[20px]">
      <div className="flex items-center justify-between mb-[22px] flex-wrap gap-[16px]">
        <div>
          <span className="text-[17px] font-bold text-[var(--ink)]">
            Active Jobs <span className="text-[14px] text-[var(--ink-faint)] font-normal">({jobs.length})</span>
          </span>
          <div className="text-[13px] text-[var(--ink-soft)] mt-[4px]">
            Open requisitions across your agency
          </div>
        </div>
        <div>
          {onAddCandidateClick && (
            <Button variant="solid" onClick={onAddCandidateClick} className="!py-[9px] !px-[16px] !text-[13px] shadow-sm">
              Match candidate for all jobs
            </Button>
          )}
        </div>
      </div>

      <div className="mt-[12px] divide-y divide-[var(--border)]">
        {jobs.map((job) => (
          <JobRow key={job.id} job={job} onJobClick={onJobClick} />
        ))}
      </div>
    </Card>
  )
}
