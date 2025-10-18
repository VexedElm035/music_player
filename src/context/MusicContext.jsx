import React, { createContext, useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react'
import * as musicMetadata from 'music-metadata-browser'

const MusicContext = createContext(null)
const TimeContext = createContext(null) // Contexto separado solo para tiempo

export const useMusic = () => useContext(MusicContext)
export const useTime = () => useContext(TimeContext) // Hook separado para tiempo

let nextId = 1

export const MusicProvider = ({ children }) => {
	const audioRef = useRef(new Audio())
	const [queue, setQueue] = useState([])
	const [currentIndex, setCurrentIndex] = useState(-1)
	const [playing, setPlaying] = useState(false)
	const [shuffle, setShuffle] = useState(false)
	const [repeat, setRepeat] = useState('off') // off | one | all
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [volume, setVolume] = useState(1)
	const [loadingState, setLoadingState] = useState({
		isLoading: false,
		total: 0,
		processed: 0,
		successful: 0,
		failed: 0,
		failedFiles: []
	})
	// Guardamos el ObjectURL actual para liberarlo después
	const currentObjectURL = useRef(null)
	// ObjectURL de la carátula actual
	const currentCoverURL = useRef(null)
	// Contexto de reproducción: cola actual filtrada
	const [playbackContext, setPlaybackContext] = useState([]) // Cola de reproducción actual
	// Carátula de la canción actual (cargada bajo demanda)
	const [currentCover, setCurrentCover] = useState(null)

	const audio = audioRef.current

	useEffect(() => {
		audio.volume = volume
	}, [audio, volume])

	// Cleanup: liberar ObjectURL cuando se desmonte el componente
	useEffect(() => {
		return () => {
			if (currentObjectURL.current) {
				URL.revokeObjectURL(currentObjectURL.current)
			}
			if (currentCoverURL.current) {
				URL.revokeObjectURL(currentCoverURL.current)
			}
		}
	}, [])

	useEffect(() => {
		// Throttle para actualizar el tiempo solo cada 250ms en lugar de múltiples veces por segundo
		let lastUpdate = 0
		const onTime = () => {
			const now = Date.now()
			if (now - lastUpdate > 250) { // Actualizar solo cada 250ms
				setCurrentTime(audio.currentTime)
				lastUpdate = now
			}
		}
		
		const onMeta = () => setDuration(audio.duration || 0)
		const onEnded = () => {
			if (repeat === 'one') {
				audio.currentTime = 0
				audio.play()
				return
			}
			playNext()
		}

		audio.addEventListener('timeupdate', onTime)
		audio.addEventListener('loadedmetadata', onMeta)
		audio.addEventListener('ended', onEnded)

		return () => {
			audio.removeEventListener('timeupdate', onTime)
			audio.removeEventListener('loadedmetadata', onMeta)
			audio.removeEventListener('ended', onEnded)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audio, repeat, queue, currentIndex])

	const addFiles = useCallback(async (fileList) => {
		const files = Array.from(fileList).filter(f => f.type.startsWith('audio') || f.name.match(/\.(mp3|wav|ogg|m4a|flac)$/i))
		
		if (files.length === 0) return
		
		// Reset loading state
		setLoadingState({
			isLoading: true,
			total: files.length,
			processed: 0,
			successful: 0,
			failed: 0,
			failedFiles: []
		})
		
		for (const f of files) {
			try {
				// Extract metadata from each file (solo metadata, no cargamos el audio completo)
				const metadata = await musicMetadata.parseBlob(f)
				
				// Verificar si tiene carátula pero NO crearla aún
				const hasCover = metadata.common.picture && metadata.common.picture.length > 0
				
				const newTrack = {
					id: nextId++,
					title: metadata.common.title || f.name.replace(/\.[^/.]+$/, ''),
					artist: metadata.common.artist || metadata.common.albumartist || (metadata.common.artists && metadata.common.artists.join(', ')) || 'Artista Desconocido',
					album: metadata.common.album || 'Álbum Desconocido',
					hasCover: hasCover, // Solo guardamos si tiene o no carátula
					// Guardamos referencia al archivo, NO creamos ObjectURL aún
					file: f,
					// El src se creará solo cuando se reproduzca
					src: null,
				}
				
				setQueue(q => {
					const updated = [...q, newTrack]
					// Si es la primera canción, establecer contexto y reproducirla
					if (q.length === 0 && currentIndex === -1) {
						setTimeout(() => {
							setPlaybackContext([newTrack])
							playAt(0)
						}, 100)
					}
					return updated
				})
				
				setLoadingState(prev => ({
					...prev,
					processed: prev.processed + 1,
					successful: prev.successful + 1
				}))
				
			} catch (error) {
				// If metadata extraction fails, use default values
				const newTrack = {
					id: nextId++,
					title: f.name.replace(/\.[^/.]+$/, ''),
					artist: 'Artista Desconocido',
					album: 'Álbum Desconocido',
					hasCover: false,
					// Guardamos referencia al archivo
					file: f,
					src: null,
				}
				
				setQueue(q => {
					const updated = [...q, newTrack]
					if (q.length === 0 && currentIndex === -1) {
						setTimeout(() => {
							setPlaybackContext([newTrack])
							playAt(0)
						}, 100)
					}
					return updated
				})
				
				setLoadingState(prev => ({
					...prev,
					processed: prev.processed + 1,
					failed: prev.failed + 1,
					failedFiles: [...prev.failedFiles, { name: f.name, error: error.message }]
				}))
			}
		}
		
		// Mark loading as complete
		setLoadingState(prev => ({ ...prev, isLoading: false }))
	}, [currentIndex])

	const addTrack = useCallback((file) => {
		addFiles([file])
	}, [addFiles])

	// Función para cargar la carátula de una canción bajo demanda
	const loadCover = useCallback(async (track) => {
		// Liberar carátula anterior
		if (currentCoverURL.current) {
			URL.revokeObjectURL(currentCoverURL.current)
			currentCoverURL.current = null
		}
		
		if (!track || !track.hasCover || !track.file) {
			setCurrentCover(null)
			return
		}

		try {
			const metadata = await musicMetadata.parseBlob(track.file)
			if (metadata.common.picture && metadata.common.picture.length > 0) {
				const picture = metadata.common.picture[0]
				const blob = new Blob([picture.data], { type: picture.format })
				const coverUrl = URL.createObjectURL(blob)
				currentCoverURL.current = coverUrl
				setCurrentCover(coverUrl)
			} else {
				setCurrentCover(null)
			}
		} catch (error) {
			console.error('Error loading cover:', error)
			setCurrentCover(null)
		}
	}, [])

	const playAt = useCallback((index) => {
		if (index < 0 || index >= playbackContext.length) return
		const track = playbackContext[index]
		if (!track) return
		
		// Liberar el ObjectURL anterior para ahorrar memoria
		if (currentObjectURL.current) {
			URL.revokeObjectURL(currentObjectURL.current)
			currentObjectURL.current = null
		}
		
		// Crear ObjectURL solo para la canción actual
		const objectURL = URL.createObjectURL(track.file)
		currentObjectURL.current = objectURL
		
		// Cargar la carátula de la canción actual
		loadCover(track)
		
		audio.src = objectURL
		audio.play()
		setCurrentIndex(index)
		setPlaying(true)
	}, [audio, playbackContext, loadCover])

	const playNext = useCallback(() => {
		if (playbackContext.length === 0) return
		let next = currentIndex + 1
		if (next >= playbackContext.length) {
			if (repeat === 'all') next = 0
			else {
				setPlaying(false)
				return
			}
		}
		playAt(next)
	}, [playbackContext, currentIndex, repeat, playAt])

	const playPrev = useCallback(() => {
		if (playbackContext.length === 0) return
		let prev = currentIndex - 1
		if (prev < 0) {
			if (repeat === 'all') prev = playbackContext.length - 1
			else {
				audio.currentTime = 0
				return
			}
		}
		playAt(prev)
	}, [playbackContext, currentIndex, repeat, audio, playAt])

	const togglePlay = useCallback(() => {
		if (playing) {
			audio.pause()
			setPlaying(false)
		} else {
			if (currentIndex === -1 && queue.length > 0) playAt(0)
			else {
				audio.play()
				setPlaying(true)
			}
		}
	}, [playing, currentIndex, queue, audio, playAt])

	const seek = useCallback((to) => {
		audio.currentTime = to
		setCurrentTime(to)
	}, [audio])

	const setVol = useCallback((v) => {
		setVolume(v)
	}, [])

	const toggleShuffle = useCallback(() => {
		setShuffle(s => {
			const newS = !s
			if (newS) {
				// shuffle queue but keep current track first
				const currentId = queue[currentIndex]?.id
				const rest = queue.filter(t => t.id !== currentId)
				for (let i = rest.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1))
					const tmp = rest[i]
					rest[i] = rest[j]
					rest[j] = tmp
				}
				const newQueue = currentId ? [queue.find(t => t.id === currentId), ...rest] : rest
				setQueue(newQueue.filter(Boolean))
				setCurrentIndex(0)
			} else {
				// turning off shuffle does not restore original order (simple)
			}
			return newS
		})
	}, [queue, currentIndex])

	const setRepeatMode = useCallback((mode) => {
		setRepeat(mode)
	}, [])

	const removeTrack = useCallback((idx) => {
		setQueue(q => {
			const next = q.slice()
			const removed = next.splice(idx, 1)
			if (idx < currentIndex) setCurrentIndex(i => i - 1)
			else if (idx === currentIndex) {
				// if removed current, try to play same index (which is next track)
				if (next[idx]) playAt(idx)
				else {
					audio.pause()
					setPlaying(false)
					setCurrentIndex(-1)
				}
			}
			return next
		})
	}, [audio, currentIndex, playAt])

	const moveTrack = useCallback((from, to) => {
		setQueue(q => {
			const next = q.slice()
			const [item] = next.splice(from, 1)
			next.splice(to, 0, item)
			// update currentIndex if needed
			if (from === currentIndex) setCurrentIndex(to)
			else if (from < currentIndex && to >= currentIndex) setCurrentIndex(i => i - 1)
			else if (from > currentIndex && to <= currentIndex) setCurrentIndex(i => i + 1)
			return next
		})
	}, [currentIndex])

	const resetLoadingState = useCallback(() => {
		setLoadingState({
			isLoading: false,
			total: 0,
			processed: 0,
			successful: 0,
			failed: 0,
			failedFiles: []
		})
	}, [])

	// Nueva función: establecer contexto de reproducción y reproducir
	const playFromContext = useCallback((songs, songToPlay) => {
		// Liberar el ObjectURL anterior si existe
		if (currentObjectURL.current) {
			URL.revokeObjectURL(currentObjectURL.current)
			currentObjectURL.current = null
		}
		
		// Encontrar el índice de la canción a reproducir en el nuevo contexto
		const index = songs.findIndex(s => s.id === songToPlay.id)
		
		if (index !== -1) {
			// Establecer el nuevo contexto
			setPlaybackContext(songs)
			
			// Crear ObjectURL para la canción seleccionada
			const track = songs[index]
			const objectURL = URL.createObjectURL(track.file)
			currentObjectURL.current = objectURL
			
			// Cargar la carátula de la canción
			loadCover(track)
			
			// Reproducir
			audio.src = objectURL
			audio.play()
			setCurrentIndex(index)
			setPlaying(true)
		}
	}, [audio, loadCover])

	// Valor principal del contexto (SIN currentTime/duration para evitar re-renders)
	const value = useMemo(() => ({
		queue,
		addFiles,
		addTrack,
		playAt,
		playNext,
		playPrev,
		togglePlay,
		playing,
		currentIndex,
		currentTrack: playbackContext[currentIndex] || null,
		currentCover, // Carátula actual cargada
		loadCover, // Función para cargar carátula bajo demanda
		seek,
		volume,
		setVol,
		shuffle,
		toggleShuffle,
		repeat,
		setRepeatMode,
		removeTrack,
		moveTrack,
		loadingState,
		resetLoadingState,
		playFromContext,
		playbackContext,
	}), [
		queue,
		playing,
		currentIndex,
		playbackContext,
		currentCover,
		volume,
		shuffle,
		repeat,
		loadingState,
		addFiles,
		addTrack,
		loadCover,
		playAt,
		playNext,
		playPrev,
		togglePlay,
		seek,
		setVol,
		toggleShuffle,
		setRepeatMode,
		removeTrack,
		moveTrack,
		resetLoadingState,
		playFromContext,
	])

	// Valor separado solo para tiempo (solo ProgressBar lo usará)
	const timeValue = useMemo(() => ({
		currentTime,
		duration,
		seek,
	}), [currentTime, duration, seek])

	return (
		<MusicContext.Provider value={value}>
			<TimeContext.Provider value={timeValue}>
				{children}
			</TimeContext.Provider>
		</MusicContext.Provider>
	)
}

export default MusicContext
