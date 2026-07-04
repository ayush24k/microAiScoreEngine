import { getGemini, getModel } from './client.js'
import { Type } from '@google/genai'
import type { MatchResponse } from './types.js'

export async function runGeminiMatch(
  cvText: string,
  jobTitle: string,
  requirements: string[]
): Promise<MatchResponse> {
  const ai = getGemini()
  const model = getModel()

  // Streamlined prompt focusing on evaluation rules & rubric with clear JSON output specification
  const systemPrompt = `You are the Match Engine AI for CRM Recruiting. Objectively score how well a candidate's CV matches a specific role based only on evidence present in the CV.

ROLE: "${jobTitle}"
REQUIREMENTS:
${requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

SCORING RUBRIC:
- 90-100: Meets nearly all requirements with direct, explicit evidence (years of experience, named tools/skills, matching role titles).
- 70-89: Meets most requirements; minor gaps or some requirements only partially evidenced.
- 40-69: Meets some requirements; significant gaps or requirements inferred rather than explicit.
- 0-39: Meets few or no requirements; largely unrelated background.

RULES:
- Only count a requirement as "matched" if the CV provides explicit or strongly implied evidence. Do not infer skills without proof.
- "matchedSkills" must contain ONLY exact string matches copied from the REQUIREMENTS list above.
- If CV is empty or unreadable, return matchScore: 0, matchedSkills: [], and explain why in "evaluation".
- Do not let candidate name, gender, age, or protected characteristics influence the score.
- Base "evaluation" strictly on what is/isn't present in the CV in 1-2 concise sentences.`

  const response = await ai.models.generateContent({
    model,
    contents: `CANDIDATE CV:\n"""\n${cvText}\n"""`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          matchScore: {
            type: Type.INTEGER,
            description: 'An integer score between 0 and 100 representing how well the candidate matches the requirements.',
          },
          matchedSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
            description: 'An array of exact string matches copied from the job requirements list that are evidenced in the CV.',
          },
          evaluation: {
            type: Type.STRING,
            description: '1 to 2 concise sentences explaining the score based on evidence in the CV.',
          },
        },
        required: ['matchScore', 'matchedSkills', 'evaluation'],
      },
      temperature: 0.3, // Lower temperature for deterministic scoring and concise output
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
