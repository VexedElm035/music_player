import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

import Player from './components/Player'
import Navigation from './components/Navigation'
import Settings from './pages/Settings'
import Songs from './pages/Songs'
import Artists from './pages/Artists'
import Albums from './pages/Albums'
import Playlists from './pages/Playlists'

function App() {
  return (
    <Router>
      <Player>
        <div className="app-layout">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/songs" replace />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/songs" element={<Songs />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/playlists" element={<Playlists />} />
            </Routes>
          </main>
        </div>
      </Player>
    </Router>
  )
}

export default App
