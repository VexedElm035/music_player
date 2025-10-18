import React, { useMemo, memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMusic } from '../context/MusicContext'
import { FaPlay, FaPause } from 'react-icons/fa'
import './Songs.css'

// Componente memoizado para cada canción
const SongItem = memo(({ song, index, isCurrentSong, playing, onClick, onArtistClick, onAlbumClick }) => {
  const handleArtistClick = (e) => {
    e.stopPropagation()
    onArtistClick(song.artist)
  }

  const handleAlbumClick = (e) => {
    e.stopPropagation()
    onAlbumClick(song.album)
  }

  return (
    <div 
      className={`song-item ${isCurrentSong ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="song-number">
        {isCurrentSong && playing ? (
          <FaPause className="play-icon" />
        ) : (
          <FaPlay className="play-icon" />
        )}
        <span className="number-text">{index + 1}</span>
      </div>
      <div className="song-info">
        <div className="song-title">{song.title}</div>
        <div className="song-meta">
          <span className="song-artist artist-link" onClick={handleArtistClick}>
            {song.artist}
          </span>
          <span className="separator"> • </span>
          <span className="song-album album-link" onClick={handleAlbumClick}>
            {song.album}
          </span>
        </div>
      </div>
    </div>
  )
})

SongItem.displayName = 'SongItem'

const Songs = () => {
  const { queue, playFromContext, playing, currentTrack } = useMusic()
  const navigate = useNavigate()

  const sortedSongs = useMemo(() => {
    return [...queue].sort((a, b) => a.title.localeCompare(b.title))
  }, [queue])

  const handlePlaySong = useCallback((song) => {
    // Reproducir desde el contexto de todas las canciones ordenadas
    playFromContext(sortedSongs, song)
  }, [sortedSongs, playFromContext])

  const handleArtistClick = useCallback((artistName) => {
    navigate('/artists', { state: { selectedArtist: artistName } })
  }, [navigate])

  const handleAlbumClick = useCallback((albumName) => {
    navigate('/albums', { state: { selectedAlbum: albumName } })
  }, [navigate])

  return (
    <div className="songs-container">
      <h1>Todas las Canciones</h1>
      
      {sortedSongs.length === 0 ? (
        <div className="empty-state">
          <p>No hay canciones cargadas</p>
          <p className="hint">Ve a Configuración para agregar música</p>
        </div>
      ) : (
        <div className="songs-list">
          <div className="songs-header">
            <span className="header-number">#</span>
            <span className="header-title">Título</span>
          </div>
          {sortedSongs.map((song, index) => (
            <SongItem
              key={song.id}
              song={song}
              index={index}
              isCurrentSong={currentTrack?.id === song.id}
              playing={playing}
              onClick={() => handlePlaySong(song)}
              onArtistClick={handleArtistClick}
              onAlbumClick={handleAlbumClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Songs
