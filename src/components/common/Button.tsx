import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'solid'
  children: React.ReactNode
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'outline',
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-sans text-[13px] font-semibold rounded-[7px] px-4 py-[9px] cursor-pointer inline-flex items-center justify-center gap-[7px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantStyles = {
    outline: 'bg-transparent text-[var(--ink)] border border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--surface)]',
    solid: 'bg-[var(--ink)] text-[var(--surface)] border border-[var(--ink)] hover:opacity-85 shadow-sm',
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
