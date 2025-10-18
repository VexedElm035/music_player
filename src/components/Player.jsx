import React from 'react'
import { MusicProvider } from '../context/MusicContext'
import PlaybackBar from './PlaybackBar'

const Player = ({ children }) => {
  return (
    <MusicProvider>
      {children}
      <PlaybackBar />
    </MusicProvider>
  )
}

export default Player