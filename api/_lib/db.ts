import { createHash } from 'crypto'
import { getSupabase } from './client.js'
import type { MatchResponse } from './types.js'

export function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex')
}

export async function findOrCreateJob(title: string, requirements: string[], tenantId?: string): Promise<string> {
  const supabase = getSupabase()
  let query = supabase
    .from('jobs')
    .select('id')
    .eq('title', title)

  if (tenantId) query = query.eq('tenant_id', tenantId)

  const { data: existing } = await query.limit(1).single()

  if (existing?.id) return existing.id

  const { data: created, error } = await supabase
    .from('jobs')
    .insert({ title, requirements, tenant_id: tenantId || null })
    .select('id')
    .single()

  if (error || !created) throw new Error(`Failed to create job: ${error?.message}`)
  return created.id
}

export async function findOrCreateCandidate(
  name: string,
  email: string,
  resume: string,
  resumeHash: string,
  tenantId?: string
): Promise<string> {
  const supabase = getSupabase()
  let query = supabase
    .from('candidates')
    .select('id')
    .eq('resume_hash', resumeHash)

  if (tenantId) query = query.eq('tenant_id', tenantId)

  const { data: existing } = await query.limit(1).single()

  if (existing?.id) return existing.id

  const { data: created, error } = await supabase
    .from('candidates')
    .insert({ name, email, resume, resume_hash: resumeHash, tenant_id: tenantId || null })
    .select('id')
    .single()

  if (error || !created) throw new Error(`Failed to create candidate: ${error?.message}`)
  return created.id
}

export async function getCachedMatch(candidateId: string, jobId: string, tenantId?: string): Promise<MatchResponse | null> {
  const supabase = getSupabase()
  let query = supabase
    .from('candidate_matches')
    .select('match_score, matched_skills, evaluation')
    .eq('candidate_id', candidateId)
    .eq('job_id', jobId)

  if (tenantId) query = query.eq('tenant_id', tenantId)

  const { data } = await query.limit(1).single()

  if (!data) return null
  return {
    matchScore: data.match_score,
    matchedSkills: data.matched_skills || [],
    evaluation: data.evaluation,
  }
}

export async function saveCachedMatch(
  candidateId: string,
  jobId: string,
  result: MatchResponse,
  tenantId?: string
): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('candidate_matches').insert({
    candidate_id: candidateId,
    job_id: jobId,
    match_score: result.matchScore,
    matched_skills: result.matchedSkills,
    evaluation: result.evaluation,
    tenant_id: tenantId || null,
  })
}
