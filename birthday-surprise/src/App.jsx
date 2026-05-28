import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const stickers = [
  { icon: '🐟', className: 'left-[6%] top-[24%]', duration: 8 },
  { icon: '🎣', className: 'left-[14%] top-[70%]', duration: 10 },
  { icon: '🍫', className: 'right-[12%] top-[20%]', duration: 9 },
  { icon: '✈️', className: 'right-[8%] top-[38%]', duration: 12 },
  { icon: '🧳', className: 'right-[18%] bottom-[18%]', duration: 9 },
  { icon: '🐚', className: 'left-[9%] bottom-[14%]', duration: 11 },
  { icon: '📸', className: 'left-[24%] top-[14%]', duration: 10 },
  { icon: '✨', className: 'right-[28%] bottom-[24%]', duration: 8 },
]

const seeded = (seed) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function createWaveNoise(audioContext) {
  const bufferSize = audioContext.sampleRate * 2
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
  const output = buffer.getChannelData(0)
  let last = 0

  for (let i = 0; i < bufferSize; i += 1) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    output[i] = last * 3.5
  }

  return buffer
}

function App() {
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [soundOn, setSoundOn] = useState(false)
  const lastSpawnRef = useRef(0)
  const particleIdRef = useRef(0)
  const audioContextRef = useRef(null)
  const sourceRef = useRef(null)

  const stars = useMemo(
    () =>
      Array.from({ length: 26 }, (_, index) => ({
        id: index,
        left: `${seeded(index + 1) * 100}%`,
        top: `${seeded(index + 3) * 80}%`,
        size: `${seeded(index + 7) * 7 + 4}px`,
        delay: seeded(index + 11) * 4,
      })),
    [],
  )

  const parallaxStyle = useMemo(
    () => ({
      transform: `translate3d(${(pointer.x - window.innerWidth / 2) * 0.012}px, ${(pointer.y - window.innerHeight / 2) * 0.012}px, 0)`,
    }),
    [pointer],
  )

  const startAmbient = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext()
    }
    const context = audioContextRef.current
    if (context.state === 'suspended') {
      await context.resume()
    }

    const source = context.createBufferSource()
    source.buffer = createWaveNoise(context)
    source.loop = true

    const filter = context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 620

    const gain = context.createGain()
    gain.gain.value = 0.015

    source.connect(filter)
    filter.connect(gain)
    gain.connect(context.destination)
    source.start()
    sourceRef.current = source
  }

  const stopAmbient = () => {
    if (sourceRef.current) {
      sourceRef.current.stop()
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
  }

  useEffect(() => {
    if (soundOn) {
      startAmbient()
    } else {
      stopAmbient()
    }

    return () => stopAmbient()
  }, [soundOn])

  useEffect(
    () => () => {
      stopAmbient()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    },
    [],
  )

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event
    setPointer({ x: clientX, y: clientY })

    const now = Date.now()
    if (now - lastSpawnRef.current < 90) return

    lastSpawnRef.current = now
    const id = particleIdRef.current
    particleIdRef.current += 1

    setParticles((current) => [
      ...current,
      {
        id,
        x: clientX,
        y: clientY,
        icon: Math.random() > 0.5 ? '✨' : '🫧',
      },
    ])

    setTimeout(() => {
      setParticles((current) => current.filter((particle) => particle.id !== id))
    }, 850)
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eff7ff_0%,#f9d7bf_45%,#fbead2_72%,#dff5ff_100%)] text-slate-900"
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-14 h-52 w-52 -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />
        <div className="cloud cloud-a" />
        <div className="cloud cloud-b" />
        <div className="cloud cloud-c" />

        {stars.map((star) => (
          <span
            key={star.id}
            className="sparkle"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size, animationDelay: `${star.delay}s` }}
          />
        ))}

        <div className="wave wave-back" />
        <div className="wave wave-mid" />
        <div className="wave wave-front" />
      </div>

      {stickers.map((sticker) => (
        <motion.span
          key={sticker.icon}
          className={`pointer-events-none absolute text-3xl drop-shadow-[0_0_18px_rgba(255,255,255,0.75)] sm:text-4xl ${sticker.className}`}
          animate={{ y: [0, -15, 0], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: sticker.duration, ease: 'easeInOut' }}
        >
          {sticker.icon}
        </motion.span>
      ))}

      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="pointer-events-none fixed text-xl"
            style={{ left: particle.x, top: particle.y }}
            initial={{ opacity: 0, scale: 0.6, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -26 }}
            exit={{ opacity: 0, scale: 0.4, y: -42 }}
            transition={{ duration: 0.7 }}
          >
            {particle.icon}
          </motion.span>
        ))}
      </AnimatePresence>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <motion.div
          style={parallaxStyle}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="glass-panel w-full max-w-3xl rounded-[2rem] p-7 text-center shadow-[0_18px_90px_rgba(21,76,118,0.22)] sm:p-10"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.05em' }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-xs font-medium uppercase tracking-[0.25em] text-sky-800/70"
          >
            Coastal Birthday Story
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 text-4xl font-semibold leading-tight text-slate-800 drop-shadow-[0_0_16px_rgba(255,255,255,0.8)] sm:text-6xl"
          >
            Happy Birthday
            <span className="block bg-gradient-to-r from-sky-600 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Chandana ✨
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-700 sm:text-base"
          >
            Wishing you happiness, peaceful waves, beautiful journeys, and endless smiles ahead 🌊
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="mt-8 grid gap-3 text-left sm:grid-cols-3"
          >
            {[
              ['🌅', 'Sunset Moods'],
              ['🗺️', 'New Adventures'],
              ['🍫', 'Sweet Moments'],
            ].map(([emoji, label]) => (
              <div key={label} className="rounded-2xl border border-white/55 bg-white/40 p-3 backdrop-blur-md">
                <p className="text-lg">{emoji}</p>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-700/90">{label}</p>
              </div>
            ))}
          </motion.div>

          <motion.button
            type="button"
            onClick={() => setSoundOn((current) => !current)}
            whileTap={{ scale: 0.97 }}
            className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-white/65 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-700 backdrop-blur-md transition hover:bg-white/80"
          >
            {soundOn ? '🔊 Ocean ambience on' : '🔈 Ocean ambience off'}
          </motion.button>
        </motion.div>
      </section>
    </main>
  )
}

export default App
