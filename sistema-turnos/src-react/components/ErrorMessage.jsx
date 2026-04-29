import React from 'react'

/**
 * Componente de Error
 */
export default function ErrorMessage({ message, onDismiss }) {
  return (
    <div style={{
      padding: '16px',
      borderRadius: '8px',
      background: 'var(--red)',
      color: 'white',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '16px',
    }}>
      <span>⚠️ {message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
