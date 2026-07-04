export interface Job {
  id: string
  title: string
  tags?: string[]
  requirements?: string[]
  description?: string
}

export interface CandidateSubmission {
  name: string
  email: string
  resumeText: string
  targetJobId?: string
}
