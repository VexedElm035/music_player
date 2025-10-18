import React, { memo, useCallback } from 'react'
import { useMusic } from '../context/MusicContext'
import { IoPauseOutline, IoPlayOutline, IoPlayForwardOutline, IoPlayBackOutline, IoShuffleOutline, IoRepeatOutline } from "react-icons/io5"
import { FaVolumeUp } from "react-icons/fa"
import './PlayerControls.css'

const PlayerControls = memo(() => {
  const { togglePlay, playing, playNext, playPrev, shuffle, toggleShuffle, repeat, setRepeatMode, volume, setVol } = useMusic()

  const cycleRepeat = useCallback(() => {
    if (repeat === 'off') setRepeatMode('all')
    else if (repeat === 'all') setRepeatMode('one')
    else setRepeatMode('off')
  }, [repeat, setRepeatMode])

  return (
    <div className="player-controls">
      <div className="controls-left">
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

      <div className="controls-center">
        <button className="control-btn" onClick={playPrev} title="Anterior">
          <IoPlayBackOutline />
        </button>
        <button className="control-btn play-btn" onClick={togglePlay} title={playing ? 'Pausar' : 'Reproducir'}>
          {playing ? <IoPauseOutline /> : <IoPlayOutline />}
        </button>
        <button className="control-btn" onClick={playNext} title="Siguiente">
          <IoPlayForwardOutline />
        </button>
      </div>

      <div className="controls-right">
        
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

PlayerControls.displayName = 'PlayerControls'

export default PlayerControls
