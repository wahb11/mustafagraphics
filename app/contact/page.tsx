'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, MapPin, Send, CheckCircle } from 'lucide-react'
import { LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/SocialIcons'
import { FadeUp, FadeLeft, FadeRight, HeroStagger, HeroItem } from '@/components/Animate'

const CONTACT_DETAILS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Message on WhatsApp',
    href: 'https://wa.me/message/2YK76JHY3LJND1',
    accent: true,
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    value: '@mustafagraphics001',
    href: 'https://www.instagram.com/mustafagraphics001/',
    accent: false,
  },
  {
    icon: LinkedInIcon,
    label: 'LinkedIn',
    value: 'Mustafa Graphics',
    href: 'https://www.linkedin.com/in/mustafa-graphics-481226325/',
    accent: false,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Pakistan',
    href: null,
    accent: false,
  },
]

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mustafa-graphics-481226325/', icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/mustafagraphics001/', icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/mustafa.graphics.2025', icon: FacebookIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@mustafagraphics001', icon: TikTokIcon },
]

const SERVICES_LIST = [
  'Logo Design',
  'Social Media Post',
  'Facebook Banner',
  'YouTube Banner',
  'LinkedIn Banner',
  'YouTube Thumbnail',
  'Graphic Design',
  'Branding Package',
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = `Hello! I'm ${name}${email ? ` (${email})` : ''}.\n\nService needed: ${service}\n\n${message}`
    window.open(`https://wa.me/message/2YK76JHY3LJND1?text=${encodeURIComponent(text)}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex flex-col justify-center px-6 md:px-[60px] pt-36 pb-16 overflow-hidden">
        <div className="absolute pointer-events-none" style={{
          width: 600, height: 600,
          background: 'radial-gradient(circle, var(--purple-glow) 0%, transparent 70%)',
          top: -120, right: -120,
        }} />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute pointer-events-none hidden lg:block"
          style={{
            width: 260, height: 260,
            border: '1px dashed var(--border)',
            borderRadius: '50%',
            right: 120, top: '50%', transform: 'translateY(-50%)',
          }}
        />
        <div className="relative z-10 max-w-xl">
          <HeroStagger>
            <HeroItem>
              <div className="section-tag">Get In Touch</div>
            </HeroItem>
            <HeroItem>
              <h1 className="font-semibold leading-[1.05] tracking-[-1px] mb-4"
                style={{ fontSize: 'clamp(38px, 6vw, 68px)', color: 'var(--white)' }}>
                Let&apos;s work<br />
                <span style={{ color: 'var(--purple-light)' }}>together.</span>
              </h1>
            </HeroItem>
            <HeroItem>
              <p className="text-[15px] leading-[1.85]" style={{ color: 'var(--muted)' }}>
                Have a project in mind? I&apos;d love to hear about it. Send me a message and let&apos;s create something amazing together.
              </p>
            </HeroItem>
          </HeroStagger>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-6 md:px-[60px] py-20 md:py-[110px]" style={{ background: 'var(--deep)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">

          {/* Left */}
          <FadeLeft>
            <div className="mb-10">
              <p className="text-[15px] leading-[1.9]" style={{ color: 'var(--muted)' }}>
                I&apos;m <strong style={{ color: 'var(--white)', fontWeight: 500 }}>Muhammad Mustafa</strong>, a graphic designer with 4+ years of experience. Whether it&apos;s a logo, social media content, or a complete rebrand — I&apos;m here to help.
              </p>
            </div>

            {/* Contact cards */}
            <div className="flex flex-col gap-3 mb-10">
              {CONTACT_DETAILS.map((detail, i) => {
                const Icon = detail.icon
                return (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                  >
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-[12px] no-underline transition-all duration-200 group"
                        style={{
                          background: detail.accent ? 'var(--purple-glow)' : 'var(--card)',
                          border: `1px solid ${detail.accent ? 'var(--purple)' : 'var(--border)'}`,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--purple)'
                          e.currentTarget.style.background = 'var(--purple-glow)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = detail.accent ? 'var(--purple)' : 'var(--border)'
                          e.currentTarget.style.background = detail.accent ? 'var(--purple-glow)' : 'var(--card)'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                          style={{
                            background: detail.accent ? 'var(--purple)' : 'var(--deep)',
                            border: `1px solid ${detail.accent ? 'var(--purple)' : 'var(--border)'}`,
                            color: detail.accent ? '#fff' : 'var(--purple-light)',
                          }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-[10px] tracking-[1.5px] uppercase font-medium mb-0.5" style={{ color: 'var(--muted)' }}>
                            {detail.label}
                          </div>
                          <div className="text-[14px] font-medium" style={{ color: 'var(--white)' }}>
                            {detail.value}
                          </div>
                        </div>
                        <div className="ml-auto opacity-40" style={{ color: 'var(--purple-light)' }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-[12px]"
                        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--deep)', border: '1px solid var(--border)', color: 'var(--purple-light)' }}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-[10px] tracking-[1.5px] uppercase font-medium mb-0.5" style={{ color: 'var(--muted)' }}>
                            {detail.label}
                          </div>
                          <div className="text-[14px] font-medium" style={{ color: 'var(--white)' }}>
                            {detail.value}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Social icons */}
            <FadeUp delay={0.2}>
              <div className="text-[11px] tracking-[2px] uppercase font-medium mb-4" style={{ color: 'var(--muted)' }}>
                Follow Me
              </div>
              <div className="flex gap-3">
                {SOCIALS.map(({ label, href, icon: Icon }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ y: -4, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center transition-all duration-200"
                    style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--purple)'
                      e.currentTarget.style.color = 'var(--purple-light)'
                      e.currentTarget.style.background = 'var(--purple-glow)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.color = 'var(--muted)'
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </FadeUp>
          </FadeLeft>

          {/* Form */}
          <FadeRight>
            <div className="p-8 rounded-[16px]" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h2 className="text-[20px] font-semibold tracking-[-0.3px] mb-6" style={{ color: 'var(--white)' }}>
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ali Ahmed"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
                      Your Email
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="ali@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
                    Service Needed
                  </label>
                  <select
                    className="form-input"
                    value={service}
                    onChange={e => setService(e.target.value)}
                    required
                  >
                    <option value="">Select a service...</option>
                    {SERVICES_LIST.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] tracking-[1.5px] uppercase font-medium" style={{ color: 'var(--muted)' }}>
                    Project Details
                  </label>
                  <textarea
                    className="form-input resize-none"
                    rows={4}
                    placeholder="Tell me about your project..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-[10px] text-[13px]"
                    style={{ background: 'var(--purple-glow)', border: '1px solid var(--purple)', color: 'var(--purple-light)' }}
                  >
                    <CheckCircle size={16} />
                    Opening WhatsApp — your message is ready to send!
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="self-start inline-flex items-center gap-2 px-9 py-[15px] rounded-[50px] text-[13px] tracking-[1px] uppercase font-medium text-white"
                  style={{
                    background: 'var(--purple)',
                    border: '2px solid var(--purple)',
                    boxShadow: '0 0 24px var(--purple-glow)',
                  }}
                >
                  <Send size={14} />
                  Send via WhatsApp
                </motion.button>
              </form>
            </div>
          </FadeRight>
        </div>
      </section>
    </>
  )
}
