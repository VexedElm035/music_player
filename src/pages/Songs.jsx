import React, { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMusic } from '../context/MusicContext'
import SongList from '../components/SongList'
import './Songs.css'

const Songs = () => {
  const { queue, playFromContext, playing, currentTrack } = useMusic()
  const navigate = useNavigate()

  const sortedSongs = useMemo(() => {
    return [...queue].sort((a, b) => a.title.localeCompare(b.title))
  }, [queue])

  const handlePlaySong = useCallback((song, index) => {
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
        <SongList
          songs={sortedSongs}
          onSongClick={handlePlaySong}
          currentTrack={currentTrack}
          playing={playing}
          columns={{ title: true, artist: true, album: true }}
          onArtistClick={handleArtistClick}
          onAlbumClick={handleAlbumClick}
          showHeader={true}
        />
      )}
    </div>
  )
}

export default Songs
