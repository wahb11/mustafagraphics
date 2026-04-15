'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Work } from '@/lib/supabase'

interface WorkCardProps {
  work: Work
  onDelete?: (id: string, filename: string) => void
  showDelete?: boolean
}

export default function WorkCard({ work, onDelete, showDelete = false }: WorkCardProps) {
  const filename = work.image_url.split('/').pop() || ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="work-card group relative rounded-[12px] overflow-hidden flex flex-col"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        transition: 'border-color 0.3s',
      }}
      onHoverStart={e => {
        const el = e.target as HTMLElement
        const card = el.closest('.work-card') as HTMLElement
        if (card) card.style.borderColor = 'var(--purple)'
      }}
      onHoverEnd={e => {
        const el = e.target as HTMLElement
        const card = el.closest('.work-card') as HTMLElement
        if (card) card.style.borderColor = 'var(--border)'
      }}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: 'var(--deep)' }}>
        {work.image_url ? (
          <Image
            src={work.image_url}
            alt={work.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-15">✦</div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ y: '100%' }}
          whileHover={{ y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 flex flex-col justify-end p-4"
          style={{ background: 'linear-gradient(to top, rgba(8,8,16,0.95) 0%, rgba(8,8,16,0.6) 60%, transparent 100%)' }}
        >
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
            {work.description}
          </p>
        </motion.div>
      </div>

      {/* Info */}
      <div className="px-5 py-[18px] flex-1">
        <div className="text-[10px] tracking-[2px] uppercase font-medium mb-1.5" style={{ color: 'var(--purple-light)' }}>
          {work.category}
        </div>
        <div className="text-[15px] font-medium tracking-[-0.2px]" style={{ color: 'var(--white)' }}>
          {work.title}
        </div>
      </div>

      {/* Delete button */}
      {showDelete && onDelete && (
        <div className="px-5 pb-4">
          <button
            onClick={() => onDelete(work.id, filename)}
            className="w-full py-2 rounded-lg text-[11px] tracking-[1px] uppercase font-medium transition-all duration-200 hover:opacity-80"
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
            }}
          >
            Delete
          </button>
        </div>
      )}
    </motion.div>
  )
}
