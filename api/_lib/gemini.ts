import { getGemini, getModel } from './client'
import type { MatchResponse } from './types'

export async function runGeminiMatch(
  cvText: string,
  jobTitle: string,
  requirements: string[]
): Promise<MatchResponse> {
  const ai = getGemini()
  const model = getModel()

  const systemPrompt = `You are the Match Engine AI for CRM Recruiting. Your job is to objectively score how well a candidate's CV matches a specific role, based only on evidence present in the CV.

ROLE: "${jobTitle}"
REQUIREMENTS:
${requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

SCORING RUBRIC:
- 90-100: Meets nearly all requirements with direct, explicit evidence (years of experience, named tools/skills, matching role titles).
- 70-89: Meets most requirements; minor gaps or some requirements only partially evidenced.
- 40-69: Meets some requirements; significant gaps or requirements inferred rather than explicit.
- 0-39: Meets few or no requirements; largely unrelated background.

RULES:
- Only count a requirement as "matched" if the CV provides explicit or strongly implied evidence (e.g., a named technology, a stated years-of-experience figure, an equivalent job title/responsibility). Do not infer skills the CV does not support.
- "matchedSkills" must contain only strings copied exactly from the requirements list — no paraphrasing, no additions.
- If the CV text is empty, unreadable, or contains no relevant information, return matchScore: 0, matchedSkills: [], and explain why in "evaluation".
- Do not let candidate name, gender, age, ethnicity, or any protected characteristic influence the score.
- Base "evaluation" strictly on what is/isn't present in the CV — no speculation about potential or trainability.

OUTPUT FORMAT:
Return ONLY a single valid JSON object, with no markdown code fences, no preamble, and no trailing text. It must have exactly these keys and types:
{
  "matchScore": <integer, 0-100>,
  "matchedSkills": <array of strings, each an exact match from the requirements list, possibly empty>,
  "evaluation": <string, 1-2 sentences, explaining the score with specific reference to matched/missing requirements>
}`

  const response = await ai.models.generateContent({
    model,
    contents: `CANDIDATE CV:\n"""\n${cvText}\n"""`,
    config: {
      systemInstruction: systemPrompt,
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
