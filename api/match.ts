import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { MatchRequest } from './_lib/types.js'
import { sha256, findOrCreateJob, findOrCreateCandidate, getCachedMatch, saveCachedMatch } from './_lib/db.js'
import { runGeminiMatch } from './_lib/gemini.js'

// ── Vercel Serverless Handler ─────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const body: MatchRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { candidateData, cvText, vacancyRequirements, jobTitle, tenantId } = body

    if (!cvText?.trim()) {
      return res.status(400).json({ error: 'cvText is required' })
    }
    if (!candidateData?.name) {
      return res.status(400).json({ error: 'candidateData.name is required' })
    }

    // Normalize CV text: collapse whitespace, strip control characters, and cap length to ~12,000 chars (~3,000 tokens)
    // This maximizes SHA-256 database cache hits and prevents input token bloat sent to Google Gemini!
    const normalizedCv = cvText
      .replace(/\s+/g, ' ')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .trim()
      .slice(0, 12000)

    // Step 1 — Generate SHA-256 resume hash from normalized CV
    const resumeHash = sha256(normalizedCv)

    // Step 2 — Find or create job record in Supabase
    const jobId = await findOrCreateJob(jobTitle || 'Unknown Role', vacancyRequirements || [], tenantId)

    // Step 3 — Find or create candidate record (deduplicated by resume_hash)
    const candidateId = await findOrCreateCandidate(
      candidateData.name,
      candidateData.email || '',
      normalizedCv,
      resumeHash,
      tenantId
    )

    // Step 4 — Check candidate_matches cache
    const cached = await getCachedMatch(candidateId, jobId, tenantId)
    if (cached) {
      return res.status(200).json({ ...cached, fromCache: true })
    }

    // Step 5 — Cache miss: evaluate via Google Gemini AI
    const matchResult = await runGeminiMatch(normalizedCv, jobTitle || 'Unknown Role', vacancyRequirements || [])

    // Step 6 — Store evaluation results in Supabase cache
    await saveCachedMatch(candidateId, jobId, matchResult, tenantId)

    // Step 7 — Return evaluation response
    return res.status(200).json({ ...matchResult, fromCache: false })
  } catch (err: any) {
    console.error('[/api/match] FULL ERROR:', err?.message, err?.stack || err)
    return res.status(500).json({
      error: 'Internal server error',
      details: err?.message || String(err),
    })
  }
}
