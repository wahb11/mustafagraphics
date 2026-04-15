'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(max-width: 768px)').matches) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let rafId: number
    let isHovering = false

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx - 5}px, ${my - 5}px)`
    }

    const animate = () => {
      rx += (mx - rx) * 0.22
      ry += (my - ry) * 0.22
      const offset = isHovering ? 28 : 16
      ring.style.transform = `translate(${rx - offset}px, ${ry - offset}px)`
      rafId = requestAnimationFrame(animate)
    }

    const onHoverEnter = () => {
      isHovering = true
      ring.style.width = '56px'
      ring.style.height = '56px'
      ring.style.opacity = '0.4'
    }

    const onHoverLeave = () => {
      isHovering = false
      ring.style.width = '32px'
      ring.style.height = '32px'
      ring.style.opacity = '0.6'
    }

    const attachHoverListeners = () => {
      const interactives = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, label, .work-card, .service-card-hover'
      )
      interactives.forEach(el => {
        el.addEventListener('mouseenter', onHoverEnter)
        el.addEventListener('mouseleave', onHoverLeave)
      })
    }

    document.addEventListener('mousemove', onMouseMove)
    animate()
    attachHoverListeners()

    const mutationObserver = new MutationObserver(attachHoverListeners)
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafId)
      mutationObserver.disconnect()
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[10px] h-[10px] rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{ background: 'var(--purple)', mixBlendMode: 'screen' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] hidden md:block"
        style={{
          width: 32,
          height: 32,
          border: '1.5px solid var(--purple-light)',
          opacity: 0.6,
          transition: 'width 0.15s ease, height 0.15s ease, opacity 0.15s ease',
        }}
      />
    </>
  )
}
