import React from 'react'
import { useMusic } from '../context/MusicContext'
import './TrackLoader.css'

const TrackLoader = () => {
  const { addFiles } = useMusic()

  function onFiles(e) {
    addFiles(e.target.files)
    e.target.value = null
  }

  return (
    <div className="track-loader">
      <label className="upload-label">
        <input type="file" accept="audio/*" onChange={onFiles} className="file-input" />
        <span className="upload-button">📁 Añadir Canción</span>
      </label>
      <label className="upload-label">
        <input type="file" webkitdirectory="true" directory="true" multiple onChange={onFiles} className="file-input" />
        <span className="upload-button">📂 Añadir Carpeta</span>
      </label>
    </div>
  )
}

export default TrackLoader
