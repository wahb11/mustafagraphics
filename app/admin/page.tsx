'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WorkUploadForm from '@/components/WorkUploadForm'
import { getWorks } from '@/lib/works'
import { deleteWork } from '@/lib/works'
import { Work } from '@/lib/supabase'
import Image from 'next/image'

type View = 'upload' | 'works' | string

const CATEGORIES = ['All', 'Logo', 'Social Media', 'Banner', 'Thumbnail', 'Graphic Design', 'Branding']

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
    if (!confirm('Delete this work permanently?')) return
    const filename = imageUrl.split('/').pop() || ''
    setDeletingId(id)
    await deleteWork(id, filename)
    setWorks(prev => prev.filter(w => w.id !== id))
    setDeletingId(null)
  }

  const filteredWorks = filterCat === 'All' ? works : works.filter(w => w.category === filterCat)

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
                        <div className="relative aspect-[4/3]" style={{ background: 'var(--deep)' }}>
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
                        </div>
                        <div className="px-4 py-3 flex-1">
                          <div className="text-[10px] tracking-[2px] uppercase font-medium mb-1" style={{ color: 'var(--purple-light)' }}>
                            {work.category}
                          </div>
                          <div className="text-[14px] font-medium" style={{ color: 'var(--white)' }}>{work.title}</div>
                          {work.description && (
                            <p className="text-[12px] mt-1 line-clamp-2" style={{ color: 'var(--muted)' }}>{work.description}</p>
                          )}
                        </div>
                        <div className="px-4 pb-4">
                          <button
                            onClick={() => handleDelete(work.id, work.image_url)}
                            disabled={deletingId === work.id}
                            className="w-full py-2 rounded-[8px] text-[11px] tracking-[1px] uppercase font-medium transition-all duration-200 disabled:opacity-50"
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
