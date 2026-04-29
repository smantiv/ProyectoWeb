import React from 'react'
import { Link } from 'react-router-dom'

export default function AppFooter() {
  return (
    <footer className="footer">
      <p>
        <span className="footer-school">Colegio Santa Francisca Romana</span> &copy; 2026
      </p>
      <div className="footer-links">
        <Link to="/soporte">Soporte</Link>
        <span>|</span>
        <Link to="/contacto">Contacto</Link>
      </div>
    </footer>
  )
}
