import React from 'react'

const TENANTS = ['ayush', 'zaki', 'ricky']

interface SidebarProps {
  selectedTenant: string
  onSelectTenant: (tenant: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTenant, onSelectTenant }) => {
  return (
    <aside className="p-[36px_20px] sticky top-[60px] self-start border-r border-[var(--border)] min-h-[calc(100vh-60px)] max-md:static max-md:p-[18px_20px_0] max-md:border-r-0 max-md:border-b max-md:border-[var(--border)] max-md:min-h-0">
      <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--ink-faint)] m-[0_0_14px_2px]">
        Tenants
      </p>
      <div className="flex flex-col gap-[2px] max-md:flex-row max-md:overflow-x-auto max-md:gap-[6px] max-md:pb-[16px]">
        {TENANTS.map((name) => {
          const isSelected = selectedTenant.toLowerCase() === name.toLowerCase()
          return (
            <button
              key={name}
              onClick={() => onSelectTenant(name)}
              className={`flex items-center gap-[9px] w-full text-left py-[8px] px-[10px] rounded-[7px] border-none text-[14px] font-medium cursor-pointer transition-all duration-150 capitalize max-md:whitespace-nowrap ${
                isSelected
                  ? 'bg-[var(--surface)] text-[var(--ink)] font-semibold shadow-2xs'
                  : 'bg-transparent text-[var(--ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
              }`}
            >
              <span
                className={`w-[6px] h-[6px] rounded-full shrink-0 transition-colors ${
                  isSelected ? 'bg-[var(--accent)]' : 'bg-[var(--border-strong)]'
                }`}
              />
              {name}
            </button>
          )
        })}
      </div>
      <div className="mt-[32px] mx-[2px] pt-[20px] border-t border-[var(--border)] text-[12.5px] leading-[1.6] text-[var(--ink-faint)] max-md:hidden">
        Switch tenants to see the requisitions and matches that belong to them.
      </div>
    </aside>
  )
}
