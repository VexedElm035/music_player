import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMusic } from '../context/MusicContext'
import PlayerControlsExt from './PlayerControlsExt'
import ProgressBar from './ProgressBar'
import SongList from './SongList'
import { FaTimes, FaMusic } from 'react-icons/fa'
import './ExpandedPlayer.css'

const ExpandedPlayer = ({ isExpanded, onClose }) => {
  const { currentTrack, currentCover, playbackContext, currentIndex, playing, playAt } = useMusic()
  const navigate = useNavigate()

  const handleQueueItemClick = useCallback((song, index) => {
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
          {playbackContext.length === 0 ? (
            <div className="empty-queue">
              <p>No hay canciones en la cola</p>
            </div>
          ) : (
            <SongList
              songs={playbackContext}
              onSongClick={handleQueueItemClick}
              currentTrack={playbackContext[currentIndex]}
              playing={playing}
              columns={{ title: true, artist: true, album: true }}
              onArtistClick={handleArtistClick}
              onAlbumClick={handleAlbumClick}
              showHeader={false}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ExpandedPlayer
