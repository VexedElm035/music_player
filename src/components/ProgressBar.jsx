import React, { memo } from 'react'
import { useTime } from '../context/MusicContext'
import './ProgressBar.css'

const fmt = s => {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

const ProgressBar = memo(() => {
  const { currentTime, duration, seek } = useTime() // Usar contexto de tiempo separado

  // Calcular porcentaje de progreso para el degradado
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  return (
    <div className="progress-bar">
      <span className="time-label">{fmt(currentTime)}</span>
      <input 
        type="range" 
        min={0} 
        max={duration || 0} 
        value={currentTime} 
        onChange={e => seek(Number(e.target.value))}
        className="progress-slider"
        style={{ '--progress': `${progress}%` }}
      />
      <span className="time-label">{fmt(duration)}</span>
    </div>
  )
})

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
