import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <main className="w-full max-w-[920px] mx-auto px-[24px] pt-[36px] pb-[100px] flex-1">
        {children}
      </main>
    </div>
  )
}
