import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({ children, className = '', style }) => {
  return (
    <div
      className={`bg-[var(--surface)] border border-[var(--border)] rounded-[14px] p-[26px] shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
