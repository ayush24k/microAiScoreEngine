import { supabase } from './supabase'
import type { Job } from '../types/dashboard'

/**
 * Fetches active job listings from Supabase `jobs` table, optionally filtered by tenant_id.
 */
export async function fetchActiveJobs(tenantId?: string): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('id, title, requirements, description, tenant_id, created_at')
    .order('created_at', { ascending: true })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data, error, status, statusText } = await query

  // Log full debug info to browser console
  console.log('[fetchActiveJobs] status:', status, statusText)
  console.log('[fetchActiveJobs] data:', data)
  console.log('[fetchActiveJobs] error:', error)

  if (error) {
    console.error('[fetchActiveJobs] Supabase error:', error.code, error.message, error.details)
    return []
  }

  return (data || []).map((row: any) => ({
    id: String(row.id),
    title: String(row.title),
    requirements: row.requirements as string[] | undefined,
    description: row.description as string | undefined,
    tenant_id: row.tenant_id ? String(row.tenant_id) : undefined,
    created_at: row.created_at ? String(row.created_at) : undefined,
  }))
}
