'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WorksGrid from '@/components/WorksGrid'
import { Work } from '@/lib/supabase'
import { getWorks } from '@/lib/works'
import { HeroStagger, HeroItem } from '@/components/Animate'

interface Props {
  initialWorks: Work[]
}

export default function WorkPageClient({ initialWorks }: Props) {
  const [works, setWorks] = useState<Work[]>(initialWorks)

  useEffect(() => {
    let mounted = true
    getWorks().then(data => {
      if (mounted) setWorks(data)
    })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[52vh] flex flex-col justify-center px-6 md:px-[60px] pt-36 pb-20 overflow-hidden">
        <div className="absolute pointer-events-none" style={{
          width: 500, height: 500,
          background: 'radial-gradient(circle, var(--purple-glow) 0%, transparent 70%)',
          top: -100, left: '50%', transform: 'translateX(-50%)',
        }} />
        {/* Animated rings */}
        {[200, 340, 480].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full pointer-events-none hidden lg:block"
            style={{
              width: size, height: size,
              border: '1px dashed var(--border)',
              top: '50%', left: '75%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.4 - i * 0.1,
            }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
          />
        ))}

        <div className="relative z-10 max-w-2xl">
          <HeroStagger>
            <HeroItem>
              <div className="section-tag">My Portfolio</div>
            </HeroItem>
            <HeroItem>
              <h1 className="font-semibold leading-[1.05] tracking-[-1px] mb-6"
                style={{ fontSize: 'clamp(38px, 6vw, 72px)', color: 'var(--white)' }}>
                All Work &amp;<br />
                <span style={{ color: 'var(--purple-light)' }}>Projects</span>
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="text-[15px] leading-[1.85]" style={{ color: 'var(--muted)' }}>
                Browse through my complete portfolio — filter by category to find exactly what you&apos;re looking for.
              </p>
            </HeroItem>
            <HeroItem>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  { n: '60+', l: 'Projects' },
                  { n: '6', l: 'Categories' },
                  { n: '40+', l: 'Happy Clients' },
                ].map(item => (
                  <span key={item.l}
                    className="px-4 py-2 rounded-[50px] text-[12px] font-medium flex items-center gap-2"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--muted)' }}>
                    <span className="font-semibold" style={{ color: 'var(--purple-light)' }}>{item.n}</span>
                    {item.l}
                  </span>
                ))}
              </div>
            </HeroItem>
          </HeroStagger>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 md:px-[60px] py-20 md:py-[110px]" style={{ background: 'var(--deep)' }}>
        <WorksGrid initialWorks={works} showFilters={true} />
      </section>
    </>
  )
}
