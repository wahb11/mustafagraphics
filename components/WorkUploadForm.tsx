'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { uploadWork } from '@/lib/works'

const CATEGORIES = [
  'Logo',
  'Social Media',
  'Banner',
  'Thumbnail',
  'Graphic Design',
  'Branding'
  ,'Others'
]

interface WorkUploadFormProps {
  onUploadSuccess?: () => void
}

export default function WorkUploadForm({ onUploadSuccess }: WorkUploadFormProps) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [featured, setFeatured] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title || !category) {
      setError('Please fill in all required fields and select an image.')
      return
    }
    setLoading(true)
    setError(null)

    const result = await uploadWork(title, category, description, file, featured)

    if (result.success) {
      setSuccess(true)
      setTitle('')
      setCategory('')
      setDescription('')
      setFeatured(true)
      setFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      onUploadSuccess?.()
      setTimeout(() => setSuccess(false), 3000)
    } else {
      setError(result.error || 'Upload failed. Please try again.')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
            Title *
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Project title..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
            Category *
          </label>
          <select
            className="form-input"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Select category...</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={featured}
          onChange={e => setFeatured(e.target.checked)}
          className="w-4 h-4 rounded border shrink-0 accent-[var(--purple)]"
          style={{ borderColor: 'var(--border)' }}
        />
        <span className="text-[13px]" style={{ color: 'var(--white)' }}>
          Show in featured work on the homepage
        </span>
      </label>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
          Description
        </label>
        <textarea
          className="form-input resize-none"
          rows={3}
          placeholder="Brief description of the project..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
          Image *
        </label>
        <label
          className="relative flex flex-col items-center justify-center min-h-[160px] rounded-[12px] cursor-pointer transition-all duration-200 overflow-hidden"
          style={{ border: '1.5px dashed var(--border)', background: 'var(--card)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--purple)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 py-6">
              <span className="text-3xl opacity-30">📤</span>
              <span className="text-[12px] tracking-[1px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
                Click to upload image
              </span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={handleFileChange}
            required
          />
        </label>
        {file && (
          <p className="text-[11px]" style={{ color: 'var(--muted)' }}>{file.name}</p>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-[8px] text-[13px]"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-[8px] text-[13px]"
          style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)', color: 'var(--purple-light)' }}
        >
          ✓ Work uploaded successfully!
        </motion.div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="self-start inline-flex items-center gap-2 px-8 py-4 rounded-[50px] text-[13px] tracking-[1px] uppercase font-medium text-white transition-all duration-200 disabled:opacity-50"
        style={{
          background: 'var(--purple)',
          border: '2px solid var(--purple)',
          boxShadow: '0 0 24px var(--purple-glow)',
        }}
        onMouseEnter={e => {
          if (!loading) {
            e.currentTarget.style.background = 'var(--purple-dark, #6d28d9)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--purple)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload Work →'
        )}
      </button>
    </form>
  )
}
