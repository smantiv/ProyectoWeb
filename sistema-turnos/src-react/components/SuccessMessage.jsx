import React from 'react'

/**
 * Componente de Mensaje de Éxito
 */
export default function SuccessMessage({ message, onDismiss }) {
  React.useEffect(() => {
    if (onDismiss) {
      const timer = setTimeout(onDismiss, 3000)
      return () => clearTimeout(timer)
    }
  }, [onDismiss])

  return (
    <div style={{
      padding: '16px',
      borderRadius: '8px',
      background: 'var(--green)',
      color: 'white',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '16px',
    }}>
      <span>✅ {message}</span>
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
