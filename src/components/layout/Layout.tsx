import React from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
  selectedTenant: string
  onSelectTenant: (tenant: string) => void
}

export const Layout: React.FC<LayoutProps> = ({ children, selectedTenant, onSelectTenant }) => {
  const getInitials = (name: string) => {
    if (name.toLowerCase() === 'ayush') return 'AY'
    if (name.toLowerCase() === 'zaki') return 'ZK'
    if (name.toLowerCase() === 'ricky') return 'RK'
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Topbar */}
      <header className="flex items-center justify-between gap-[24px] px-[32px] h-[60px] border-b border-[var(--border)] sticky top-0 bg-[var(--bg)] z-40">
        <div className="flex items-center gap-[10px] text-[15px] font-semibold tracking-[-0.1px] text-[var(--ink)]">
          <span>Micro AI Score Engine</span>
        </div>

        <div className="flex items-center gap-[16px]">
          <div
            className="w-[28px] h-[28px] rounded-full bg-[var(--ink)] text-white flex items-center justify-center text-[11px] font-semibold tracking-wide"
            title={`Active Workspace: ${selectedTenant}`}
          >
            {getInitials(selectedTenant)}
          </div>
        </div>
      </header>

      {/* Main Shell */}
      <div className="grid grid-cols-[220px_1fr] max-w-[1180px] mx-auto items-start max-md:grid-cols-1">
        <Sidebar selectedTenant={selectedTenant} onSelectTenant={onSelectTenant} />
        <main className="p-[40px_36px_80px] min-w-0 max-md:p-[28px_20px_60px]">
          {children}
        </main>
      </div>
    </div>
  )
}
