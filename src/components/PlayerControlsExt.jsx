import React, { memo } from 'react'
import PlayerControls from './PlayerControls'
import PlayerControlsAdv from './PlayerControlsAdv'
import './PlayerControlsExt.css'

/**
 * Controles Extendidos para ExpandedPlayer
 * Combina PlayerControls y PlayerControlsAdv
 */
const PlayerControlsExt = memo(() => {
  return (
    <div className="player-controls-ext">
      <PlayerControls showPrev={true} showPlay={true} showNext={true} />
      <PlayerControlsAdv />
    </div>
  )
})

PlayerControlsExt.displayName = 'PlayerControlsExt'

export default PlayerControlsExt
