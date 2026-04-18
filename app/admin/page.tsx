'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WorkUploadForm from '@/components/WorkUploadForm'
import { getWorks, deleteWork, updateWork } from '@/lib/works'
import { approveReview, deleteReview, getAllReviews } from '@/lib/reviews'
import { Review, Work } from '@/lib/supabase'
import Image from 'next/image'

type View = 'upload' | 'works' | string

const CATEGORIES = ['All', 'Logo', 'Social Media', 'Banner', 'Thumbnail', 'Graphic Design', 'Branding','Others']
const WORK_EDIT_CATEGORIES = CATEGORIES.filter(cat => cat !== 'All')

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [checking, setChecking] = useState(true)

  const [view, setView] = useState<View>('upload')
  const [works, setWorks] = useState<Work[]>([])
  const [filterCat, setFilterCat] = useState('All')
  const [loadingWorks, setLoadingWorks] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null)
  const [savingEditId, setSavingEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', category: 'Logo', description: '', featured: false })
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewActionId, setReviewActionId] = useState<string | null>(null)

  useEffect(() => {
    const flag = localStorage.getItem('adminAuth')
    if (flag === 'true') setAuthed(true)
    setChecking(false)
  }, [])

  const loadWorks = useCallback(async () => {
    setLoadingWorks(true)
    const data = await getWorks()
    setWorks(data)
    setLoadingWorks(false)
  }, [])

  useEffect(() => {
    if (authed && view === 'works') {
      loadWorks()
    }
  }, [authed, view, loadWorks])

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true)
    const data = await getAllReviews()
    setReviews(data)
    setLoadingReviews(false)
  }, [])

  useEffect(() => {
    if (authed && view === 'reviews') {
      loadReviews()
    }
  }, [authed, view, loadReviews])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'mustafa2025') {
      localStorage.setItem('adminAuth', 'true')
      setAuthed(true)
      setAuthError('')
    } else {
      setAuthError('Incorrect password. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setAuthed(false)
    setPassword('')
  }

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('Delete this work permanently? This removes the database row and the image file.')) return
    setDeletingId(id)
    const ok = await deleteWork(id, imageUrl)
    setDeletingId(null)
    if (ok) {
      setWorks(prev => prev.filter(w => w.id !== id))
    } else {
      alert('Delete failed. Check your connection and Supabase setup, then try again.')
    }
  }

  const handleStartEdit = (work: Work) => {
    setEditingWorkId(work.id)
    setEditForm({
      title: work.title || '',
      category: work.category || 'Logo',
      description: work.description || '',
      featured: work.featured ?? false,
    })
  }

  const handleCancelEdit = () => {
    setEditingWorkId(null)
    setSavingEditId(null)
    setEditForm({ title: '', category: 'Logo', description: '', featured: false })
  }

  const handleSaveEdit = async (workId: string) => {
    if (!editForm.title.trim()) return
    setSavingEditId(workId)
    const result = await updateWork(
      workId,
      editForm.title.trim(),
      editForm.category,
      editForm.description.trim(),
      editForm.featured
    )

    if (result.success) {
      setWorks(prev => prev.map(work => (
        work.id === workId
          ? {
              ...work,
              title: editForm.title.trim(),
              category: editForm.category,
              description: editForm.description.trim(),
              featured: editForm.featured,
            }
          : work
      )))
      handleCancelEdit()
      return
    }

    setSavingEditId(null)
  }

  const filteredWorks = filterCat === 'All' ? works : works.filter(w => w.category === filterCat)
  const pendingReviews = reviews.filter(r => r.status === 'pending')
  const approvedReviews = reviews.filter(r => r.status === 'approved')

  const handleApproveReview = async (id: string) => {
    setReviewActionId(id)
    const ok = await approveReview(id)
    if (ok) {
      setReviews(prev => prev.map(review => (
        review.id === id
          ? { ...review, status: 'approved', approved_at: new Date().toISOString() }
          : review
      )))
    }
    setReviewActionId(null)
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this review permanently?')) return
    setReviewActionId(id)
    const ok = await deleteReview(id)
    if (ok) {
      setReviews(prev => prev.filter(review => review.id !== id))
    }
    setReviewActionId(null)
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--black)' }}>
        <div className="w-6 h-6 border-2 border-[var(--purple-light)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: 'var(--black)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div
            className="p-10 rounded-[16px]"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div className="text-center mb-8">
              <div className="text-[20px] font-semibold mb-1" style={{ color: 'var(--white)' }}>
                Mustafa <span style={{ color: 'var(--purple-light)' }}>Admin</span>
              </div>
              <p className="text-[13px]" style={{ color: 'var(--muted)' }}>Enter password to continue</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter admin password..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              {authError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-3 rounded-[8px] text-[12px]"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                >
                  {authError}
                </motion.div>
              )}

              <button
                type="submit"
                className="py-[14px] rounded-[50px] text-[13px] tracking-[1px] uppercase font-medium text-white transition-all duration-200 mt-2"
                style={{ background: 'var(--purple)', border: '2px solid var(--purple)', boxShadow: '0 0 24px var(--purple-glow)' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--purple)' }}
              >
                Sign In →
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--black)' }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 min-h-screen pt-24 pb-8 px-6 flex-shrink-0"
        style={{ background: 'var(--deep)', borderRight: '1px solid var(--border)' }}
      >
        <div className="text-[14px] font-semibold mb-8" style={{ color: 'var(--white)' }}>
          Mustafa <span style={{ color: 'var(--purple-light)' }}>Admin</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {[
            { id: 'upload', label: '+ Upload Work' },
            { id: 'works', label: '⊞ Manage Works' },
            { id: 'reviews', label: '★ Manage Reviews' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="text-left px-4 py-3 rounded-[8px] text-[13px] font-medium transition-all duration-200"
              style={{
                background: view === item.id ? 'var(--purple-glow)' : 'transparent',
                border: view === item.id ? '1px solid var(--purple)' : '1px solid transparent',
                color: view === item.id ? 'var(--purple-light)' : 'var(--muted)',
              }}
              onMouseEnter={e => { if (view !== item.id) e.currentTarget.style.color = 'var(--white)' }}
              onMouseLeave={e => { if (view !== item.id) e.currentTarget.style.color = 'var(--muted)' }}
            >
              {item.label}
            </button>
          ))}

          <div className="mt-4 mb-2 px-4 text-[10px] tracking-[1.5px] uppercase" style={{ color: 'var(--border)' }}>
            Filter by Category
          </div>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setFilterCat(cat); setView('works') }}
              className="text-left px-4 py-2 rounded-[8px] text-[12px] transition-all duration-200"
              style={{
                color: filterCat === cat && view === 'works' ? 'var(--purple-light)' : 'var(--muted)',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
              onMouseLeave={e => { e.currentTarget.style.color = filterCat === cat && view === 'works' ? 'var(--purple-light)' : 'var(--muted)' }}
            >
              {cat}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="px-4 py-3 rounded-[8px] text-[12px] font-medium transition-all duration-200 text-left"
          style={{ color: 'var(--muted)', border: '1px solid var(--border)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          Log Out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 pt-24 pb-16 px-6 md:px-10 max-w-5xl">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between mb-8">
          <span className="text-[14px] font-semibold" style={{ color: 'var(--white)' }}>
            Mustafa <span style={{ color: 'var(--purple-light)' }}>Admin</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setView('upload')}
              className="px-4 py-2 text-[12px] rounded-[8px] transition-all"
              style={{
                background: view === 'upload' ? 'var(--purple-glow)' : 'transparent',
                border: view === 'upload' ? '1px solid var(--purple)' : '1px solid var(--border)',
                color: view === 'upload' ? 'var(--purple-light)' : 'var(--muted)',
              }}
            >
              Upload
            </button>
            <button
              onClick={() => setView('works')}
              className="px-4 py-2 text-[12px] rounded-[8px] transition-all"
              style={{
                background: view === 'works' ? 'var(--purple-glow)' : 'transparent',
                border: view === 'works' ? '1px solid var(--purple)' : '1px solid var(--border)',
                color: view === 'works' ? 'var(--purple-light)' : 'var(--muted)',
              }}
            >
              Manage
            </button>
            <button
              onClick={() => setView('reviews')}
              className="px-4 py-2 text-[12px] rounded-[8px] transition-all"
              style={{
                background: view === 'reviews' ? 'var(--purple-glow)' : 'transparent',
                border: view === 'reviews' ? '1px solid var(--purple)' : '1px solid var(--border)',
                color: view === 'reviews' ? 'var(--purple-light)' : 'var(--muted)',
              }}
            >
              Reviews
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-[12px] rounded-[8px]"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              Logout
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-[24px] font-semibold tracking-[-0.5px] mb-8" style={{ color: 'var(--white)' }}>
                Upload New Work
              </h1>
              <div
                className="p-8 rounded-[16px]"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              >
                <WorkUploadForm onUploadSuccess={() => loadWorks()} />
              </div>
            </motion.div>
          )}

          {view === 'works' && (
            <motion.div
              key="works"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-[24px] font-semibold tracking-[-0.5px]" style={{ color: 'var(--white)' }}>
                  Manage Works
                  <span className="ml-3 text-[14px] font-normal" style={{ color: 'var(--muted)' }}>
                    ({filteredWorks.length})
                  </span>
                </h1>
                <button
                  onClick={loadWorks}
                  className="px-4 py-2 rounded-[8px] text-[12px] tracking-[0.5px] uppercase font-medium transition-all"
                  style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple-light)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
                >
                  Refresh
                </button>
              </div>

              {/* Mobile category tabs */}
              <div className="md:hidden flex flex-wrap gap-2 mb-6">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className="filter-btn text-[11px]"
                    style={filterCat === cat ? { borderColor: 'var(--purple)', color: 'var(--purple-light)', background: 'var(--purple-glow)' } : {}}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {loadingWorks ? (
                <div className="py-20 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[var(--purple-light)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredWorks.length === 0 ? (
                <div className="py-20 text-center rounded-[12px]" style={{ border: '1px dashed var(--border)' }}>
                  <div className="text-5xl mb-4 opacity-20">✦</div>
                  <p className="text-[14px]" style={{ color: 'var(--muted)' }}>No works found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filteredWorks.map(work => (
                      <motion.div
                        key={work.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: deletingId === work.id ? 0.4 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-[12px] overflow-hidden flex flex-col"
                        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                      >
                        <div className="relative aspect-video" style={{ background: 'var(--deep)' }}>
                          {work.image_url ? (
                            <Image
                              src={work.image_url}
                              alt={work.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-15">✦</div>
                          )}
                          {(work.featured ?? false) && (
                            <div
                              className="absolute top-2 right-2 px-2 py-0.5 rounded-[6px] text-[9px] tracking-[1px] uppercase font-semibold"
                              style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)', color: 'var(--purple-light)' }}
                            >
                              Featured
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-3 flex-1">
                          {editingWorkId === work.id ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                className="form-input"
                                value={editForm.title}
                                onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Work title"
                              />
                              <select
                                className="form-input"
                                value={editForm.category}
                                onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                              >
                                {WORK_EDIT_CATEGORIES.map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                              <textarea
                                className="form-input resize-none"
                                rows={3}
                                value={editForm.description}
                                onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Description"
                              />
                              <label className="flex items-center gap-2 cursor-pointer select-none mt-1">
                                <input
                                  type="checkbox"
                                  checked={editForm.featured}
                                  onChange={e => setEditForm(prev => ({ ...prev, featured: e.target.checked }))}
                                  className="w-4 h-4 rounded shrink-0 accent-[var(--purple)]"
                                  style={{ borderColor: 'var(--border)' }}
                                />
                                <span className="text-[12px]" style={{ color: 'var(--muted)' }}>Featured on homepage</span>
                              </label>
                            </div>
                          ) : (
                            <>
                              <div className="text-[10px] tracking-[2px] uppercase font-medium mb-1" style={{ color: 'var(--purple-light)' }}>
                                {work.category}
                              </div>
                              <div className="text-[14px] font-medium" style={{ color: 'var(--white)' }}>{work.title}</div>
                              {work.description && (
                                <p className="text-[12px] mt-1 line-clamp-2" style={{ color: 'var(--muted)' }}>{work.description}</p>
                              )}
                            </>
                          )}
                        </div>
                        <div className="px-4 pb-4">
                          {editingWorkId === work.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveEdit(work.id)}
                                disabled={savingEditId === work.id}
                                className="flex-1 py-2 rounded-[8px] text-[11px] tracking-[1px] uppercase font-medium text-white transition-all duration-200 disabled:opacity-50"
                                style={{ background: 'var(--purple)', border: '1px solid var(--purple)' }}
                              >
                                {savingEditId === work.id ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                disabled={savingEditId === work.id}
                                className="flex-1 py-2 rounded-[8px] text-[11px] tracking-[1px] uppercase font-medium transition-all duration-200 disabled:opacity-50"
                                style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStartEdit(work)}
                                className="flex-1 py-2 rounded-[8px] text-[11px] tracking-[1px] uppercase font-medium transition-all duration-200"
                                style={{ border: '1px solid var(--purple)', color: 'var(--purple-light)', background: 'var(--purple-glow)' }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(work.id, work.image_url)}
                                disabled={deletingId === work.id}
                                className="flex-1 py-2 rounded-[8px] text-[11px] tracking-[1px] uppercase font-medium transition-all duration-200 disabled:opacity-50"
                                style={{
                                  background: 'rgba(239,68,68,0.1)',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  color: '#f87171',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                              >
                                {deletingId === work.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}

          {view === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-[24px] font-semibold tracking-[-0.5px]" style={{ color: 'var(--white)' }}>
                  Manage Reviews
                  <span className="ml-3 text-[14px] font-normal" style={{ color: 'var(--muted)' }}>
                    ({reviews.length})
                  </span>
                </h1>
                <button
                  onClick={loadReviews}
                  className="px-4 py-2 rounded-[8px] text-[12px] tracking-[0.5px] uppercase font-medium transition-all"
                  style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
                >
                  Refresh
                </button>
              </div>

              {loadingReviews ? (
                <div className="py-20 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-[var(--purple-light)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-20 text-center rounded-[12px]" style={{ border: '1px dashed var(--border)' }}>
                  <p className="text-[14px]" style={{ color: 'var(--muted)' }}>No reviews found.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  <section>
                    <h2 className="text-[15px] tracking-[1px] uppercase font-medium mb-4" style={{ color: 'var(--purple-light)' }}>
                      Pending ({pendingReviews.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pendingReviews.map(review => (
                        <div key={review.id} className="rounded-[12px] p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                          <div className="text-[13px] mb-2" style={{ color: 'var(--purple-light)' }}>{'★'.repeat(review.rating)}</div>
                          <p className="text-[13px] leading-[1.8] mb-3" style={{ color: 'var(--muted)' }}>{review.message}</p>
                          <div className="text-[13px] font-medium" style={{ color: 'var(--white)' }}>{review.name}</div>
                          {review.role && <div className="text-[12px] mb-4" style={{ color: 'var(--muted)' }}>{review.role}</div>}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApproveReview(review.id)}
                              disabled={reviewActionId === review.id}
                              className="px-4 py-2 rounded-[8px] text-[11px] tracking-[1px] uppercase font-medium text-white disabled:opacity-60"
                              style={{ background: 'var(--purple)', border: '1px solid var(--purple)' }}
                            >
                              {reviewActionId === review.id ? 'Working...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              disabled={reviewActionId === review.id}
                              className="px-4 py-2 rounded-[8px] text-[11px] tracking-[1px] uppercase font-medium disabled:opacity-60"
                              style={{ border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-[15px] tracking-[1px] uppercase font-medium mb-4" style={{ color: 'var(--muted)' }}>
                      Approved ({approvedReviews.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {approvedReviews.map(review => (
                        <div key={review.id} className="rounded-[12px] p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                          <div className="text-[13px] mb-2" style={{ color: 'var(--purple-light)' }}>{'★'.repeat(review.rating)}</div>
                          <p className="text-[13px] leading-[1.8] mb-3" style={{ color: 'var(--muted)' }}>{review.message}</p>
                          <div className="text-[13px] font-medium" style={{ color: 'var(--white)' }}>{review.name}</div>
                          {review.role && <div className="text-[12px] mb-4" style={{ color: 'var(--muted)' }}>{review.role}</div>}
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={reviewActionId === review.id}
                            className="px-4 py-2 rounded-[8px] text-[11px] tracking-[1px] uppercase font-medium disabled:opacity-60"
                            style={{ border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
