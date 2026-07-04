import React from 'react'

const TENANTS = ['ayush', 'zaki', 'ricky']

interface SidebarProps {
  selectedTenant: string
  onSelectTenant: (tenant: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTenant, onSelectTenant }) => {
  return (
    <aside className="w-[200px] shrink-0">
      <div className="p-[16px] bg-[var(--surface)] border border-[var(--border)] rounded-[12px] shadow-sm">
        <div className="text-[13px] font-bold text-[var(--ink-soft)] uppercase tracking-wider mb-[12px]">
          Tenants
        </div>
        <div className="flex flex-col gap-[8px]">
          {TENANTS.map((name) => {
            const isSelected = selectedTenant === name
            return (
              <button
                key={name}
                onClick={() => onSelectTenant(name)}
                className={`w-full py-[8px] px-[12px] rounded-[8px] text-[14px] transition-all text-left capitalize ${
                  isSelected
                    ? 'bg-[var(--accent)] text-white font-semibold shadow-2xs'
                    : 'bg-[var(--bg)] text-[var(--ink)] hover:bg-[rgba(0,0,0,0.04)] border border-[var(--border)]'
                }`}
              >
                {name}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
