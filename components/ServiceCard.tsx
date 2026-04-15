'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ServiceCardProps {
  icon?: string
  name: string
  description: string
  tools: string[]
  slug: string
  index?: number
}

export default function ServiceCard({ icon = '◈', name, description, tools, slug, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      whileHover={{ y: -6 }}
      className="service-card-hover group relative p-8 md:p-10 rounded-[12px] flex flex-col transition-all duration-300"
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
      }}
      onHoverStart={e => {
        const el = e.target as HTMLElement
        const card = el.closest('.service-card-hover') as HTMLElement
        if (card) {
          card.style.borderColor = 'var(--purple)'
          card.style.boxShadow = '0 0 32px var(--purple-glow)'
        }
      }}
      onHoverEnd={e => {
        const el = e.target as HTMLElement
        const card = el.closest('.service-card-hover') as HTMLElement
        if (card) {
          card.style.borderColor = 'var(--border)'
          card.style.boxShadow = 'none'
        }
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[18px] mb-5 transition-all duration-300"
        style={{
          background: 'var(--purple-glow)',
          border: '1px solid var(--border)',
          color: 'var(--purple-light)',
        }}
      >
        {icon}
      </div>

      <div className="text-[17px] font-semibold mb-3 tracking-[-0.3px]" style={{ color: 'var(--white)' }}>
        {name}
      </div>
      <p className="text-[14px] leading-[1.8] flex-1" style={{ color: 'var(--muted)' }}>
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-1.5 mb-6">
        {tools.map(t => (
          <span key={t} className="tool-tag">{t}</span>
        ))}
      </div>
      <Link
        href={`/services/${slug}`}
        className="inline-flex items-center gap-2 text-[12px] tracking-[1px] uppercase font-medium no-underline transition-all duration-200 hover:gap-3"
        style={{ color: 'var(--purple-light)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--purple-light)'}
      >
        Learn More <ArrowRight size={12} />
      </Link>
    </motion.div>
  )
}
