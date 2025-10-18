import React, { useRef } from 'react'
import { useMusic } from '../context/MusicContext'

const Queue = () => {
  const { queue, currentIndex, playAt, removeTrack, moveTrack } = useMusic()
  const dragIndex = useRef(null)

  function onDragStart(e, idx) {
    dragIndex.current = idx
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDrop(e, idx) {
    e.preventDefault()
    const from = dragIndex.current
    if (from == null) return
    moveTrack(from, idx)
    dragIndex.current = null
  }

  function onDragOver(e) {
    e.preventDefault()
  }

  return (
    <div style={{ textAlign: 'left', marginTop: 12 }}>
      <h3>Cola</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {queue.map((t, i) => (
          <li key={t.id} style={{ display: 'flex', alignItems: 'center', padding: 8, background: i === currentIndex ? '#333' : 'transparent' }} draggable onDragStart={e => onDragStart(e, i)} onDragOver={onDragOver} onDrop={e => onDrop(e, i)}>
            <button onClick={() => playAt(i)} style={{ flex: 1, textAlign: 'left', background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>{t.title}</button>
            <button onClick={() => removeTrack(i)} style={{ marginLeft: 8 }}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Queue
