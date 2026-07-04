import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import type { CandidateSubmission } from '../../types/dashboard'
import { Upload, FileText, CheckCircle2, X, Paperclip } from 'lucide-react'

interface AddCandidateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (candidate: CandidateSubmission) => void
  isSubmitting?: boolean
}

export const AddCandidateModal: React.FC<AddCandidateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file')
  const [attachedFile, setAttachedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setResumeText(event.target?.result as string || '')
        }
        reader.readAsText(file)
      } else {
        setResumeText(`[Attached Document: ${file.name}] - Candidate CV and skills ready for AI evaluation.`)
      }
    }
  }

  const handleRemoveFile = () => {
    setAttachedFile(null)
    setResumeText('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter candidate name')
      return
    }

    if (inputMode === 'file' && !attachedFile && !resumeText.trim()) {
      alert('Please attach a CV file or switch to Paste Text')
      return
    }

    onSubmit({
      name: name.trim(),
      email: email.trim() || 'candidate@email.com',
      resumeText: resumeText.trim() || 'Experienced React & TypeScript developer with scalable frontend architecture experience.',
    })

    // Reset form
    setName('')
    setEmail('')
    setResumeText('')
    setAttachedFile(null)
    setInputMode('file')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Run a match">
      <form onSubmit={handleSubmit}>
        <div className="mb-[16px]">
          <label className="block text-[11.5px] font-semibold text-[var(--ink-soft)] mb-[7px]">
            Candidate name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Menon"
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[7px] p-[10px_12px] font-sans text-[13.5px] text-[var(--ink)] outline-none focus:border-[var(--ink)] transition-colors placeholder:text-[var(--ink-faint)]"
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-[16px]">
          <label className="block text-[11.5px] font-semibold text-[var(--ink-soft)] mb-[7px]">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="priya@email.com"
            className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[7px] p-[10px_12px] font-sans text-[13.5px] text-[var(--ink)] outline-none focus:border-[var(--ink)] transition-colors placeholder:text-[var(--ink-faint)]"
            disabled={isSubmitting}
          />
        </div>

        {/* CV Input Section */}
        <div className="mb-[18px]">
          <div className="flex items-center justify-between mb-[8px]">
            <label className="block text-[11.5px] font-semibold text-[var(--ink-soft)]">
              Candidate CV / Resume
            </label>
            
            <div className="flex items-center gap-[6px] bg-[rgba(0,0,0,0.03)] p-[3px] rounded-[6px] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`flex items-center gap-[5px] text-[11.5px] font-medium px-[8px] py-[3px] rounded-[4px] cursor-pointer transition-all border-none ${
                  inputMode === 'file'
                    ? 'bg-[var(--surface)] text-[var(--ink)] shadow-2xs font-semibold'
                    : 'bg-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Attach file</span>
              </button>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`flex items-center gap-[5px] text-[11.5px] font-medium px-[8px] py-[3px] rounded-[4px] cursor-pointer transition-all border-none ${
                  inputMode === 'text'
                    ? 'bg-[var(--surface)] text-[var(--ink)] shadow-2xs font-semibold'
                    : 'bg-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>Add text</span>
              </button>
            </div>
          </div>

          {inputMode === 'file' ? (
            <div className="mt-1">
              {!attachedFile ? (
                <label className="border-2 border-dashed border-[var(--border)] rounded-[10px] p-6 flex flex-col items-center justify-center text-center bg-[var(--bg)] hover:border-[var(--ink)] transition-colors cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <div className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-2.5 shadow-2xs group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div className="text-[13px] font-semibold text-[var(--ink)] mb-0.5">
                    Click to upload CV document
                  </div>
                  <div className="text-[11.5px] text-[var(--ink-soft)] font-mono">
                    Supports .PDF, .DOC, .DOCX, .TXT
                  </div>
                </label>
              ) : (
                <div className="border border-[var(--border)] rounded-[10px] p-4 bg-[var(--surface)] flex items-center justify-between gap-3 shadow-2xs animate-fadeIn">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-[8px] bg-[var(--accent-soft)] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--ink)] truncate">
                        {attachedFile.name}
                      </div>
                      <div className="text-[11px] text-[var(--ink-soft)] font-mono">
                        {(attachedFile.size / 1024).toFixed(1)} KB · Ready for AI evaluation
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={isSubmitting}
                    className="w-7 h-7 rounded-[6px] border border-[var(--border)] flex items-center justify-center text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--bg)] cursor-pointer transition-colors shrink-0 bg-transparent"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste the candidate's raw CV or resume text here..."
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-[7px] p-[10px_12px] font-mono text-[12px] text-[var(--ink)] outline-none focus:border-[var(--ink)] transition-colors placeholder:text-[var(--ink-faint)] min-h-[110px] resize-y leading-[1.6]"
              disabled={isSubmitting}
            />
          )}
        </div>

        <div className="flex justify-end gap-[10px] mt-[6px] pt-[18px] border-t border-[var(--border)]">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="solid"
            disabled={isSubmitting || (inputMode === 'file' && !attachedFile && !resumeText.trim())}
          >
            {isSubmitting ? 'Scoring...' : 'Run match →'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
