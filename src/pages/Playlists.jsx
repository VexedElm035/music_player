import React from 'react'
import { FaListUl } from 'react-icons/fa'
import './Playlists.css'

const Playlists = () => {
  return (
    <div className="playlists-container">
      <h1>Listas de Reproducción</h1>
      
      <div className="playlists-info">
        <FaListUl className="playlists-icon" />
        <h2>Próximamente</h2>
        <p>La funcionalidad de listas de reproducción personalizadas estará disponible en una futura actualización.</p>
        <p className="hint">Por ahora, puedes disfrutar de todas tus canciones desde el menú de Canciones, Artistas o Álbumes.</p>
      </div>
    </div>
  )
}

export default Playlists
