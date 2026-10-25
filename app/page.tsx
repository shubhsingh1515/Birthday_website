'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Gift, Heart, Music2, Pause, Play, RotateCcw, Sparkles, Volume2, VolumeX, X } from 'lucide-react'
import { birthdayConfig } from '@/lib/birthday-config'

type Scene = 'intro' | 'heart' | 'tree' | 'letter' | 'game' | 'gallery' | 'final'
const scenes: Scene[] = ['intro', 'heart', 'tree', 'letter', 'game', 'gallery', 'final']
const labels = ['Welcome', 'A little something', 'Your day', 'A letter', 'Love games', 'Our moments', 'Your surprise']

const hearts = Array.from({ length: 56 }, (_, i) => ({ left: `${(i * 37) % 100}%`, top: `${(i * 61) % 92}%`, size: 12 + (i % 5) * 5, delay: `${(i % 9) * 0.45}s`, duration: `${5 + (i % 5)}s`, tone: i % 5 }))
const canopy = Array.from({ length: 42 }, (_, i) => ({ left: `${16 + ((i * 29) % 68)}%`, top: `${8 + ((i * 47) % 57)}%`, rotate: `${-28 + ((i * 31) % 56)}deg`, delay: `${(i % 8) * 0.2}s`, size: 18 + (i % 4) * 6 }))

function FloatingHearts({ dark = false }: { dark?: boolean }) {
  return <div className={`floating-hearts ${dark ? 'dark-hearts' : ''}`} aria-hidden="true">{hearts.map((heart, i) => <Heart key={i} className={`float-heart tone-${heart.tone}`} fill="currentColor" style={{ left: heart.left, top: heart.top, width: heart.size, height: heart.size, animationDelay: heart.delay, animationDuration: heart.duration }} />)}</div>
}

function Progress({ scene, onBack, onForward, muted, setMuted }: { scene: Scene; onBack: () => void; onForward: () => void; muted: boolean; setMuted: (v: boolean) => void }) {
  const index = scenes.indexOf(scene)
  return <header className="progress-header">
    <button className="icon-button" onClick={onBack} disabled={index === 0} aria-label="Previous scene"><ArrowLeft size={17} /></button>
    <div className="progress-dots" aria-label={`Scene ${index + 1} of ${scenes.length}`}>{scenes.map((item, i) => <span key={item} className={i <= index ? 'active' : ''}><Heart size={11} fill="currentColor" /></span>)}</div>
    <div className="header-actions"><button className="icon-button" onClick={() => setMuted(!muted)} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button><button className="skip-button" onClick={onForward}>skip <ArrowRight size={13} /></button></div>
  </header>
}

function Intro({ next }: { next: () => void }) {
  return <section className="scene intro-scene" onClick={next}><FloatingHearts dark /><div className="stars" aria-hidden="true" /> <div className="intro-copy"><p className="eyebrow light">a tiny birthday story</p><h1>First things<br /><em>first.</em></h1><div className="cake" aria-label="Birthday cake"><div className="candle"><span /></div><div className="frosting">♥</div><div className="cake-base" /></div><p className="intro-message">Happy Birthday, Supriya <span>♥</span></p><p className="intro-subtitle">Today, the world celebrates someone who makes life brighter.</p><button className="begin-hint" onClick={e => { e.stopPropagation(); next() }}>Tap anywhere to begin <Sparkles size={14} /></button></div></section>
}

function HeartScene({ next }: { next: () => void }) {
  const [pulsed, setPulsed] = useState(false)
  return <section className="scene blush-scene"><FloatingHearts /><div className="scene-center"><p className="eyebrow">a little something, for you</p><h2>Made with<br /><em>all my heart.</em></h2><button className={`big-heart ${pulsed ? 'pulse' : ''}`} onClick={() => { setPulsed(true); setTimeout(next, 750) }} aria-label="Open the next scene"><Heart fill="currentColor" size={104} /></button><p className="microcopy">A little love, waiting to be opened.</p><button className="round-play" onClick={() => { setPulsed(true); setTimeout(next, 750) }} aria-label="Play the love story"><Play fill="currentColor" size={18} /></button></div></section>
}

function TreeScene({ next }: { next: () => void }) {
  return <section className="scene tree-scene"><FloatingHearts /><div className="tree-copy"><p className="eyebrow">it&apos;s officially your day</p><h2>Happy Birthday,<br /><em>beautiful soul.</em></h2><p>Another year of being wonderfully you <span>✦</span></p></div><div className="heart-tree" aria-label="A tree made of hearts"><div className="trunk" />{canopy.map((heart, i) => <Heart key={i} className={`canopy-heart tone-${i % 5}`} fill="currentColor" style={{ left: heart.left, top: heart.top, width: heart.size, height: heart.size, transform: `rotate(${heart.rotate})`, animationDelay: heart.delay }} />)}</div><button className="continue-link" onClick={next}>Tap anywhere to continue <ArrowRight size={15} /></button></section>
}

function LetterScene({ next }: { next: () => void }) {
  const [show, setShow] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const openPasswordPrompt = () => {
    setPassword('')
    setPasswordError(false)
    setPasswordOpen(true)
  }
  const closePasswordPrompt = () => {
    setPassword('')
    setPasswordError(false)
    setPasswordOpen(false)
  }
  const submitPassword = () => {
    if (password === birthdayConfig.letterPassword) {
      setShow(true)
      closePasswordPrompt()
      return
    }
    setPasswordError(true)
    setPassword('')
  }
  return <section className="scene letter-scene"><div className="letter-card"><p className="eyebrow">a note for you</p><h2>To my favorite person<br />in the world <span>♥</span></h2><div className={`letter-body ${show ? 'revealed' : ''}`}><p>Sometimes the ordinary moments become the ones we remember most. The laughter, the quiet, the little things that make a day feel like ours.</p><p>On your birthday, I hope the year ahead gives you countless reasons to smile, the courage to chase what you dream of, and gentle reminders of how special you are.</p><p>You deserve beautiful things, peaceful days, genuine happiness, and a love that makes you feel safe and appreciated.</p><p>Happy Birthday, my love. <span>♥</span></p></div><div className="letter-footer"><span>Forever cheering for you, {birthdayConfig.signature || 'always'} <Heart size={14} fill="currentColor" /></span><button className="text-button" onClick={show ? () => setShow(false) : openPasswordPrompt}>{show ? 'Read it again' : 'Open the letter'} <ArrowRight size={14} /></button></div></div><button className="bottom-continue" onClick={next}>There&apos;s more waiting <ArrowRight size={15} /></button>{passwordOpen && <div className="password-overlay" role="dialog" aria-modal="true" aria-labelledby="letter-password-title"><form className={`password-card ${passwordError ? 'password-shake' : ''}`} onSubmit={e => { e.preventDefault(); submitPassword() }}><button type="button" className="password-close" onClick={closePasswordPrompt} aria-label="Close password prompt"><X size={18} /></button><div className="password-icon"><Heart fill="currentColor" size={28} /></div><p className="eyebrow">a secret for you</p><h3 id="letter-password-title">Open my letter</h3><p>Only the right little secret can unlock these words.</p><label htmlFor="letter-password">Password</label><input id="letter-password" type="password" autoFocus autoComplete="off" value={password} onChange={e => { setPassword(e.target.value); setPasswordError(false) }} placeholder="Enter the password" aria-invalid={passwordError} aria-describedby="letter-password-help" /><button className="primary-button password-submit" type="submit">Unlock the letter <Heart size={15} fill="currentColor" /></button><p id="letter-password-help" className={`password-hint ${passwordError ? 'password-error' : ''}`}>{passwordError ? 'That password is not quite right. Try again.' : 'A little secret, just between us.'}</p></form></div>}</section>
}

function HeartMatch({ onComplete }: { onComplete: () => void }) {
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const cards = ['Always', 'You', 'My heart', 'Always', 'You', 'My heart']
  const choose = (index: number) => {
    if (open.includes(index) || matched.includes(index) || open.length === 2) return
    const nextOpen = [...open, index]
    setOpen(nextOpen)
    if (nextOpen.length === 2) {
      if (cards[nextOpen[0]] === cards[nextOpen[1]]) {
        setTimeout(() => { setMatched(current => [...current, ...nextOpen]); setOpen([]) }, 350)
      } else setTimeout(() => setOpen([]), 700)
    }
  }
  useEffect(() => { if (matched.length === cards.length) setTimeout(onComplete, 750) }, [matched.length, onComplete])
  return <section className="scene match-scene"><div className="game-panel"><p className="eyebrow">love game 04 / 05</p><h2>Match my <em>heart.</em></h2><p className="game-intro">Find each pair of little love notes. Three matches unlock your final surprise.</p><div className="match-grid">{cards.map((card, index) => <button key={index} className={`match-card ${open.includes(index) || matched.includes(index) ? 'revealed' : ''}`} onClick={() => choose(index)} aria-label={open.includes(index) || matched.includes(index) ? card : 'Hidden love note'}><Heart fill="currentColor" size={25} />{(open.includes(index) || matched.includes(index)) && <span>{card}</span>}</button>)}</div><p className="match-count">{matched.length / 2} of 3 matches found</p></div></section>
}

function LoveGame({ next }: { next: () => void }) {
  const [stage, setStage] = useState<'catch' | 'quiz' | 'meter' | 'match' | 'gift'>('catch')
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(20)
  const [quizIndex, setQuizIndex] = useState(0)
  const [answers, setAnswers] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [started, setStarted] = useState(false)
  const [caught, setCaught] = useState(0)
  const gameHearts = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ left: `${10 + ((i * 31) % 80)}%`, top: `${10 + ((i * 17) % 68)}%`, delay: `${i * 0.55}s`, gold: i % 4 === 0 })), [])
  useEffect(() => { if (stage !== 'catch' || !started || time <= 0) return; const timer = setInterval(() => setTime(t => t - 1), 1000); return () => clearInterval(timer) }, [stage, started, time])
  useEffect(() => { if (stage === 'catch' && started && (time === 0 || score >= 100)) { setStarted(false); if (score >= 100) setStage('quiz') } }, [time, score, stage, started])
  const catchHeart = (gold: boolean) => { setScore(s => s + (gold ? 25 : 10)); setCaught(c => c + 1) }
  if (stage === 'catch') return <section className="scene game-scene"><div className="game-panel"><p className="eyebrow">love game 01 / 03</p><h2>Catch my <em>Heart.</em></h2><p className="game-intro">Tap the falling hearts before they float away. Golden hearts are worth extra.</p><div className="score-row"><span>score <strong>{score}</strong> / 100</span><span>{time}s</span></div><div className="game-progress"><span style={{ width: `${Math.min(score, 100)}%` }} /></div><div className="catch-field">{started ? gameHearts.map((heart, i) => <button key={`${i}-${caught}`} className={`falling-heart ${heart.gold ? 'gold' : ''}`} style={{ left: heart.left, top: heart.top, animationDelay: heart.delay }} onClick={() => catchHeart(heart.gold)} aria-label={heart.gold ? 'Catch golden heart' : 'Catch heart'}><Heart fill="currentColor" size={26} /></button>) : <div className="game-start"><Heart fill="currentColor" size={32} /><p>{score ? score >= 100 ? 'You caught all my love.' : 'So close! Give it another try.' : 'Ready, birthday love?'}</p><button className="primary-button" onClick={() => { setStarted(true); setTime(20); setScore(0) }}>{score ? 'Try again, birthday girl' : 'Start catching hearts'}</button></div>}<div className="basket"><Heart fill="currentColor" size={30} /></div></div></div></section>
  if (stage === 'quiz') { const question = birthdayConfig.quiz[quizIndex]; return <section className="scene quiz-scene"><div className="game-panel quiz-panel"><p className="eyebrow">love game 02 / 03</p><h2>How well do you know <em>us?</em></h2><div className="quiz-count">Question {quizIndex + 1} of {birthdayConfig.quiz.length}</div><div className="quiz-card"><h3>{question.question}</h3><div className="answers">{question.answers.map((answer, i) => <button key={answer} className="answer-button" onClick={() => { setFeedback(i === question.correct ? 'That’s right — you know the good stuff. ♥' : 'A sweet answer. I’ll allow it. ♥'); setTimeout(() => { setFeedback(''); if (quizIndex + 1 === birthdayConfig.quiz.length) { setStage('meter') } else { setQuizIndex(v => v + 1); setAnswers(answers + 1) } }, 700) }}>{answer}</button>)}</div>{feedback && <p className="feedback">{feedback}</p>}</div></div></section> }
  if (stage === 'meter') return <section className="scene meter-scene"><div className="game-panel meter-panel"><p className="eyebrow">love game 03 / 05</p><h2>Send a little <em>Joy.</em></h2><p className="game-intro">Choose the heart that feels most like you today. There are no wrong answers.</p><div className="love-meter" aria-label="Choose your love mood">{['Tender', 'Playful', 'Dreamy', 'Forever'].map((mood, i) => <button key={mood} className="mood-button" onClick={() => setStage('match')}><Heart fill="currentColor" size={30} /><span>{mood}</span><small>{['soft and sweet', 'full of sparkle', 'lost in a daydream', 'always and ever'][i]}</small></button>)}</div></div></section>
  if (stage === 'match') return <HeartMatch onComplete={() => setStage('gift')} />
  return <section className="scene gift-scene"><div className="gift-card"><p className="eyebrow">love game 04 / 04</p><h2>You did it, <em>love.</em></h2><p>You found every little piece of this surprise.</p><button className="gift-box" onClick={next} aria-label="Open your surprise"><Gift size={72} /><span>tap to open</span></button><button className="primary-button" onClick={next}>Open your surprise <Heart size={16} fill="currentColor" /></button></div></section>
}

function Gallery({ next }: { next: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const submitPassword = () => {
    if (password === birthdayConfig.letterPassword) {
      setUnlocked(true)
      setPassword('')
      return
    }
    setPasswordError(true)
    setPassword('')
  }
  return <section className="scene gallery-scene"><div className="gallery-header"><div><p className="eyebrow">little pieces of forever</p><h2>Our little <em>moments.</em></h2></div><p className="gallery-note">Eleven memories, saved just for us.</p></div><div className="polaroids">{birthdayConfig.photos.map((photo, i) => <button className={`polaroid tilt-${i}`} key={i} onClick={() => setSelected(i)}>{photo.src ? <img src={photo.src} alt={photo.caption} /> : <div className="photo-placeholder"><Heart size={30} fill="currentColor" /><span>your photo here</span></div>}<span>{photo.caption}</span></button>)}</div><button className="bottom-continue dark-link" onClick={next}>One last thing <ArrowRight size={15} /></button>{selected !== null && <div className="lightbox" role="dialog" aria-modal="true"><button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close photo"><X /></button>{birthdayConfig.photos[selected].src ? <img src={birthdayConfig.photos[selected].src} alt={birthdayConfig.photos[selected].caption} /> : <div className="lightbox-placeholder"><Heart size={52} fill="currentColor" /><p>Add a photo in the config file</p></div>}<p>{birthdayConfig.photos[selected].caption}</p></div>}{!unlocked && <div className="password-overlay" role="dialog" aria-modal="true" aria-labelledby="moments-password-title"><form className={`password-card ${passwordError ? 'password-shake' : ''}`} onSubmit={e => { e.preventDefault(); submitPassword() }}><div className="password-icon"><Heart fill="currentColor" size={28} /></div><p className="eyebrow">a secret for you</p><h3 id="moments-password-title">Our little moments</h3><p>Enter our secret to open these memories.</p><label htmlFor="moments-password">Password</label><input id="moments-password" type="password" autoFocus autoComplete="off" value={password} onChange={e => { setPassword(e.target.value); setPasswordError(false) }} placeholder="Enter the password" aria-invalid={passwordError} aria-describedby="moments-password-help" /><button className="primary-button password-submit" type="submit">Unlock our memories <Heart size={15} fill="currentColor" /></button><p id="moments-password-help" className={`password-hint ${passwordError ? 'password-error' : ''}`}>{passwordError ? 'That password is not quite right. Try again.' : 'A little secret, just between us.'}</p></form></div>}</section>
}

function FinalScene({ restart, audioRef, playing, toggleSong }: { restart: () => void; audioRef: { current: HTMLAudioElement | null }; playing: boolean; toggleSong: () => void }) {
  const [hug, setHug] = useState(false); const [wish, setWish] = useState(''); const [released, setReleased] = useState(false)
  return <section className="scene final-scene"><FloatingHearts dark /><div className="final-glow" /><div className="final-content"><p className="eyebrow light">and now, the best part</p><h1>Happy Birthday,<br /><em>Supriya.</em> <span>♥</span></h1><p>You are one of my favorite parts of this life. I hope today reminds you just how loved and appreciated you are.</p><p>Thank you for being you. Today is your day, and I hope it&apos;s as beautiful as your heart.</p><p className="signature">Always yours, {birthdayConfig.signature || 'with all my love'} <Heart size={15} fill="currentColor" /></p><div className="final-actions"><button onClick={() => setHug(true)}><Heart size={16} /> One more hug</button><button onClick={toggleSong}>{playing ? <Pause size={16} /> : <Music2 size={16} />} {playing ? 'Pause our song' : 'Play our song'}</button><button onClick={() => setReleased(false)}><Sparkles size={16} /> Make a wish</button></div><div className="music-player"><Music2 size={18} /><div><strong>Our birthday songs</strong><span>Choose a song and think of us</span></div><div className="music-tracks"><label><span>{birthdayConfig.songs[0].title}</span><button className="track-button" onClick={toggleSong}>{playing ? 'Pause' : 'Play'}</button></label><label><span>{birthdayConfig.songs[1].title}</span><audio controls src={birthdayConfig.songs[1].src} /></label></div></div>{playing && <div className="music-note">Our song is playing just for you.</div>}<div className="wish-box"><label htmlFor="wish">Write a wish and send it into the sky</label><div><input id="wish" value={wish} onChange={e => setWish(e.target.value)} placeholder="Something beautiful..." /><button onClick={() => setReleased(true)} aria-label="Release wish"><Sparkles size={16} /></button></div>{released && <p className="released">Your wish is glowing somewhere up there. ✦</p>}</div><button className="restart-button" onClick={restart}><RotateCcw size={14} /> Relive our little story</button></div>{hug && <button className="hug-overlay" onClick={() => setHug(false)} aria-label="Close hug message"><div className="hug-hearts">{Array.from({ length: 12 }, (_, i) => <Heart key={i} fill="currentColor" style={{ transform: `rotate(${i * 30}deg) translateY(-${100 + (i % 3) * 35}px)` }} />)}</div><h2>Sending you<br /><em>the biggest hug.</em></h2><p>Tap anywhere to come back.</p></button>}</section>
}

export default function Page() {
  const [scene, setScene] = useState<Scene>('intro'); const [muted, setMuted] = useState(false); const [playing, setPlaying] = useState(false); const audioRef = useRef<HTMLAudioElement>(null); const index = scenes.indexOf(scene)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.7
    const startSong = () => {
      void audio.play().then(() => setPlaying(true)).catch(() => undefined)
    }
    startSong()
    window.addEventListener('pointerdown', startSong, { once: true })
    window.addEventListener('keydown', startSong, { once: true })
    return () => {
      window.removeEventListener('pointerdown', startSong)
      window.removeEventListener('keydown', startSong)
    }
  }, [])
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])
  const next = () => setScene(scenes[Math.min(index + 1, scenes.length - 1)])
  const back = () => setScene(scenes[Math.max(index - 1, 0)])
  const toggleSong = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio.play().then(() => setPlaying(true)).catch(() => undefined)
    } else {
      audio.pause()
      setPlaying(false)
    }
  }
  return <main className="birthday-app"><audio ref={audioRef} src={birthdayConfig.songs[0].src} loop preload="auto" aria-hidden="true" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><Progress scene={scene} onBack={back} onForward={next} muted={muted} setMuted={setMuted} />{scene === 'intro' && <Intro next={next} />}{scene === 'heart' && <HeartScene next={next} />}{scene === 'tree' && <TreeScene next={next} />}{scene === 'letter' && <LetterScene next={next} />}{scene === 'game' && <LoveGame next={next} />}{scene === 'gallery' && <Gallery next={next} />}{scene === 'final' && <FinalScene restart={() => setScene('intro')} audioRef={audioRef} playing={playing} toggleSong={toggleSong} />}<footer className="scene-label">{labels[index]} <span>·</span> {String(index + 1).padStart(2, '0')}</footer></main>
}
