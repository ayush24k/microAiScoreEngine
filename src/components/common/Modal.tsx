import React, { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  eyebrow,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-[rgba(27,27,24,0.45)] backdrop-blur-[2px] flex items-center justify-center p-6 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface)] border border-[var(--border)] rounded-[14px] w-full max-w-[480px] p-[28px] shadow-2xl transition-transform transform scale-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-[22px]">
          <div>
            {eyebrow && (
              <div className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-[var(--ink-faint)] mb-[8px]">
                {eyebrow}
              </div>
            )}
            <h3 className="text-[18px] font-bold text-[var(--ink)] m-0">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-[26px] h-[26px] border border-[var(--border)] rounded-[7px] flex items-center justify-center text-[15px] text-[var(--ink-soft)] leading-none hover:text-[var(--ink)] hover:border-[var(--ink-faint)] cursor-pointer transition-colors bg-transparent shrink-0 ml-4"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
