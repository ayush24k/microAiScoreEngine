export interface Job {
  id: string
  title: string
  requirements?: string[]
  description?: string
  tenant_id?: string
  created_at?: string
}

export interface CandidateSubmission {
  name: string
  email: string
  resumeText: string
  targetJobId?: string
}
