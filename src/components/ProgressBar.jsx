import React, { memo } from 'react'
import { useTime } from '../context/MusicContext'
import './ProgressBar.css'

const fmt = s => {
  if (!s || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${sec}`
}

/**
 * ProgressBar Component
 * @param {Object} props
 * @param {boolean} props.showTime - Mostrar etiquetas de tiempo (default: true)
 * @param {boolean} props.showThumb - Mostrar bolita interactiva (default: true)
 * @param {boolean} props.compact - Modo compacto sin padding (default: false)
 */
const ProgressBar = memo(({ showTime = true, showThumb = true, compact = false }) => {
  const { currentTime, duration, seek } = useTime() // Usar contexto de tiempo separado

  // Calcular porcentaje de progreso para el degradado
  const progress = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0

  const sliderClass = `progress-slider ${!showThumb ? 'no-thumb' : ''}`
  const containerClass = `progress-bar ${compact ? 'compact' : ''}`

  return (
    <div className={containerClass}>
      <input 
        type="range" 
        min={0} 
        max={duration || 0} 
        value={currentTime} 
        onChange={e => seek(Number(e.target.value))}
        className={sliderClass}
        style={{ '--progress': `${progress}%` }}
        />
        <div className='progress-bar-info'>
          {showTime && <span className="time-label">{fmt(currentTime)}</span>}
          {showTime && <span className="time-label">{fmt(duration)}</span>}
        </div>
    </div>
  )
})

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
