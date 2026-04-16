'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LinkedInIcon, InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from './SocialIcons'
import { FadeUp } from './Animate'

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mustafa-graphics-481226325/', icon: LinkedInIcon },
  { label: 'Instagram', href: 'https://www.instagram.com/mustafagraphics001/', icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/mustafa.graphics.2025', icon: FacebookIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@mustafagraphics001', icon: TikTokIcon },
  { label: 'WhatsApp', href: 'https://wa.me/message/2YK76JHY3LJND1', icon: WhatsAppIcon },
]

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--deep)' }}>
      {/* Top row */}
      <FadeUp>
      <div className="px-6 md:px-[60px] py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Brand */}
        <div>
          <div className="text-[20px] font-semibold mb-3" style={{ color: 'var(--white)' }}>
            Mustafa <span style={{ color: 'var(--purple-light)' }}>Graphics</span>
          </div>
          <p className="text-[13px] leading-[1.8] mb-5 max-w-[220px]" style={{ color: 'var(--muted)' }}>
            Creative graphic designer from Pakistan crafting visuals that speak louder than words.
          </p>
          {/* Social icons */}
          <div className="flex gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -3, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="w-9 h-9 rounded-[8px] flex items-center justify-center transition-all duration-200"
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
                <Icon size={15} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="text-[11px] tracking-[2px] uppercase font-medium mb-5" style={{ color: 'var(--muted)' }}>
            Quick Links
          </div>
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map(({ href, label }) => (
              <motion.li
                key={href}
                initial={false}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              >
                <Link
                  href={href}
                  className="text-[13px] no-underline flex items-center gap-2 relative transition-colors duration-200"
                  style={{ color: 'var(--muted)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--purple-light)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--muted)'
                  }}
                >
                  <span className="w-3 h-px" style={{ background: 'var(--border)' }} />
                  <span className="relative inline-flex items-center">
                    {label}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
      </FadeUp>

      {/* Bottom bar */}
      <div
        className="px-6 md:px-[60px] py-5 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="text-[12px]" style={{ color: 'var(--muted)' }}>
          © 2025 Mustafa Graphics. All rights reserved.
        </div>
        <div className="flex gap-5">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] tracking-[0.8px] uppercase font-medium no-underline transition-colors duration-200 hover:text-white flex items-center gap-1.5"
              style={{ color: 'var(--muted)' }}
            >
              <Icon size={11} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
