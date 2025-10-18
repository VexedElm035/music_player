import React, { useMemo, useState, useEffect, useRef, memo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useMusic } from '../context/MusicContext'
import { FaPlay, FaPause, FaChevronLeft, FaCompactDisc } from 'react-icons/fa'
import './Albums.css'

// Componente memoizado para cada item de álbum
const AlbumListItem = memo(({ album, onClick }) => {
  return (
    <div className="album-list-item" onClick={onClick}>
      <div className="album-icon-wrapper">
        <span className="album-icon-disc">💿</span>
      </div>
      <div className="album-list-info">
        <h3>{album.name}</h3>
        <p className="album-artist">{album.artist}</p>
      </div>
      <div className="album-song-count">
        {album.songCount} {album.songCount === 1 ? 'canción' : 'canciones'}
      </div>
      <span className="chevron-right">›</span>
    </div>
  )
})

AlbumListItem.displayName = 'AlbumListItem'

// Componente memoizado para cada canción en detalle
const AlbumSongItem = memo(({ song, index, onClick, onArtistClick }) => {
  const { playing, currentTrack } = useMusic()
  const isCurrentSong = currentTrack?.id === song.id
  
  const handleArtistClick = (e) => {
    e.stopPropagation()
    onArtistClick(song.artist)
  }
  
  return (
    <div 
      className={`album-song-item ${isCurrentSong ? 'active' : ''}`}
      onClick={onClick}
    >
      <span className="song-number">
        {isCurrentSong && playing ? (
          <FaPause className="play-icon" />
        ) : (
          <FaPlay className="play-icon" />
        )}
        <span className="number-text">{index + 1}</span>
      </span>
      <div className="song-info">
        <span className="song-title">{song.title}</span>
        <span className="song-artist artist-link" onClick={handleArtistClick}>
          {song.artist}
        </span>
      </div>
    </div>
  )
})

AlbumSongItem.displayName = 'AlbumSongItem'

const Albums = () => {
  const { queue, playFromContext } = useMusic()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [albumCover, setAlbumCover] = useState(null)
  const albumCoverURL = useRef(null)

  const albumsData = useMemo(() => {
    const albumMap = {}
    queue.forEach(song => {
      const album = song.album || 'Álbum Desconocido'
      if (!albumMap[album]) {
        albumMap[album] = {
          name: album,
          artist: song.artist || 'Artista Desconocido',
          songs: []
        }
      }
      albumMap[album].songs.push(song)
    })

    return Object.values(albumMap)
      .map(album => ({
        ...album,
        songs: album.songs.sort((a, b) => a.title.localeCompare(b.title)),
        songCount: album.songs.length
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [queue])

  // Efecto para manejar navegación desde otras vistas
  useEffect(() => {
    if (location.state?.selectedAlbum) {
      const album = albumsData.find(a => a.name === location.state.selectedAlbum)
      if (album) {
        setSelectedAlbum(album)
      }
      // Limpiar el estado de navegación
      window.history.replaceState({}, document.title)
    }
  }, [location.state, albumsData])

  // Cargar carátula del álbum seleccionado
  useEffect(() => {
    const loadAlbumCover = async () => {
      // Limpiar carátula anterior
      if (albumCoverURL.current) {
        URL.revokeObjectURL(albumCoverURL.current)
        albumCoverURL.current = null
      }
      setAlbumCover(null)

      if (!selectedAlbum) return

      // Buscar la primera canción con carátula
      const songWithCover = selectedAlbum.songs.find(s => s.hasCover)
      if (!songWithCover) return

      try {
        const musicMetadata = await import('music-metadata-browser')
        const metadata = await musicMetadata.parseBlob(songWithCover.file)
        
        if (metadata.common.picture && metadata.common.picture.length > 0) {
          const picture = metadata.common.picture[0]
          const blob = new Blob([picture.data], { type: picture.format })
          const coverUrl = URL.createObjectURL(blob)
          albumCoverURL.current = coverUrl
          setAlbumCover(coverUrl)
        }
      } catch (error) {
        console.error('Error loading album cover:', error)
      }
    }

    loadAlbumCover()

    // Cleanup al desmontar o cambiar de álbum
    return () => {
      if (albumCoverURL.current) {
        URL.revokeObjectURL(albumCoverURL.current)
        albumCoverURL.current = null
      }
    }
  }, [selectedAlbum])

  const handlePlaySong = useCallback((song) => {
    // Reproducir desde el contexto de las canciones del álbum
    playFromContext(selectedAlbum.songs, song)
  }, [selectedAlbum, playFromContext])

  const handleAlbumClick = useCallback((album) => {
    setSelectedAlbum(album)
  }, [])

  const handleArtistClick = useCallback((artistName) => {
    navigate('/artists', { state: { selectedArtist: artistName } })
  }, [navigate])

  if (selectedAlbum) {
    return (
      <div className="albums-container">
        <div className="album-detail-header">
          <button className="back-button" onClick={() => setSelectedAlbum(null)}>
            <FaChevronLeft /> Volver
          </button>
          <div className="album-detail-info">
            <div className="album-detail-cover">
              {albumCover ? (
                <img src={albumCover} alt={selectedAlbum.name} className="album-cover-img" />
              ) : (
                <FaCompactDisc />
              )}
            </div>
            <div>
              <h1>{selectedAlbum.name}</h1>
              <p className="album-artist">{selectedAlbum.artist}</p>
              <p className="song-count">{selectedAlbum.songCount} {selectedAlbum.songCount === 1 ? 'canción' : 'canciones'}</p>
            </div>
          </div>
        </div>

        <div className="album-songs-list">
          {selectedAlbum.songs.map((song, index) => (
            <AlbumSongItem
              key={song.id}
              song={song}
              index={index}
              onClick={() => handlePlaySong(song)}
              onArtistClick={handleArtistClick}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="albums-container">
      <h1>Álbumes</h1>
      
      {albumsData.length === 0 ? (
        <div className="empty-state">
          <p>No hay álbumes para mostrar</p>
          <p className="hint">Ve a Configuración para agregar música</p>
        </div>
      ) : (
        <div className="albums-list">
          {albumsData.map(album => (
            <AlbumListItem
              key={album.name}
              album={album}
              onClick={() => handleAlbumClick(album)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Albums
