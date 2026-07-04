import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'

// Client factories (initialized per-request to ensure env vars are loaded cleanly in serverless/SSR)
export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
  if (!url) throw new Error('supabaseUrl is required. Set SUPABASE_URL in your environment.')
  return createClient(url, key)
}

export function getGemini(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || ''
  if (!apiKey) throw new Error('GEMINI_API_KEY is required. Set GEMINI_API_KEY in your environment.')
  return new GoogleGenAI({ apiKey })
}

export function getModel(): string {
  return process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'
}
