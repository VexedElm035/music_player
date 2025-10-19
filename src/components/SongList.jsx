import React, { memo } from 'react'
import { FaPlay, FaPause } from 'react-icons/fa'
import './SongList.css'

/**
 * Componente de lista de canciones reutilizable
 * @param {Object} props
 * @param {Array} props.songs - Array de canciones a mostrar
 * @param {Function} props.onSongClick - Callback cuando se hace click en una canción
 * @param {Object} props.currentTrack - Canción actual reproduciéndose
 * @param {boolean} props.playing - Estado de reproducción
 * @param {Object} props.columns - Columnas a mostrar: { title: bool, artist: bool, album: bool }
 * @param {Function} props.onArtistClick - Callback opcional para click en artista
 * @param {Function} props.onAlbumClick - Callback opcional para click en álbum
 * @param {boolean} props.showHeader - Mostrar encabezado de la tabla (default: true)
 */

// Componente memoizado para cada canción
const SongItem = memo(({ 
  song, 
  index, 
  isCurrentSong, 
  playing, 
  onClick, 
  columns,
  onArtistClick,
  onAlbumClick
}) => {
  const handleArtistClick = (e) => {
    e.stopPropagation()
    if (onArtistClick) {
      onArtistClick(song.artist)
    }
  }

  const handleAlbumClick = (e) => {
    e.stopPropagation()
    if (onAlbumClick) {
      onAlbumClick(song.album)
    }
  }

  return (
    <div 
      className={`song-list-item ${isCurrentSong ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="song-list-number">
        {isCurrentSong && playing ? (
          <FaPause className="play-icon" />
        ) : (
          <FaPlay className="play-icon" />
        )}
        <span className="number-text">{index + 1}</span>
      </div>
      <div className="song-list-info">
        <div className="song-list-title">{song.title}</div>
        <div className="song-list-meta">
          {columns.artist && (
            <>
              <span 
                className={`song-list-artist ${onArtistClick ? 'artist-link' : ''}`}
                onClick={onArtistClick ? handleArtistClick : undefined}
              >
                {song.artist}
              </span>
              {columns.album && <span className="separator"> • </span>}
            </>
          )}
          {columns.album && (
            <span 
              className={`song-list-album ${onAlbumClick ? 'album-link' : ''}`}
              onClick={onAlbumClick ? handleAlbumClick : undefined}
            >
              {song.album}
            </span>
          )}
        </div>
      </div>
    </div>
  )
})

SongItem.displayName = 'SongItem'

const SongList = ({ 
  songs, 
  onSongClick, 
  currentTrack, 
  playing, 
  columns = { title: true, artist: true, album: true },
  onArtistClick,
  onAlbumClick,
  showHeader = true
}) => {
  return (
    <div className="song-list-container">
      {showHeader && (
        <div className="song-list-header">
          <div className='song-list-number'>
            <div className="header-number">#</div>
          </div>
          <div className="header-title">Título</div>
        </div>
      )}
      <div className="song-list-items">
        {songs.map((song, index) => (
          <SongItem
            key={song.id}
            song={song}
            index={index}
            isCurrentSong={currentTrack?.id === song.id}
            playing={playing}
            onClick={() => onSongClick(song, index)}
            columns={columns}
            onArtistClick={onArtistClick}
            onAlbumClick={onAlbumClick}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(SongList)
