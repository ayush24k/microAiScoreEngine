export interface Job {
  id: string
  title: string
  requirements?: string[]
  description?: string
  tenant_id?: string
}

export interface CandidateSubmission {
  name: string
  email: string
  resumeText: string
  targetJobId?: string
}
