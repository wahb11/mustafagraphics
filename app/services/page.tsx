'use client'

import { motion } from 'framer-motion'
import ServiceCard from '@/components/ServiceCard'
import Link from 'next/link'
import { ArrowRight, Zap, RefreshCw, Gem, MessageSquare } from 'lucide-react'
import { FadeUp, HeroStagger, HeroItem } from '@/components/Animate'

const SERVICES = [
  {
    icon: '✦',
    name: 'Logo Design',
    description: 'Professional logos, brand marks, and complete brand identity packages that make your business stand out in a crowded marketplace.',
    tools: ['Illustrator', 'Photoshop', 'CorelDRAW'],
    slug: 'logo-design',
  },
  {
    icon: '◈',
    name: 'Social Media Design',
    description: 'Eye-catching social media posts, stories, and reels graphics for Instagram, Facebook, TikTok, and more platforms.',
    tools: ['Instagram', 'Facebook', 'TikTok'],
    slug: 'social-media',
  },
  {
    icon: '▭',
    name: 'Banner Design',
    description: 'Facebook covers, YouTube channel art, LinkedIn banners, and all platform-specific banner designs crafted to impress.',
    tools: ['Facebook', 'YouTube', 'LinkedIn'],
    slug: 'banner-design',
  },
  {
    icon: '▶',
    name: 'YouTube Thumbnail',
    description: 'High-CTR YouTube thumbnails designed to get more clicks and grow your channel faster with compelling visuals.',
    tools: ['Photoshop', 'CorelDRAW'],
    slug: 'youtube-thumbnail',
  },
  {
    icon: '◉',
    name: 'Graphic Design',
    description: 'Posters, flyers, brochures, and print materials designed with creativity and professional quality that stands out.',
    tools: ['Photoshop', 'Illustrator'],
    slug: 'graphic-design',
  },
  {
    icon: '◈',
    name: 'Branding Package',
    description: 'Complete branding solutions — logo, colors, typography, and brand guidelines all in one comprehensive package.',
    tools: ['Full Branding', 'Guidelines'],
    slug: 'branding-package',
  },
]

const WHY_ME = [
  { icon: Zap, title: 'Fast Delivery', desc: 'Quick turnaround without compromising on quality. Most projects delivered within 24–48 hours.' },
  { icon: RefreshCw, title: 'Free Revisions', desc: 'Your satisfaction matters. I offer revisions until you are 100% happy with the result.' },
  { icon: Gem, title: 'Premium Quality', desc: 'Every design is crafted with attention to detail and professional industry standards.' },
  { icon: MessageSquare, title: 'Direct Communication', desc: 'Work directly with me — no middlemen, clear updates, and real-time feedback.' },
]

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex flex-col justify-center px-6 md:px-[60px] pt-36 pb-20 overflow-hidden">
        <div className="absolute pointer-events-none" style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, var(--purple-glow) 0%, transparent 70%)',
          top: -120, left: '40%', transform: 'translateX(-50%)',
        }} />
        <div className="relative z-10 max-w-2xl">
          <HeroStagger>
            <HeroItem>
              <div className="section-tag">What I Offer</div>
            </HeroItem>
            <HeroItem>
              <h1 className="font-semibold leading-[1.05] tracking-[-1px] mb-6"
                style={{ fontSize: 'clamp(38px, 6vw, 72px)', color: 'var(--white)' }}>
                Design Services<br />
                <span style={{ color: 'var(--purple-light)' }}>Built For You</span>
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="text-[15px] leading-[1.85] max-w-lg" style={{ color: 'var(--muted)' }}>
                From logo design to complete brand identities — I offer a full range of graphic design services tailored to your needs and budget.
              </p>
            </HeroItem>
          </HeroStagger>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 md:px-[60px] py-20 md:py-[110px]" style={{ background: 'var(--deep)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.slug} {...svc} index={i} />
          ))}
        </div>
      </section>

      {/* Why Me */}
      <section className="px-6 md:px-[60px] py-20 md:py-[110px] overflow-hidden">
        <FadeUp>
          <div className="text-center mb-14">
            <div className="section-tag justify-center">Why Choose Me</div>
            <h2 className="font-semibold leading-[1.05] tracking-[-1px]"
              style={{ fontSize: 'clamp(26px, 4vw, 44px)', color: 'var(--white)' }}>
              The Mustafa Difference
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_ME.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[12px] text-center transition-all duration-300"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--purple)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px var(--purple-glow)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center"
                  style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)' }}>
                  <Icon size={18} style={{ color: 'var(--purple-light)' }} />
                </div>
                <div className="text-[15px] font-semibold mb-3" style={{ color: 'var(--white)' }}>{item.title}</div>
                <p className="text-[13px] leading-[1.8]" style={{ color: 'var(--muted)' }}>{item.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-[60px] pb-24 md:pb-[110px]">
        <FadeUp>
          <div className="text-center py-16 rounded-[16px] relative overflow-hidden"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, var(--purple-glow) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <h2 className="text-[28px] font-semibold tracking-[-0.5px] mb-4" style={{ color: 'var(--white)' }}>
                Ready to start your project?
              </h2>
              <p className="text-[14px] mb-8" style={{ color: 'var(--muted)' }}>
                Get in touch and let&apos;s discuss your needs.
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
          </div>
        </FadeUp>
      </section>
    </>
  )
}
