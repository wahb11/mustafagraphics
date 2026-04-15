'use client'

import { motion, cubicBezier } from 'framer-motion'

// Smooth ease — properly typed via cubicBezier()
const ease = cubicBezier(0.22, 1, 0.36, 1)

const T = (delay = 0) => ({ duration: 0.65, ease, delay })
const TSm = (delay = 0) => ({ duration: 0.5, ease, delay })

interface AnimProps {
  children: React.ReactNode
  className?: string
  delay?: number
  once?: boolean
}

// ─── FadeUp: comes from below ────────────────────────────────────────────────
export function FadeUp({ children, className, delay = 0, once = true }: AnimProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={T(delay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeUpSm({ children, className, delay = 0, once = true }: AnimProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-40px' }}
      transition={TSm(delay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── FadeLeft: comes from left ────────────────────────────────────────────────
export function FadeLeft({ children, className, delay = 0, once = true }: AnimProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -44 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={T(delay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── FadeRight: comes from right ─────────────────────────────────────────────
export function FadeRight({ children, className, delay = 0, once = true }: AnimProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 44 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={T(delay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── ScaleUp ──────────────────────────────────────────────────────────────────
export function ScaleUp({ children, className, delay = 0, once = true }: AnimProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once, margin: '-60px' }}
      transition={T(delay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Hero stagger — uses animate (not whileInView) for above-fold content ────
export function HeroStagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HeroItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Scroll-triggered stagger grid ───────────────────────────────────────────
export function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className, delay = 0 }: AnimProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 36 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease, delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
