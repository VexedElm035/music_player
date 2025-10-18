import React from 'react'
import { FaCheck, FaTimes, FaRedoAlt } from 'react-icons/fa'
import './LoadingProgress.css'

const LoadingProgress = ({ loadingState, onReset }) => {
  const { isLoading, total, processed, successful, failed, failedFiles } = loadingState

  if (total === 0 && !isLoading) return null

  const percentage = total > 0 ? Math.round((processed / total) * 100) : 0
  const isComplete = !isLoading && processed === total

  return (
    <div className="loading-progress">
      <div className="progress-header">
        <h3>
          {isLoading ? '⏳ Cargando Música...' : isComplete ? '✅ Carga Completada' : '📁 Proceso Finalizado'}
        </h3>
        {isComplete && (
          <button className="reset-btn" onClick={onReset} title="Cerrar">
            <FaTimes />
          </button>
        )}
      </div>

      <div className="progress-bar-container">
        <div 
          className={`progress-bar-fill ${isComplete ? 'complete' : ''}`}
          style={{ width: `${percentage}%` }}
        >
          <span className="progress-percentage">{percentage}%</span>
        </div>
      </div>

      <div className="progress-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Procesados:</span>
          <span className="stat-value">{processed}</span>
        </div>
        <div className="stat-item success">
          <FaCheck />
          <span className="stat-label">Exitosos:</span>
          <span className="stat-value">{successful}</span>
        </div>
        {failed > 0 && (
          <div className="stat-item error">
            <FaTimes />
            <span className="stat-label">Fallidos:</span>
            <span className="stat-value">{failed}</span>
          </div>
        )}
      </div>

      {failed > 0 && failedFiles.length > 0 && (
        <div className="failed-files">
          <h4>❌ Archivos con Error:</h4>
          <ul>
            {failedFiles.map((file, idx) => (
              <li key={idx}>
                <span className="file-name">{file.name}</span>
                <span className="file-error">{file.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isComplete && (
        <div className="completion-message">
          <p>
            {failed === 0 
              ? `🎉 ¡${successful} ${successful === 1 ? 'canción cargada' : 'canciones cargadas'} exitosamente!`
              : `✅ ${successful} ${successful === 1 ? 'canción cargada' : 'canciones cargadas'}, ${failed} con errores`
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default LoadingProgress
