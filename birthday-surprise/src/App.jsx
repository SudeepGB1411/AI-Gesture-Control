import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const floatingStickers = [
  { emoji: '🐟', label: 'Fish', top: '12%', left: '8%', size: 'text-3xl md:text-4xl', delay: 0.1 },
  { emoji: '🎣', label: 'Fishing rod', top: '20%', left: '82%', size: 'text-3xl md:text-4xl', delay: 0.4 },
  { emoji: '🍫', label: 'Chocolate', top: '68%', left: '9%', size: 'text-3xl md:text-4xl', delay: 0.6 },
  { emoji: '✈️', label: 'Airplane', top: '14%', left: '58%', size: 'text-3xl md:text-4xl', delay: 0.2 },
  { emoji: '🧳', label: 'Suitcase', top: '74%', left: '78%', size: 'text-3xl md:text-4xl', delay: 0.8 },
  { emoji: '🐚', label: 'Seashell', top: '80%', left: '26%', size: 'text-3xl md:text-4xl', delay: 1 },
  { emoji: '📸', label: 'Camera', top: '30%', left: '14%', size: 'text-3xl md:text-4xl', delay: 1.2 },
  { emoji: '✨', label: 'Sparkles', top: '26%', left: '72%', size: 'text-2xl md:text-3xl', delay: 1.4 },
]

const diaryCards = [
  {
    title: 'Coastal calm',
    icon: '🌊',
    copy: 'For more peaceful sunsets, sea breeze moments, and happy days that feel light and warm.',
  },
  {
    title: 'Sweet little joys',
    icon: '🍫',
    copy: 'A year filled with tiny celebrations, cozy smiles, and chocolate-worthy wins.',
  },
  {
    title: 'New horizons',
    icon: '🗺️',
    copy: 'More dreamy travel stories, window-seat views, and memories worth keeping forever.',
  },
]

const travelNotes = ['Beach sunsets', 'Scrapbook moments', 'Fishing vibes', 'Wander often']

const sparkleDots = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  top: `${8 + (index % 6) * 12}%`,
  left: `${6 + (index * 13) % 88}%`,
  duration: 3 + (index % 5),
  delay: index * 0.25,
}))

function App() {
  const [pointer, setPointer] = useState({ x: 0, y: 0, active: false })
  const [particles, setParticles] = useState([])
  const lastParticleRef = useRef(0)

  useEffect(() => {
    const handlePointerMove = (event) => {
      const nextPointer = { x: event.clientX, y: event.clientY, active: true }
      setPointer(nextPointer)

      const now = Date.now()
      if (now - lastParticleRef.current < 90) {
        return
      }

      lastParticleRef.current = now
      const id = `${now}-${Math.random()}`
      const particle = {
        id,
        x: event.clientX,
        y: event.clientY,
        size: 10 + Math.random() * 18,
      }

      setParticles((current) => [...current.slice(-10), particle])
      window.setTimeout(() => {
        setParticles((current) => current.filter((item) => item.id !== id))
      }, 1400)
    }

    const handlePointerLeave = () => {
      setPointer((current) => ({ ...current, active: false }))
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  const headingWords = useMemo(() => ['Happy', 'Birthday'], [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fdf6ef] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_32%),linear-gradient(180deg,_#ffe4d1_0%,_#ffd6c8_18%,_#f4c0b0_34%,_#99d4e4_62%,_#6caec5_78%,_#3f6f8a_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0)_36%,rgba(7,48,73,0.2)_100%)]" />
      <motion.div
        aria-hidden="true"
        className="sun-glow absolute left-1/2 top-[18%] h-52 w-52 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,248,240,0.95)_0%,_rgba(255,199,145,0.65)_38%,_rgba(255,187,117,0.18)_65%,_transparent_100%)] blur-xl md:h-72 md:w-72"
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.76] }}
        transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />

      {sparkleDots.map((dot) => (
        <motion.span
          key={dot.id}
          aria-hidden="true"
          className="absolute h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.8)]"
          style={{ top: dot.top, left: dot.left }}
          animate={{ opacity: [0.15, 1, 0.25], scale: [0.8, 1.4, 0.9] }}
          transition={{ duration: dot.duration, delay: dot.delay, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        />
      ))}

      <div aria-hidden="true" className="cloud cloud-one" />
      <div aria-hidden="true" className="cloud cloud-two" />
      <div aria-hidden="true" className="cloud cloud-three" />

      {floatingStickers.map((sticker, index) => (
        <motion.div
          key={sticker.label}
          aria-label={sticker.label}
          className={`pointer-events-none absolute z-20 hidden select-none drop-shadow-[0_14px_22px_rgba(20,47,79,0.18)] sm:block ${sticker.size}`}
          style={{ top: sticker.top, left: sticker.left }}
          animate={{ y: [0, -18, 0], x: [0, index % 2 === 0 ? 12 : -12, 0], rotate: [0, index % 2 === 0 ? 8 : -8, 0] }}
          transition={{ duration: 7 + index, delay: sticker.delay, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        >
          {sticker.emoji}
        </motion.div>
      ))}

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute hidden text-4xl drop-shadow-[0_16px_30px_rgba(34,73,109,0.28)] md:block"
        initial={{ x: '-12vw', y: '18vh', opacity: 0 }}
        animate={{ x: '95vw', y: ['18vh', '13vh', '17vh'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
      >
        ✈️
      </motion.div>

      {pointer.active && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background: `radial-gradient(180px circle at ${pointer.x}px ${pointer.y}px, rgba(255,255,255,0.24), transparent 70%)`,
          }}
        />
      )}

      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            aria-hidden="true"
            className="pointer-events-none absolute z-30 rounded-full bg-white/80 shadow-[0_0_24px_rgba(255,255,255,0.9)]"
            style={{ width: particle.size, height: particle.size, left: particle.x - particle.size / 2, top: particle.y - particle.size / 2 }}
            initial={{ opacity: 0.65, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.8, y: -24 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      <section className="relative z-20 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 pb-32 pt-12 sm:px-6 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="glass-panel relative overflow-hidden rounded-[2rem] border border-white/35 px-6 py-8 shadow-[0_24px_80px_rgba(22,55,89,0.22)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-700 sm:text-sm"
            >
              <span>Travel diary edition</span>
              <span className="text-base">🌤️</span>
            </motion.div>

            <div className="space-y-3 sm:space-y-4">
              <div className="overflow-hidden">
                <motion.div
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[clamp(3rem,10vw,6.2rem)] font-semibold leading-none tracking-[-0.08em] text-white drop-shadow-[0_12px_30px_rgba(46,83,120,0.28)]"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.14 } },
                  }}
                >
                  {headingWords.map((word) => (
                    <motion.span
                      key={word}
                      variants={{ hidden: { y: 110, opacity: 0 }, visible: { y: 0, opacity: 1 } }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="font-['Playfair_Display',serif] text-[clamp(2.5rem,8vw,5rem)] leading-none tracking-[-0.05em] text-[#21415a] drop-shadow-[0_8px_20px_rgba(255,255,255,0.38)]"
              >
                Chandana <span className="inline-block align-top">✨</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7 }}
                className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8"
              >
                Wishing you happiness, peaceful waves, beautiful journeys, and endless smiles ahead 🌊
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {travelNotes.map((note, index) => (
                <motion.span
                  key={note}
                  className="rounded-full border border-white/45 bg-white/45 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_8px_20px_rgba(255,255,255,0.18)] backdrop-blur"
                  animate={{ y: [0, index % 2 === 0 ? -5 : 5, 0] }}
                  transition={{ duration: 4 + index, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                >
                  {note}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.7 }}
              className="mt-8 grid gap-4 sm:grid-cols-3"
            >
              {diaryCards.map((card, index) => (
                <motion.article
                  key={card.title}
                  className="rounded-[1.5rem] border border-white/40 bg-white/30 p-4 text-left shadow-[0_16px_40px_rgba(34,73,109,0.14)] backdrop-blur-md"
                  whileHover={{ y: -8, rotate: index === 1 ? -1 : 1, scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-2xl">{card.icon}</span>
                    <span className="rounded-full bg-white/55 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-slate-600">
                      Note {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#21415a]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{card.copy}</p>
                </motion.article>
              ))}
            </motion.div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 34 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: 'easeOut' }}
            className="flex flex-col gap-5"
          >
            <motion.div
              className="glass-panel rounded-[2rem] border border-white/35 p-5 shadow-[0_24px_70px_rgba(22,55,89,0.18)] backdrop-blur-xl sm:p-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Scrapbook highlight</p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#21415a]">A sunset postcard for Chandana</h3>
                </div>
                <div className="rounded-full border border-white/50 bg-white/45 px-3 py-2 text-2xl shadow-lg">🐚</div>
              </div>

              <div className="photo-card mt-6 overflow-hidden rounded-[1.75rem] border border-white/45 bg-white/35 p-4 shadow-[0_18px_42px_rgba(28,73,102,0.18)]">
                <div className="relative h-72 overflow-hidden rounded-[1.35rem] bg-[linear-gradient(180deg,_rgba(255,226,202,0.95)_0%,_rgba(255,190,146,0.88)_28%,_rgba(135,209,226,0.92)_68%,_rgba(74,135,167,0.98)_100%)] sm:h-80">
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_rgba(255,255,255,0)_55%),linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(19,73,108,0.12)_100%)]" />
                  <motion.div
                    className="absolute left-1/2 top-[20%] h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(255,245,234,0.98)_0%,_rgba(255,211,163,0.72)_45%,_rgba(255,184,113,0.18)_70%,_transparent_100%)] blur-[2px] sm:h-28 sm:w-28"
                    animate={{ scale: [1, 1.06, 1], opacity: [0.78, 1, 0.82] }}
                    transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-x-6 top-8 flex justify-between text-2xl opacity-90">
                    <motion.span animate={{ x: [0, 12, 0], y: [0, -5, 0] }} transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
                      ☁️
                    </motion.span>
                    <motion.span animate={{ x: [0, -10, 0], y: [0, 6, 0] }} transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>
                      ☁️
                    </motion.span>
                  </div>
                  <motion.span
                    className="absolute left-[14%] top-[50%] text-3xl"
                    animate={{ x: [0, 18, 0], y: [0, -8, 0] }}
                    transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                  >
                    🐟
                  </motion.span>
                  <motion.span
                    className="absolute right-[18%] top-[58%] text-3xl"
                    animate={{ x: [0, -16, 0], y: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                  >
                    🐟
                  </motion.span>
                  <div className="absolute inset-x-0 bottom-0">
                    <div className="wave wave-back" />
                    <div className="wave wave-front" />
                  </div>
                  <div className="absolute bottom-9 right-8 rounded-full bg-white/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                    🌅 soft coastal mood
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
                  <span className="rounded-full bg-white/55 px-3 py-1.5 font-medium">Captured with calm skies</span>
                  <span className="font-semibold tracking-[0.24em] text-slate-500">VOL. 2026</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="glass-panel rounded-[2rem] border border-white/35 p-5 shadow-[0_24px_70px_rgba(22,55,89,0.16)] backdrop-blur-xl sm:p-6"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 8.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Birthday wish list</p>
                  <h3 className="mt-3 text-2xl font-semibold text-[#21415a]">More waves, more wonder, more joy</h3>
                </div>
                <div className="text-3xl">🧭</div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/45 bg-white/40 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Vibe</p>
                  <p className="mt-2 text-base font-medium text-[#21415a]">Peaceful beach evenings</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/45 bg-white/40 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Adventure</p>
                  <p className="mt-2 text-base font-medium text-[#21415a]">Fresh stamps in the travel diary</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/45 bg-white/40 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Sweet note</p>
                  <p className="mt-2 text-base font-medium text-[#21415a]">May every month bring new places to explore and little pockets of happiness to keep.</p>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </div>
      </section>
    </main>
  )
}

export default App
