import React from 'react'

interface TagProps {
  children: React.ReactNode
  className?: string
}

export const Tag: React.FC<TagProps> = ({ children, className = '' }) => {
  return (
    <span className={`font-mono text-[11px] text-[var(--ink-soft)] border border-[var(--border)] rounded-[5px] px-[8px] py-[4px] bg-[var(--surface)] transition-colors hover:border-[var(--ink-faint)] ${className}`}>
      {children}
    </span>
  )
}
