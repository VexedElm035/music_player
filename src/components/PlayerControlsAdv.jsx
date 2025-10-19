import React, { memo, useCallback } from 'react'
import { useMusic } from '../context/MusicContext'
import { IoShuffleOutline, IoRepeatOutline } from "react-icons/io5"
import { FaVolumeUp } from "react-icons/fa"
import './PlayerControlsAdv.css'

/**
 * Controles Avanzados del Reproductor
 * Incluye: Shuffle, Repeat, y Volume
 */
const PlayerControlsAdv = memo(() => {
  const { shuffle, toggleShuffle, repeat, setRepeatMode, volume, setVol } = useMusic()

  const cycleRepeat = useCallback(() => {
    if (repeat === 'off') setRepeatMode('all')
    else if (repeat === 'all') setRepeatMode('one')
    else setRepeatMode('off')
  }, [repeat, setRepeatMode])

  return (
    <div className="player-controls-adv">
      <div className="controls-adv-left">
        <button 
          className={`control-btn ${shuffle ? 'active' : ''}`} 
          onClick={toggleShuffle}
          title="Aleatorio"
        >
          <IoShuffleOutline />
        </button>
        <button 
          className={`control-btn ${repeat !== 'off' ? 'active' : ''}`} 
          onClick={cycleRepeat}
          title={repeat === 'off' ? 'Repetir: Desactivado' : repeat === 'all' ? 'Repetir: Todos' : 'Repetir: Uno'}
        >
          <IoRepeatOutline />
          {repeat === 'one' && <span className="repeat-one">1</span>}
        </button>
      </div>

      <div className="controls-adv-right">
        <div className="volume-control">
          <FaVolumeUp className="volume-icon" />
          <input 
            type="range" 
            min={0} 
            max={1} 
            step={0.01} 
            value={volume} 
            onChange={e => setVol(Number(e.target.value))}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  )
})

PlayerControlsAdv.displayName = 'PlayerControlsAdv'

export default PlayerControlsAdv
