import React from 'react'

interface SpinnerProps {
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-[17px] h-[17px] rounded-full border-2 border-[var(--border)] border-t-[var(--ink)] animate-spin-fast shrink-0 ${className}`}
      aria-label="Loading"
    />
  )
}
