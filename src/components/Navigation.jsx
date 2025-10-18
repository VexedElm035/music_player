import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaCog, FaMusic, FaUserAlt, FaCompactDisc, FaListUl } from 'react-icons/fa'
import './Navigation.css'

const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-header">
        <h2>Music_Player-test</h2>
      </div>
      <ul className="nav-menu">
        <li>
          <NavLink to="/songs" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaMusic /> <span>Canciones</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/artists" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaUserAlt /> <span>Artistas</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/albums" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaCompactDisc /> <span>Álbumes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/playlists" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaListUl /> <span>Listas de Reproducción</span>
          </NavLink>
        </li>
        <li className="nav-divider"></li>
        <li>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaCog /> <span>Configuración</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
