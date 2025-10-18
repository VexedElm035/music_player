import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMusic } from '../context/MusicContext'
import PlayerControlsExt from './PlayerControlsExt'
import ProgressBar from './ProgressBar'
import { FaTimes, FaMusic, FaPlay, FaPause } from 'react-icons/fa'
import './ExpandedPlayer.css'

// Componente memoizado para cada item de la cola
const QueueItem = memo(({ track, index, isCurrentSong, playing, onClick, onArtistClick, onAlbumClick }) => {
  const handleArtistClick = (e) => {
    e.stopPropagation()
    onArtistClick(track.artist)
  }

  const handleAlbumClick = (e) => {
    e.stopPropagation()
    onAlbumClick(track.album)
  }

  return (
    <div
      className={`queue-item ${isCurrentSong ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="queue-item-number">
        {isCurrentSong && playing ? (
          <FaPause className="queue-icon" />
        ) : (
          <FaPlay className="queue-icon" />
        )}
        <span className="number-text">{index + 1}</span>
      </div>
      <div className="queue-item-info">
        <div className="queue-item-title">{track.title}</div>
        <div className="queue-item-meta">
          <span className="queue-item-artist artist-link" onClick={handleArtistClick}>
            {track.artist}
          </span>
          <span className="separator"> • </span>
          <span className="queue-item-album album-link" onClick={handleAlbumClick}>
            {track.album}
          </span>
        </div>
      </div>
    </div>
  )
})

QueueItem.displayName = 'QueueItem'

const ExpandedPlayer = ({ isExpanded, onClose }) => {
  const { currentTrack, currentCover, playbackContext, currentIndex, playing, playAt } = useMusic()
  const navigate = useNavigate()

  const handleQueueItemClick = useCallback((index) => {
    playAt(index)
  }, [playAt])

  const handleArtistClick = useCallback((artistName) => {
    onClose() // Cerrar el reproductor expandido
    navigate('/artists', { state: { selectedArtist: artistName } })
  }, [navigate, onClose])

  const handleAlbumClick = useCallback((albumName) => {
    onClose() // Cerrar el reproductor expandido
    navigate('/albums', { state: { selectedAlbum: albumName } })
  }, [navigate, onClose])

  const handleCurrentArtistClick = useCallback(() => {
    if (currentTrack?.artist) {
      handleArtistClick(currentTrack.artist)
    }
  }, [currentTrack, handleArtistClick])

  const handleCurrentAlbumClick = useCallback(() => {
    if (currentTrack?.album) {
      handleAlbumClick(currentTrack.album)
    }
  }, [currentTrack, handleAlbumClick])

  return (
    <div className={`expanded-player ${isExpanded ? 'expanded' : ''}`}>
      <div className="expanded-player-content">
        {/* Header with close button */}
        <div className="expanded-header">
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Current Track Display */}
        <div className="now-playing-section">
          <div className="album-art-container">
            {currentCover && (
              <div 
                className="album-art-glow"
                style={{ backgroundImage: `url(${currentCover})` }}
              />
            )}
            <div className="album-art">
              {currentCover ? (
                <img src={currentCover} alt="Album Cover" className="album-cover-image" />
              ) : (
                <FaMusic className="album-art-icon" />
              )}
            </div>
          </div>
          
          <div className="track-details">
            <h2 className="track-title">{currentTrack?.title || 'Sin canción'}</h2>
            <p className="track-artist artist-link" onClick={handleCurrentArtistClick}>
              {currentTrack?.artist || 'Artista desconocido'}
            </p>
            <p className="track-album album-link" onClick={handleCurrentAlbumClick}>
              {currentTrack?.album || 'Álbum desconocido'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="expanded-controls">
          <ProgressBar />
          <PlayerControlsExt />
        </div>

        {/* Queue */}
        <div className="queue-section">
          <h3 className="queue-title">Cola de reproducción</h3>
          <div className="queue-list">
            {playbackContext.length === 0 ? (
              <div className="empty-queue">
                <p>No hay canciones en la cola</p>
              </div>
            ) : (
              playbackContext.map((track, index) => (
                <QueueItem
                  key={track.id}
                  track={track}
                  index={index}
                  isCurrentSong={index === currentIndex}
                  playing={playing}
                  onClick={() => handleQueueItemClick(index)}
                  onArtistClick={handleArtistClick}
                  onAlbumClick={handleAlbumClick}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpandedPlayer
