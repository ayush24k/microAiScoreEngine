import { createHash } from 'crypto'
import { getSupabase } from './client.js'
import type { MatchResponse } from './types.js'

export function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex')
}

export async function findOrCreateJob(title: string, requirements: string[]): Promise<string> {
  const supabase = getSupabase()
  const { data: existing } = await supabase
    .from('jobs')
    .select('id')
    .eq('title', title)
    .limit(1)
    .single()

  if (existing?.id) return existing.id

  const { data: created, error } = await supabase
    .from('jobs')
    .insert({ title, requirements })
    .select('id')
    .single()

  if (error || !created) throw new Error(`Failed to create job: ${error?.message}`)
  return created.id
}

export async function findOrCreateCandidate(
  name: string,
  email: string,
  resume: string,
  resumeHash: string
): Promise<string> {
  const supabase = getSupabase()
  const { data: existing } = await supabase
    .from('candidates')
    .select('id')
    .eq('resume_hash', resumeHash)
    .limit(1)
    .single()

  if (existing?.id) return existing.id

  const { data: created, error } = await supabase
    .from('candidates')
    .insert({ name, email, resume, resume_hash: resumeHash })
    .select('id')
    .single()

  if (error || !created) throw new Error(`Failed to create candidate: ${error?.message}`)
  return created.id
}

export async function getCachedMatch(candidateId: string, jobId: string): Promise<MatchResponse | null> {
  const supabase = getSupabase()
  const { data } = await supabase
    .from('candidate_matches')
    .select('match_score, matched_skills, evaluation')
    .eq('candidate_id', candidateId)
    .eq('job_id', jobId)
    .limit(1)
    .single()

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
  result: MatchResponse
): Promise<void> {
  const supabase = getSupabase()
  await supabase.from('candidate_matches').insert({
    candidate_id: candidateId,
    job_id: jobId,
    match_score: result.matchScore,
    matched_skills: result.matchedSkills,
    evaluation: result.evaluation,
  })
}
