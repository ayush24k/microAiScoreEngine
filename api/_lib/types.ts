export interface MatchRequest {
  candidateData: { name: string; email?: string }
  cvText: string // already lowercase or trimmed
  vacancyRequirements: string[]
  jobTitle: string
  tenantId?: string
}

export interface MatchResponse {
  matchScore: number
  matchedSkills: string[]
  evaluation: string
  fromCache?: boolean
}
