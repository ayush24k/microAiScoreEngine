import { supabase } from './supabase'
import type { Job } from '../types/dashboard'

/**
 * Fetches active job listings from Supabase `jobs` table.
 */
export async function fetchActiveJobs(): Promise<Job[]> {
  const { data, error, status, statusText } = await supabase
    .from('jobs')
    .select('id, title, requirements, description')
    .order('created_at', { ascending: true })

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
  }))
}
