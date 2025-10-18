import React from 'react'
import { useMusic } from '../context/MusicContext'
import TrackLoader from '../components/TrackLoader'
import LoadingProgress from '../components/LoadingProgress'
import './Settings.css'

const Settings = () => {
  const { loadingState, resetLoadingState, queue } = useMusic()

  return (
    <div className="settings-container">
      <h1>Configuración</h1>
      
      <div className="settings-section">
        <h2>Cargar Música</h2>
        <p>Agrega canciones o carpetas completas a tu biblioteca</p>
        <TrackLoader />
        
        <LoadingProgress 
          loadingState={loadingState} 
          onReset={resetLoadingState}
        />
      </div>
      
      <div className="settings-section">
        <h2>Biblioteca</h2>
        <div className="library-stats">
          <div className="stat-card">
            <span className="stat-number">{queue.length}</span>
            <span className="stat-label">Canciones en Cola</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{new Set(queue.map(t => t.artist)).size}</span>
            <span className="stat-label">Artistas</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{new Set(queue.map(t => t.album)).size}</span>
            <span className="stat-label">Álbumes</span>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h2>Información</h2>
        <p>Music Player v2.0</p>
        <p>Disfruta de tu música favorita</p>
        <p className="formats-support">Formatos soportados: MP3, FLAC, WAV, OGG, M4A</p>
      </div>
    </div>
  )
}

export default Settings
