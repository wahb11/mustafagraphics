'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import ServiceCard from '@/components/ServiceCard'
import WorkCard from '@/components/WorkCard'
import { FadeUp, FadeLeft, FadeRight, HeroStagger, HeroItem } from '@/components/Animate'
import { Review, Work } from '@/lib/supabase'
import { getFeaturedWorks } from '@/lib/works'
import { getApprovedReviews, submitReview } from '@/lib/reviews'
import { Sparkles, Briefcase, Users, Star, ArrowRight } from 'lucide-react'
import { LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/SocialIcons'

// ── constants ────────────────────────────────────────────────────────────────
const SERVICES = [
  { name: 'Logo Design', description: 'Professional logos, brand marks, and complete brand identity packages that make your business stand out.', tools: ['Illustrator', 'Photoshop', 'CorelDRAW'], slug: 'logo-design', icon: '✦' },
  { name: 'Social Media Design', description: 'Eye-catching posts, stories, and reels graphics for Instagram, Facebook, and more platforms.', tools: ['Instagram', 'Facebook', 'TikTok'], slug: 'social-media', icon: '◈' },
  { name: 'Banner Design', description: 'Facebook covers, YouTube channel art, LinkedIn banners crafted to impress on every platform.', tools: ['Facebook', 'YouTube', 'LinkedIn'], slug: 'banner-design', icon: '▭' },
  { name: 'YouTube Thumbnail', description: 'High-CTR thumbnails designed to get more clicks and grow your channel faster.', tools: ['Photoshop', 'CorelDRAW'], slug: 'youtube-thumbnail', icon: '▶' },
  { name: 'Graphic Design', description: 'Posters, flyers, brochures, and print materials designed with professional quality.', tools: ['Photoshop', 'Illustrator'], slug: 'graphic-design', icon: '◉' },
  { name: 'Branding Package', description: 'Complete branding solutions — logo, colors, typography, and brand guidelines all in one.', tools: ['Full Branding', 'Guidelines'], slug: 'branding-package', icon: '◈' },
]

const STATS = [
  { num: 2, suffix: '+', label: 'Years Experience', icon: Briefcase },
  { num: 60, suffix: '+', label: 'Projects Done', icon: Sparkles },
  { num: 40, suffix: '+', label: 'Happy Clients', icon: Users },
  { num: 100, suffix: '%', label: 'Satisfaction', icon: Star },
]
const SKILLS = [
  { name: 'Logo Design', pct: 92 },
  { name: 'Social Media Design', pct: 90 },
  { name: 'Complete Branding', pct: 88 },
  { name: 'Thumbnail Design', pct: 85 },
  { name: 'Adobe Photoshop', pct: 88 },
  { name: 'Adobe Illustrator', pct: 82 },
  { name: 'CorelDRAW', pct: 95 },
];

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mustafa-graphics-481226325/', icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/mustafagraphics001/', icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/mustafa.graphics.2025', icon: FacebookIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@mustafagraphics001', icon: TikTokIcon },
]

const ease = [0.22, 1, 0.36, 1] as const

const FALLBACK_TESTIMONIALS: Review[] = [
  {
    id: 'demo-1',
    name: 'Ayesha Khan',
    role: 'Startup Founder',
    message: 'Mustafa delivered a clean logo and social kit that instantly made our brand look premium.',
    rating: 5,
    status: 'approved',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Bilal Ahmed',
    role: 'YouTube Creator',
    message: 'My thumbnail CTR improved after the redesign. Great communication and fast revisions.',
    rating: 5,
    status: 'approved',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Hira Malik',
    role: 'Marketing Lead',
    message: 'Professional banners and social posts that matched our campaign style perfectly.',
    rating: 4,
    status: 'approved',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    name: 'Usman Raza',
    role: 'E-commerce Owner',
    message: 'Excellent branding work and smooth communication throughout the project. Highly recommended.',
    rating: 5,
    status: 'approved',
    created_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
  },
]

// ── count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let cur = 0
    const step = Math.ceil(target / (1800 / 16))
    const t = setInterval(() => {
      cur += step
      if (cur >= target) { setCount(target); clearInterval(t) }
      else setCount(cur)
    }, 16)
    return () => clearInterval(t)
  }, [active, target])
  return count
}

// ── sub-components ────────────────────────────────────────────────────────────
function StatItem({ num, suffix, label, icon: Icon }: { num: number; suffix: string; label: string; icon: React.ElementType }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const count = useCountUp(num, inView)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease }}
      className="flex-1 py-7 md:py-8 md:pl-10 first:pl-0 border-r last:border-r-0 flex flex-col gap-2"
      style={{ borderColor: 'var(--border)' }}
    >
      <Icon size={18} style={{ color: 'var(--purple-light)', opacity: 0.7 }} />
      <div className="text-[38px] font-semibold tracking-[-1.5px]" style={{ color: 'var(--white)' }}>
        {count}<span style={{ color: 'var(--purple-light)' }}>{suffix}</span>
      </div>
      <div className="text-[12px] tracking-[0.8px] uppercase" style={{ color: 'var(--muted)' }}>{label}</div>
    </motion.div>
  )
}

function SkillBar({ name, pct, index }: { name: string; pct: number; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease }}
      className="flex flex-col gap-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-[13px] font-medium" style={{ color: 'var(--white)' }}>{name}</span>
        <span className="text-[12px] font-semibold" style={{ color: 'var(--purple-light)' }}>{pct}%</span>
      </div>
      <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--purple), var(--purple-light))' }}
          initial={{ width: 0 }}
          animate={{ width: inView ? `${pct}%` : 0 }}
          transition={{ duration: 1.4, delay: index * 0.08 + 0.2 }}
        />
      </div>
    </motion.div>
  )
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [featuredWorks, setFeaturedWorks] = useState<Work[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [formData, setFormData] = useState({ name: '', role: '', message: '', rating: 5 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => { getFeaturedWorks(6).then(setFeaturedWorks) }, [])
  useEffect(() => { getApprovedReviews(6).then(setReviews) }, [])

  const shownReviews = reviews.length > 0 ? reviews : FALLBACK_TESTIMONIALS

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitMessage(null)
    setIsSubmitting(true)

    const result = await submitReview(formData)
    if (result.success) {
      setSubmitMessage({ type: 'success', text: 'Thanks! Your review was submitted and will appear after admin approval.' })
      setFormData({ name: '', role: '', message: '', rating: 5 })
    } else {
      setSubmitMessage({ type: 'error', text: result.error || 'Unable to submit review right now.' })
    }
    setIsSubmitting(false)
  }

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center items-center px-6 md:px-[60px] pt-36 pb-24 overflow-hidden">
        {/* Glows */}
        {[
          { x: '60%', y: '-10%', s: 520, d: 0 },
          { x: '82%', y: '45%', s: 300, d: 1.8 },
          { x: '-4%', y: '65%', s: 260, d: 3.2 },
        ].map((o, i) => (
          <motion.div key={i} className="absolute rounded-full pointer-events-none"
            style={{ left: o.x, top: o.y, width: o.s, height: o.s, background: 'var(--purple-glow)', filter: 'blur(48px)' }}
            animate={{ y: [0, -18, 0], opacity: [0.3, 0.55, 0.3] }}
            transition={{ duration: 6 + o.d, repeat: Infinity, ease: 'easeInOut', delay: o.d }}
          />
        ))}
        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(var(--purple-light) 1px,transparent 1px),linear-gradient(90deg,var(--purple-light) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />

        {[0, 1, 2].map(index => (
          <motion.div
            key={`float-shape-${index}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: index === 0 ? 22 : index === 1 ? 30 : 16,
              height: index === 0 ? 22 : index === 1 ? 30 : 16,
              border: '1px solid var(--purple)',
              background: 'var(--purple-glow)',
              left: index === 0 ? '20%' : index === 1 ? '76%' : '62%',
              top: index === 0 ? '24%' : index === 1 ? '34%' : '66%',
            }}
            animate={{ y: [0, -12, 0], x: [0, 6, 0], opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
          />
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-4xl text-center">
          <HeroStagger>
            {/* Badge */}
            <HeroItem>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-[50px] text-[11px] tracking-[2px] uppercase font-medium"
                style={{ color: 'var(--purple-light)', border: '1px solid var(--purple)', background: 'var(--purple-glow)' }}>
                <Sparkles size={11} />
                Creative Graphic Designer — Pakistan
              </div>
            </HeroItem>

            {/* Name */}
            <HeroItem>
              <h1
                className="leading-none tracking-[-1px] mb-3 font-bold"
                style={{
                  fontSize: 'clamp(52px, 8vw, 96px)',
                  fontFamily: 'Poppins, system-ui, -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif',
                }}
              >
                Mustafa<br />
                <span style={{ color: 'var(--purple-light)' }}>Graphics</span>
              </h1>
            </HeroItem>

            {/* Sub-label */}
            <HeroItem>
              <div className="mt-2 mb-8 flex items-center justify-center gap-3 text-[13px] font-medium" style={{ color: 'var(--muted)' }}>
                <span className="w-8 h-px" style={{ background: 'var(--border)' }} />
                Muhammad Mustafa · Graphic Designer · 2+ Years
              </div>
            </HeroItem>

            {/* Description */}
            <HeroItem>
              <p className="max-w-[640px] mx-auto text-[15px] leading-[1.9]" style={{ color: 'var(--muted)' }}>
                I specialize in <strong style={{ color: 'var(--white)', fontWeight: 500 }}>Logo Designs, Social Media Designs, Complete Branding, and Thumbnail Designs</strong> — simple, modern, and effective designs that solve real problems and make brands stand out.
              </p>
            </HeroItem>

            {/* CTAs */}
            <HeroItem>
              <div className="mt-10 flex flex-wrap gap-4 items-center justify-center">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                  <Link href="/work" className="inline-flex items-center gap-2 px-8 py-[15px] rounded-[50px] text-[13px] tracking-[1px] uppercase font-medium text-white no-underline"
                    style={{ background: 'var(--purple)', border: '2px solid var(--purple)', boxShadow: '0 0 28px var(--purple-glow)' }}>
                    View Portfolio <ArrowRight size={14} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-[15px] rounded-[50px] text-[13px] tracking-[1px] uppercase font-medium no-underline transition-colors duration-200"
                    style={{ color: 'var(--purple-light)', border: '1.5px solid var(--purple-light)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--purple-glow)'; e.currentTarget.style.color = 'var(--white)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--purple-light)' }}>
                    Get In Touch <Sparkles size={13} />
                  </Link>
                </motion.div>
              </div>
            </HeroItem>

          </HeroStagger>
        </motion.div>

      </section>

      {/* ═══════════ STATS ═══════════ */}
      <div className="flex flex-col md:flex-row px-6 md:px-[60px]"
        style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--deep)' }}>
        {STATS.map((s) => <StatItem key={s.label} {...s} />)}
      </div>

      {/* ═══════════ ABOUT ═══════════ */}
      <section className="px-6 md:px-[60px] py-24 md:py-[110px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <FadeLeft>
            <div className="section-tag">About Me</div>
            <h2 className="font-semibold leading-[1.05] tracking-[-1px] mb-6"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--white)' }}>
              Designing with purpose,<br />
              <span style={{ color: 'var(--purple-light)' }}>crafting with precision.</span>
            </h2>
            <p className="text-[15px] leading-[1.9] mb-5" style={{ color: 'var(--muted)' }}>
              Hi, I&apos;m <strong style={{ color: 'var(--white)', fontWeight: 500 }}>Muhammad Mustafa</strong> — a graphic designer with <strong style={{ color: 'var(--white)', fontWeight: 500 }}>2+ years of experience</strong> helping brands stand out through creative and impactful designs.
            </p>
            <p className="text-[15px] leading-[1.9] mb-8" style={{ color: 'var(--muted)' }}>
              I specialize in logos, branding, social media posts, and thumbnails that are simple, modern, and effective. I focus on creative ideas, fast delivery, and designs that solve real problems.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {['Logo Design', 'Complete Branding', 'Social Media Design', 'Thumbnail Design'].map((tag, i) => (
                <motion.span key={tag}
                  initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease }}
                  className="px-4 py-2 rounded-[50px] text-[11px] tracking-[0.8px] uppercase font-medium"
                  style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)', color: 'var(--purple-light)' }}>
                  {tag}
                </motion.span>
              ))}
            </div>
          </FadeLeft>

          <FadeRight delay={0.1}>
            <div className="relative rounded-[16px] p-8 overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, var(--purple-glow) 0%, transparent 70%)' }} />
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ background: 'var(--purple)', color: '#fff' }}>M</div>
                  <div>
                    <div className="text-[15px] font-semibold" style={{ color: 'var(--white)' }}>Muhammad Mustafa</div>
                    <div className="text-[12px]" style={{ color: 'var(--purple-light)' }}>Graphic Designer · Pakistan</div>
                  </div>
                </div>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[{ n: '60+', l: 'Projects' }, { n: '40+', l: 'Clients' }, { n: '2+', l: 'Years' }].map(item => (
                    <div key={item.l}>
                      <div className="text-[22px] font-semibold tracking-[-0.5px]" style={{ color: 'var(--white)' }}>{item.n}</div>
                      <div className="text-[11px] uppercase tracking-[0.8px]" style={{ color: 'var(--muted)' }}>{item.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 1, background: 'var(--border)' }} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--muted)' }}>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                    Available for new projects
                  </div>
                  <Link href="/contact" className="px-4 py-2 rounded-[50px] text-[11px] tracking-[0.8px] uppercase font-medium no-underline transition-all duration-200"
                    style={{ background: 'var(--purple)', color: '#fff', border: '1px solid var(--purple)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#6d28d9' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--purple)' }}>
                    Hire Me
                  </Link>
                </div>
                <div className="flex gap-2 pt-1">
                  {SOCIALS.map(({ label, href, icon: Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-all duration-200"
                      style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--purple-light)'; e.currentTarget.style.background = 'var(--purple-glow)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent' }}>
                      <Icon size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 px-4 py-2 rounded-[10px] text-[12px] font-semibold hidden lg:flex items-center gap-2"
              style={{ background: 'var(--card)', border: '1px solid var(--purple)', color: 'var(--purple-light)', boxShadow: '0 0 24px var(--purple-glow)' }}>
              <Star size={12} /> 5-Star Designer
            </motion.div>
          </FadeRight>
        </div>
      </section>

      {/* ═══════════ SKILLS ═══════════ */}
      <section className="px-6 md:px-[60px] py-24 md:py-[110px] overflow-hidden" style={{ background: 'var(--deep)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeUp>
            <div className="section-tag">Expertise</div>
            <h2 className="font-semibold leading-[1.05] tracking-[-1px] mb-6" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--white)' }}>
              Skills &amp; Tools
            </h2>
            <p className="text-[15px] leading-[1.9] mb-4" style={{ color: 'var(--muted)' }}>
              With <strong style={{ color: 'var(--white)', fontWeight: 500 }}>2+ years of experience</strong>, I&apos;ve worked with clients across Pakistan and internationally, delivering quality results every time.
            </p>
            <p className="text-[15px] leading-[1.9]" style={{ color: 'var(--muted)' }}>
              From logo design to social media — I deliver <strong style={{ color: 'var(--white)', fontWeight: 500 }}>quality work on time</strong>, every time.
            </p>
          </FadeUp>
          <div className="flex flex-col gap-5">
            {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED WORKS ═══════════ */}
      <section className="px-6 md:px-[60px] py-24 md:py-[110px] overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <FadeUp>
            <div className="section-tag">My Portfolio</div>
            <h2 className="font-semibold leading-[1.05] tracking-[-1px]" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--white)' }}>
              Featured Work
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
              <Link href="/work" className="inline-flex items-center gap-2 text-[13px] tracking-[1px] uppercase font-medium no-underline hover:text-white transition-colors shrink-0" style={{ color: 'var(--purple-light)' }}>
                View All Work <ArrowRight size={14} />
              </Link>
            </motion.div>
          </FadeUp>
        </div>

        {featuredWorks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredWorks.map((work, i) => (
              <motion.div key={work.id}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.55, delay: i * 0.08, ease }}>
                <WorkCard work={work} />
              </motion.div>
            ))}
          </div>
        ) : (
          <FadeUp>
            <div className="py-20 text-center rounded-[16px] flex flex-col items-center gap-4" style={{ border: '1px dashed var(--border)', background: 'var(--card)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)' }}>
                <Briefcase size={22} style={{ color: 'var(--purple-light)' }} />
              </div>
              <h3 className="text-[18px] font-semibold" style={{ color: 'var(--white)' }}>No Work Available Yet</h3>
              <p className="text-[14px] max-w-xs" style={{ color: 'var(--muted)' }}>
                Coming soon...
              </p>
            </div>
          </FadeUp>
        )}
      </section>

      {/* ═══════════ SERVICES STRIP ═══════════ */}
      <section className="px-6 md:px-[60px] py-24 md:py-[110px] overflow-hidden" style={{ background: 'var(--deep)' }}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <FadeUp>
            <div className="section-tag">What I Offer</div>
            <h2 className="font-semibold leading-[1.05] tracking-[-1px]" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--white)' }}>
              Services
            </h2>
          </FadeUp>
          <FadeUp delay={0.15}>
            <Link href="/services" className="inline-flex items-center gap-2 text-[13px] tracking-[1px] uppercase font-medium no-underline hover:text-white transition-colors shrink-0" style={{ color: 'var(--purple-light)' }}>
              All Services <ArrowRight size={14} />
            </Link>
          </FadeUp>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((svc, i) => <ServiceCard key={svc.slug} {...svc} index={i} />)}
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="px-6 md:px-[60px] py-24 md:py-[110px] overflow-hidden" style={{ background: 'var(--black)' }}>
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 lg:gap-8 items-start">
          <div className="xl:col-span-3">
            <FadeUp>
              <div className="section-tag">Testimonials</div>
              <h2 className="font-semibold leading-[1.05] tracking-[-1px] mb-8" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--white)' }}>
                What clients are saying
              </h2>
            </FadeUp>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shownReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="rounded-[14px] p-5"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <div className="text-[14px] mb-3" style={{ color: 'var(--purple-light)' }}>
                    {'★'.repeat(review.rating)}<span style={{ color: 'var(--border)' }}>{'★'.repeat(Math.max(0, 5 - review.rating))}</span>
                  </div>
                  <p className="text-[14px] leading-[1.8] mb-4" style={{ color: 'var(--muted)' }}>
                    &ldquo;{review.message}&rdquo;
                  </p>
                  <div className="text-[13px] font-medium" style={{ color: 'var(--white)' }}>{review.name}</div>
                  {review.role && (
                    <div className="text-[12px]" style={{ color: 'var(--muted)' }}>{review.role}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <FadeUp delay={0.1} className="xl:col-span-2">
            <div className="rounded-[16px] p-5 md:p-7 h-fit w-full max-w-xl xl:max-w-none mx-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="text-[11px] tracking-[2px] uppercase font-medium mb-2" style={{ color: 'var(--purple-light)' }}>
                Write a Review
              </div>
              <h3 className="text-[24px] font-semibold mb-5" style={{ color: 'var(--white)' }}>Share your feedback</h3>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Role / company (optional)"
                  value={formData.role}
                  onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                />
                <textarea
                  className="form-input min-h-[140px] resize-y"
                  placeholder="How was your experience?"
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                />
                <select
                  className="form-input"
                  value={formData.rating}
                  onChange={e => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                >
                  {[5, 4, 3, 2, 1].map(value => (
                    <option key={value} value={value}>{value} Star{value > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 py-[13px] rounded-[50px] text-[12px] tracking-[1px] uppercase font-medium text-white transition-all duration-200 disabled:opacity-60"
                  style={{ background: 'var(--purple)', border: '2px solid var(--purple)' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
              {submitMessage && (
                <div
                  className="mt-4 text-[12px] px-3 py-2 rounded-[8px]"
                  style={{
                    color: submitMessage.type === 'success' ? '#86efac' : '#fca5a5',
                    border: submitMessage.type === 'success' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.35)',
                    background: submitMessage.type === 'success' ? 'rgba(34,197,94,0.09)' : 'rgba(239,68,68,0.09)',
                  }}
                >
                  {submitMessage.text}
                </div>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="px-6 md:px-[60px] py-24 md:py-[110px] overflow-hidden">
        <FadeUp>
          <div className="relative rounded-[20px] p-12 md:p-16 text-center overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, var(--purple-glow) 0%, transparent 65%)' }} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: 'linear-gradient(var(--purple-light) 1px,transparent 1px),linear-gradient(90deg,var(--purple-light) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="relative z-10">
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="inline-block mb-6">
                <Sparkles size={28} style={{ color: 'var(--purple-light)' }} />
              </motion.div>
              <h2 className="font-semibold leading-[1.05] tracking-[-1px] mb-5" style={{ fontSize: 'clamp(24px, 3.5vw, 44px)', color: 'var(--white)' }}>
                Let&apos;s create something<br />
                <span style={{ color: 'var(--purple-light)' }}>amazing together.</span>
              </h2>
              <p className="text-[15px] leading-[1.85] max-w-lg mx-auto mb-10" style={{ color: 'var(--muted)' }}>
                Have a project in mind? Let&apos;s build your brand the right way.
              </p>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 17 }} className="inline-block">
                <Link href="/contact" className="inline-flex items-center gap-2 px-10 py-[15px] rounded-[50px] text-[13px] tracking-[1px] uppercase font-medium text-white no-underline"
                  style={{ background: 'var(--purple)', border: '2px solid var(--purple)', boxShadow: '0 0 32px var(--purple-glow)' }}>
                  Get In Touch <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </FadeUp>
      </section>
    </>
  )
}
