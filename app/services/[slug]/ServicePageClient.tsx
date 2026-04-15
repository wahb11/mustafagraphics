'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import WorkCard from '@/components/WorkCard'
import { Work } from '@/lib/supabase'
import { CheckCircle, ArrowRight, ImageOff } from 'lucide-react'
import { FadeUp, FadeLeft, FadeRight, HeroStagger, HeroItem } from '@/components/Animate'

interface ServiceData {
  icon: string
  name: string
  description: string
  longDesc: string
  included: string[]
  tools: string[]
}

interface Props {
  data: ServiceData
  works: Work[]
}

export default function ServicePageClient({ data, works }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col justify-center px-6 md:px-[60px] pt-36 pb-20 overflow-hidden">
        <div className="absolute pointer-events-none" style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, var(--purple-glow) 0%, transparent 70%)',
          top: -100, right: -150,
        }} />
        <div className="relative z-10 max-w-2xl">
          <HeroStagger>
            <HeroItem>
              <div className="w-14 h-14 rounded-[14px] flex items-center justify-center text-[22px] mb-6"
                style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)' }}>
                {data.icon}
              </div>
            </HeroItem>
            <HeroItem>
              <div className="section-tag">Service</div>
            </HeroItem>
            <HeroItem>
              <h1 className="font-semibold leading-[1.05] tracking-[-1px] mb-6"
                style={{ fontSize: 'clamp(38px, 6vw, 72px)', color: 'var(--white)' }}>
                {data.name}
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="text-[16px] leading-[1.85] mb-8" style={{ color: 'var(--muted)' }}>
                {data.longDesc}
              </p>
            </HeroItem>
            <HeroItem>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                <Link href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-[15px] rounded-[50px] text-[13px] tracking-[1px] uppercase font-medium text-white no-underline"
                  style={{ background: 'var(--purple)', border: '2px solid var(--purple)', boxShadow: '0 0 24px var(--purple-glow)' }}>
                  Get A Quote <ArrowRight size={14} />
                </Link>
              </motion.div>
            </HeroItem>
          </HeroStagger>
        </div>
      </section>

      {/* What's Included + Tools */}
      <section className="px-6 md:px-[60px] py-20 md:py-[110px] overflow-hidden" style={{ background: 'var(--deep)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeLeft>
            <div className="section-tag">Deliverables</div>
            <h2 className="text-[28px] font-semibold tracking-[-0.5px] mb-8" style={{ color: 'var(--white)' }}>
              What&apos;s Included
            </h2>
            <ul className="flex flex-col gap-3">
              {data.included.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-center gap-3 text-[14px] p-3 rounded-[8px] transition-all duration-200"
                  style={{ color: 'var(--muted)', background: 'var(--card)', border: '1px solid var(--border)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--purple)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--white)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
                  }}
                >
                  <CheckCircle size={15} style={{ color: 'var(--purple-light)', flexShrink: 0 }} />
                  {item}
                </motion.li>
              ))}
            </ul>
          </FadeLeft>

          <FadeRight delay={0.1}>
            <div className="section-tag">Software</div>
            <h2 className="text-[28px] font-semibold tracking-[-0.5px] mb-8" style={{ color: 'var(--white)' }}>
              Tools Used
            </h2>
            <div className="flex flex-wrap gap-3 mb-10">
              {data.tools.map((tool, i) => (
                <motion.span
                  key={tool}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-5 py-3 rounded-[8px] text-[13px] font-medium tracking-[0.3px] transition-all duration-200 cursor-default"
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    color: 'var(--purple-light)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--purple)'
                    ;(e.currentTarget as HTMLElement).style.background = 'var(--purple-glow)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLElement).style.background = 'var(--card)'
                  }}
                >
                  {tool}
                </motion.span>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-[12px]"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <h3 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--white)' }}>
                My Process
              </h3>
              <ol className="flex flex-col gap-3">
                {['Brief & requirements', 'Research & concept', 'Design execution', 'Revision rounds', 'Final delivery'].map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-center gap-3 text-[13px]"
                    style={{ color: 'var(--muted)' }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                      style={{ background: 'var(--purple-glow)', color: 'var(--purple-light)', border: '1px solid var(--purple)' }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </FadeRight>
        </div>
      </section>

      {/* Works Gallery */}
      <section className="px-6 md:px-[60px] py-20 md:py-[110px] overflow-hidden">
        <FadeUp>
          <div className="section-tag">Portfolio</div>
          <h2 className="font-semibold leading-[1.05] tracking-[-1px] mb-12"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--white)' }}>
            Related Work
          </h2>
        </FadeUp>

        {works.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {works.map((work, i) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
              >
                <WorkCard work={work} />
              </motion.div>
            ))}
          </div>
        ) : (
          <FadeUp delay={0.1}>
            <div className="py-20 flex flex-col items-center gap-4 text-center rounded-[16px]"
              style={{ border: '1px dashed var(--border)', background: 'var(--card)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)' }}>
                <ImageOff size={22} style={{ color: 'var(--purple-light)' }} />
              </div>
              <h3 className="text-[17px] font-semibold" style={{ color: 'var(--white)' }}>No Work Available</h3>
              <p className="text-[13px] max-w-xs" style={{ color: 'var(--muted)' }}>
                No {data.name} work has been uploaded yet. Check back soon!
              </p>
            </div>
          </FadeUp>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 md:px-[60px] py-20 md:py-[110px]" style={{ background: 'var(--deep)' }}>
        <FadeUp>
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-[28px] font-semibold tracking-[-0.5px] mb-4" style={{ color: 'var(--white)' }}>
              Interested in <span style={{ color: 'var(--purple-light)' }}>{data.name}</span>?
            </h2>
            <p className="text-[14px] leading-[1.85] mb-8" style={{ color: 'var(--muted)' }}>
              Let&apos;s talk about your project and find the perfect solution for you.
            </p>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-block"
            >
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-10 py-[15px] rounded-[50px] text-[13px] tracking-[1px] uppercase font-medium text-white no-underline"
                style={{ background: 'var(--purple)', border: '2px solid var(--purple)', boxShadow: '0 0 24px var(--purple-glow)' }}>
                Contact Me <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </FadeUp>
      </section>
    </>
  )
}
