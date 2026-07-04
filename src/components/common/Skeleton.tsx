import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'mark' | 'line-30' | 'line-45' | 'line-full'
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'line-full' }) => {
  const variantStyles = {
    mark: 'w-[38px] h-[38px] rounded-[8px] shrink-0',
    'line-30': 'h-[10px] rounded-[6px] w-[30%]',
    'line-45': 'h-[10px] rounded-[6px] w-[45%]',
    'line-full': 'h-[10px] rounded-[6px] w-full',
  }

  return <div className={`skel-shimmer ${variantStyles[variant]} ${className}`} />
}
