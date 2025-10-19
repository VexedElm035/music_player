import React, { useState, useMemo, memo, useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMusic } from '../context/MusicContext'
import { FaArrowLeft } from 'react-icons/fa'
import SongList from '../components/SongList'
import './Artists.css'

// Componente memoizado para cada item de artista
const ArtistListItem = memo(({ artist, onClick }) => {
  return (
    <div className="artist-list-item" onClick={onClick}>
      <div className="artist-icon-wrapper">
        <span className="artist-list-icon">🎤</span>
      </div>
      <div className="artist-list-info">
        <h3>{artist.name}</h3>
        <p className="artist-stats">
          {artist.songs.length} canción{artist.songs.length !== 1 ? 'es' : ''}
        </p>
      </div>
      <span className="chevron-right">›</span>
    </div>
  )
})

ArtistListItem.displayName = 'ArtistListItem'

const Artists = () => {
  const { queue, playFromContext, currentTrack, playing } = useMusic()
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedArtist, setSelectedArtist] = useState(null)

  const artists = useMemo(() => {
    const artistsMap = new Map()
    
    queue.forEach(song => {
      const artist = song.artist
      if (!artistsMap.has(artist)) {
        artistsMap.set(artist, {
          name: artist,
          songs: [],
          albums: new Set()
        })
      }
      
      const artistData = artistsMap.get(artist)
      artistData.songs.push(song)
      if (song.album) {
        artistData.albums.add(song.album)
      }
    })
    
    return Array.from(artistsMap.values())
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [queue])

  // Efecto para manejar navegación desde otras vistas
  useEffect(() => {
    if (location.state?.selectedArtist) {
      const artist = artists.find(a => a.name === location.state.selectedArtist)
      if (artist) {
        setSelectedArtist(artist)
      }
      // Limpiar el estado de navegación
      window.history.replaceState({}, document.title)
    }
  }, [location.state, artists])

  const handlePlaySong = useCallback((song, index) => {
    // Reproducir desde el contexto de las canciones del artista
    playFromContext(selectedArtist.songs, song)
  }, [selectedArtist, playFromContext])

  const handleArtistClick = useCallback((artist) => {
    setSelectedArtist(artist)
  }, [])

  const handleAlbumClick = useCallback((albumName) => {
    navigate('/albums', { state: { selectedAlbum: albumName } })
  }, [navigate])

  if (selectedArtist) {
    return (
      <div className="artists-container">
        <div className="artist-header">
          <button className="back-button" onClick={() => setSelectedArtist(null)}>
            <FaArrowLeft />
          </button>
          <div>
            <h1>{selectedArtist.name}</h1>
            <p className="artist-stats">
              {selectedArtist.songs.length} canción{selectedArtist.songs.length !== 1 ? 'es' : ''} • {selectedArtist.albums.size} álbum{selectedArtist.albums.size !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>

        <SongList
          songs={selectedArtist.songs}
          onSongClick={handlePlaySong}
          currentTrack={currentTrack}
          playing={playing}
          columns={{ title: true, artist: false, album: true }}
          onAlbumClick={handleAlbumClick}
          showHeader={true}
        />
      </div>
    )
  }

  return (
    <div className="artists-container">
      <h1>Artistas</h1>
      
      {artists.length === 0 ? (
        <div className="empty-state">
          <p>No hay artistas</p>
          <p className="hint">Ve a Configuración para agregar música</p>
        </div>
      ) : (
        <div className="artists-list">
          {artists.map(artist => (
            <ArtistListItem
              key={artist.name}
              artist={artist}
              onClick={() => handleArtistClick(artist)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Artists
