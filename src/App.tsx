import { useState } from 'react'
import { Layout } from './components/layout/Layout'
import { JobsSection } from './components/dashboard/JobsSection'
import { AddCandidateModal } from './components/modals/AddCandidateModal'
import { initialJobs } from './data/mockData'
import type { Job, CandidateSubmission } from './types/dashboard'
import './App.css'

export default function App() {
  const [jobs] = useState<Job[]>(initialJobs)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleJobClick = (_job: Job) => {
    setIsModalOpen(true)
  }

  const handleRunMatch = (submission: CandidateSubmission) => {
    setIsModalOpen(false)
    console.log('Candidate submission received:', submission)
    alert(`Submission received for ${submission.name}. Match engine processing is currently disabled.`)
  }

  return (
    <Layout>
      {/* Available Jobs Section */}
      <JobsSection
        jobs={jobs}
        onJobClick={handleJobClick}
        onAddCandidateClick={() => setIsModalOpen(true)}
      />

      {/* Interactive Modal */}
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRunMatch}
      />
    </Layout>
  )
}
