import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AppFooter from './AppFooter'

export default function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>Cargando...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      {children}
      <AppFooter />
    </>
  )
}
