import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import { createHash } from 'crypto'

// ── Client factories (initialized per-request to ensure env vars are loaded) ──
function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
  if (!url) throw new Error('supabaseUrl is required. Set SUPABASE_URL in your environment.')
  return createClient(url, key)
}

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ''
  if (!apiKey) throw new Error('GEMINI_API_KEY is required. Set GEMINI_API_KEY in your environment.')
  return new GoogleGenAI({ apiKey })
}

function getModel() {
  return process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface MatchRequest {
  candidateData: { name: string; email?: string }
  cvText: string // already lowercase
  vacancyRequirements: string[]
  jobTitle: string
}

interface MatchResponse {
  matchScore: number
  matchedSkills: string[]
  evaluation: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex')
}

async function findOrCreateJob(title: string, requirements: string[]): Promise<string> {
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

async function findOrCreateCandidate(
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

async function getCachedMatch(candidateId: string, jobId: string): Promise<MatchResponse | null> {
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

async function saveCachedMatch(
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

async function runGeminiMatch(
  cvText: string,
  jobTitle: string,
  requirements: string[]
): Promise<MatchResponse> {
  const ai = getGemini()
  const model = getModel()
  const systemInstruction = `You are the Match Engine AI for CRM Recruiting.
Evaluate the candidate's CV against the role "${jobTitle}" (Requirements: ${requirements.join(', ')}).
Return ONLY a valid JSON object with exactly these keys:
{
  "matchScore": <integer 0-100>,
  "matchedSkills": <array of matched requirement strings from the requirements list>,
  "evaluation": <1-2 sentence string explaining match quality>
}`

  const response = await ai.models.generateContent({
    model,
    contents: `Candidate CV text:\n${cvText}`,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      temperature: 0.4,
    },
  })

  const content = response.text
  if (!content) throw new Error('Empty response from Google Gemini AI')

  const parsed = JSON.parse(content)
  return {
    matchScore: Math.max(0, Math.min(100, Number(parsed.matchScore) || 0)),
    matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
    evaluation: String(parsed.evaluation || ''),
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body: MatchRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    const { candidateData, cvText, vacancyRequirements, jobTitle } = body

    if (!cvText?.trim()) {
      return res.status(400).json({ error: 'cvText is required' })
    }
    if (!candidateData?.name) {
      return res.status(400).json({ error: 'candidateData.name is required' })
    }

    // Step 1 — Generate SHA-256 resume hash
    const resumeHash = sha256(cvText.trim())

    // Step 2 — Find or create job record
    const jobId = await findOrCreateJob(jobTitle || 'Unknown Role', vacancyRequirements || [])

    // Step 3 — Find or create candidate record (dedup by resume_hash)
    const candidateId = await findOrCreateCandidate(
      candidateData.name,
      candidateData.email || '',
      cvText,
      resumeHash
    )

    // Step 4 — Check cache
    const cached = await getCachedMatch(candidateId, jobId)
    if (cached) {
      return res.status(200).json({ ...cached, fromCache: true })
    }

    // Step 5 — Cache miss: call Google Gemini AI
    const matchResult = await runGeminiMatch(cvText, jobTitle || 'Unknown Role', vacancyRequirements || [])

    // Step 6 — Store result in candidate_matches
    await saveCachedMatch(candidateId, jobId, matchResult)

    // Step 7 — Return response
    return res.status(200).json({ ...matchResult, fromCache: false })
  } catch (err: any) {
    console.error('[/api/match] FULL ERROR:', err?.message, err?.stack || err)
    return res.status(500).json({
      error: 'Internal server error',
      details: err?.message || String(err),
    })
  }
}
