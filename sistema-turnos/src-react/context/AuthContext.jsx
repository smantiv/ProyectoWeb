import React, { createContext, useState, useCallback } from 'react'
import { AuthService } from '../services/apiServices'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => AuthService.getCurrentUser())
  const [token, setToken] = useState(() => AuthService.getToken())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (usuario, contrasena) => {
    setLoading(true)
    setError(null)
    try {
      const response = await AuthService.login(usuario, contrasena)
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setToken(token)
      setUser(user)
      return { success: true, user }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error en el login'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    AuthService.logout()
    setUser(null)
    setToken(null)
    setError(null)
  }, [])

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
