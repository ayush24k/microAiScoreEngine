import React, { useState } from 'react'
import type { Job } from '../../types/dashboard'
import { Button } from '../common/Button'

interface JobRowProps {
  job: Job
  onJobClick?: (job: Job) => void
}

export const JobRow: React.FC<JobRowProps> = ({ job, onJobClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const reqs = job.requirements ? job.requirements.join(', ') : ''
  
  const isLongDesc = Boolean(job.description && job.description.length > 75)
  const descText = job.description 
    ? (!isLongDesc || isExpanded ? job.description : job.description.slice(0, 75).trim() + '...') 
    : ''

  return (
    <div className="group py-[24px] px-[8px] border-b border-[var(--border)] last:border-b-0 transition-colors duration-150 hover:bg-[rgba(0,0,0,0.015)]">
      {/* Top Header: Job Title and Match Candidate Button */}
      <div className="flex items-center justify-between gap-[16px] flex-wrap mb-[14px]">
        <div className="text-[17px] font-bold text-[var(--accent)] flex items-center gap-[8px]">
          <span>{job.title}</span>
        </div>
        
        <div className="flex items-center gap-[16px]">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              onJobClick && onJobClick(job)
            }}
            className="!py-[7px] !px-[14px] !text-[12.5px] hover:!bg-[var(--ink)] hover:!text-[var(--surface)] shadow-2xs"
          >
            Match candidate
          </Button>
        </div>
      </div>

      {/* Requirements Section */}
      <div className="text-[13.5px] text-[var(--ink)] mb-[10px]">
        <span className="font-semibold text-[var(--ink-soft)]">Requirements: </span>
        <span className="font-mono text-[12.5px] bg-[rgba(0,0,0,0.04)] px-[8px] py-[3px] rounded-[5px] inline-block mt-[2px]">{reqs}</span>
      </div>

      {/* Job Description Section with Show More dropdown */}
      {job.description && (
        <div className="text-[13.5px] text-[var(--ink-soft)] leading-[1.6]">
          <span className="font-semibold text-[var(--ink)]">Job Description: </span>
          <span>{descText}</span>
          {isLongDesc && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              aria-expanded={isExpanded}
              className="text-[12.5px] font-semibold text-[var(--ink)] hover:text-[var(--accent)] ml-[8px] inline-flex items-center gap-[3px] bg-transparent cursor-pointer border-none p-0 underline decoration-[var(--border)] underline-offset-4 hover:decoration-[var(--ink)] transition-all"
            >
              {isExpanded ? 'Show less ↑' : 'Show more ↓'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
