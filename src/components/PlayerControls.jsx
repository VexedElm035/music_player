import React, { memo } from 'react'
import { useMusic } from '../context/MusicContext'
import { IoPauseOutline, IoPlayOutline, IoPlayForwardOutline, IoPlayBackOutline } from "react-icons/io5"
import './PlayerControls.css'

/**
 * Controles Principales del Reproductor
 * @param {Object} props
 * @param {boolean} props.showPrev - Mostrar botón anterior (default: true)
 * @param {boolean} props.showPlay - Mostrar botón play/pause (default: true)
 * @param {boolean} props.showNext - Mostrar botón siguiente (default: true)
 */
const PlayerControls = memo(({ showPrev = true, showPlay = true, showNext = true }) => {
  const { togglePlay, playing, playNext, playPrev } = useMusic()

  return (
    <div className="player-controls">
      {showPrev && (
        <button className="control-btn" onClick={playPrev} title="Anterior">
          <IoPlayBackOutline />
        </button>
      )}
      {showPlay && (
        <button className="control-btn play-btn" onClick={togglePlay} title={playing ? 'Pausar' : 'Reproducir'}>
          {playing ? <IoPauseOutline /> : <IoPlayOutline />}
        </button>
      )}
      {showNext && (
        <button className="control-btn" onClick={playNext} title="Siguiente">
          <IoPlayForwardOutline />
        </button>
      )}
    </div>
  )
})

PlayerControls.displayName = 'PlayerControls'

export default PlayerControls
