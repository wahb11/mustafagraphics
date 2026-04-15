'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import WorkCard from './WorkCard'
import { Work } from '@/lib/supabase'
import { deleteWork } from '@/lib/works'
import { ImageOff } from 'lucide-react'

interface WorksGridProps {
  initialWorks: Work[]
  showFilters?: boolean
  showDelete?: boolean
  onWorkDeleted?: () => void
}

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Logo', value: 'Logo' },
  { label: 'Social Media', value: 'Social Media' },
  { label: 'Banner', value: 'Banner' },
  { label: 'Thumbnail', value: 'Thumbnail' },
  { label: 'Graphic Design', value: 'Graphic Design' },
  { label: 'Branding', value: 'Branding' },
]

export default function WorksGrid({
  initialWorks,
  showFilters = true,
  showDelete = false,
  onWorkDeleted,
}: WorksGridProps) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [works, setWorks] = useState<Work[]>(initialWorks)
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = activeFilter === 'all'
    ? works
    : works.filter(w => w.category === activeFilter)

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm('Delete this work?')) return
    setDeleting(id)
    await deleteWork(id, filename)
    setWorks(prev => prev.filter(w => w.id !== id))
    setDeleting(null)
    onWorkDeleted?.()
  }

  return (
    <div>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTER_TABS.map((tab, i) => (
            <motion.button
              key={tab.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className={`filter-btn ${activeFilter === tab.value ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.value)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.4 }}
            className="py-24 flex flex-col items-center gap-5 text-center rounded-[16px]"
            style={{ border: '1px dashed var(--border)', background: 'var(--card)' }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)' }}
            >
              <ImageOff size={24} style={{ color: 'var(--purple-light)' }} />
            </motion.div>
            <div>
              <h3 className="text-[18px] font-semibold mb-2" style={{ color: 'var(--white)' }}>
                No Work Available
              </h3>
              <p className="text-[14px] max-w-xs mx-auto" style={{ color: 'var(--muted)' }}>
                {activeFilter === 'all'
                  ? 'No works have been uploaded yet. Visit the admin panel to add your portfolio.'
                  : `No work in the "${activeFilter}" category yet. Try a different filter.`}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((work, i) => (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: deleting === work.id ? 0.4 : 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <WorkCard
                    work={work}
                    showDelete={showDelete}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
