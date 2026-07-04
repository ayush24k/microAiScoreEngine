import React from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
  selectedTenant: string
  onSelectTenant: (tenant: string) => void
}

export const Layout: React.FC<LayoutProps> = ({ children, selectedTenant, onSelectTenant }) => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)] flex justify-center">
      <div className="w-full max-w-[1140px] flex gap-[24px] px-[24px] pt-[36px] pb-[100px]">
        {/* Left side tenant box */}
        <Sidebar selectedTenant={selectedTenant} onSelectTenant={onSelectTenant} />

        {/* Main dashboard content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
