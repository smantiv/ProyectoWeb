import React from 'react'

/**
 * Componente de Loading
 */
export default function LoadingSpinner({ message = 'Cargando...' }) {
  return (
    <div style={{
      padding: '24px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      color: 'var(--navy)',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--orange-soft)',
        borderTop: '3px solid var(--orange)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
      <p>{message}</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
