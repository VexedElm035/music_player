import React, { useState, memo, useCallback } from 'react'
import { useMusic } from '../context/MusicContext'
import ProgressBar from './ProgressBar'
import PlayerControls from './PlayerControls'
import PlayerControlsAdv from './PlayerControlsAdv'
import ExpandedPlayer from './ExpandedPlayer'
import './PlaybackBar.css'

// Componente memoizado para la info de la pista
const TrackInfo = memo(({ currentTrack, currentCover }) => {
  if (!currentTrack) {
    return <div className="no-track">No hay canción seleccionada</div>
  }
  
  return (
    <>
      <div className="track-cover">
        {currentCover ? (
          <img src={currentCover} alt={currentTrack.title} />
        ) : (
          <div className="track-cover-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
      </div>
      <div className="track-details">
        <div className="track-title-nav">{currentTrack.title}</div>
        <div className="track-artist-nav">{currentTrack.artist}</div>
      </div>
    </>
  )
})

TrackInfo.displayName = 'TrackInfo'

const PlaybackBar = () => {
  const { currentTrack, currentCover } = useMusic()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleBarClick = useCallback((e) => {
    // No expandir si se hace clic en los controles
    if (e.target.closest('.playback-controls')) {
      return
    }
    setIsExpanded(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsExpanded(false)
  }, [])

  return (
    <>
      <div className={`playback-bar ${isExpanded ? 'hidden' : ''}`}>
        <div className="progress-bar-top">
          <ProgressBar showTime={false} showThumb={false} compact={true} />
        </div>
        <div className="playback-container">
          <div className="playback-content" onClick={handleBarClick}>
            <div className="track-info">
              <TrackInfo currentTrack={currentTrack} currentCover={currentCover} />
            </div>
            <div className="playback-controls" onClick={(e) => e.stopPropagation()}>
              {/* Mobile: Solo play/pause */}
              <div className="controls-mobile">
                <PlayerControls showPrev={true} showPlay={true} showNext={true} />
              </div>
              {/* Tablet: Prev, Play, Next */}
              <div className="controls-tablet">
                <PlayerControls showPrev={true} showPlay={true} showNext={true} />
              </div>
              {/* Desktop: Todos los controles */}
              <div className="controls-desktop">
                <PlayerControlsAdv />
                <PlayerControls showPrev={true} showPlay={true} showNext={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExpandedPlayer isExpanded={isExpanded} onClose={handleClose} />
    </>
  )
}

export default PlaybackBar
