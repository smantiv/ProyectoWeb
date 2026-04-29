import React, { useState } from 'react'
import ProtectedLayout from '../components/ProtectedLayout'
import NavBar from '../components/NavBar'
import { ContactoService } from '../services/apiServices'

export const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const contactInfo = [
    {
      nombre: 'Admin Sistema',
      rol: 'Administrador del sistema',
      email: 'admin@test.com',
      telefono: '+57 300 000 0001',
      disponibilidad: 'Lunes a viernes 8:00 - 18:00',
    },
    {
      nombre: 'Soporte Tecnico',
      rol: 'Equipo de soporte',
      email: 'soporte@test.com',
      telefono: '+57 300 000 0002',
      disponibilidad: 'Lunes a viernes 7:00 - 19:00',
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')

    try {
      const response = await ContactoService.enviar(formData)
      setSuccess(response.data?.mensaje || 'Mensaje enviado correctamente.')
      setFormData({ nombre: '', email: '', mensaje: '' })
    } catch (error) {
      setSuccess('No fue posible enviar el mensaje.')
      console.error('Error enviando contacto:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedLayout>
      <div className="page">
        <NavBar />
        <main className="mis-turnos-main">
          <div className="back-wrap">
            <button className="back-btn" onClick={() => window.history.back()} title="Volver">
              Volver
            </button>
          </div>

          <div className="container">
            <section className="section-header">
              <h1>Contacto</h1>
              <p>Canal de contacto operativo conectado al backend.</p>
            </section>

            <section className="section">
              <h2 className="subsection-title">Contactos disponibles</h2>
              <div className="contacts-grid">
                {contactInfo.map((contact) => (
                  <div key={contact.email} className="contact-card">
                    <h3>{contact.nombre}</h3>
                    <p className="contact-role">{contact.rol}</p>
                    <div className="contact-details">
                      <p>{contact.email}</p>
                      <p>{contact.telefono}</p>
                      <p>{contact.disponibilidad}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Formulario</h2>
              {success && (
                <div className="success-message">
                  <p>{success}</p>
                </div>
              )}
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Tu nombre..."
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mensaje</label>
                  <textarea
                    name="mensaje"
                    placeholder="Escribe tu mensaje..."
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows="5"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  )
}

export default Contacto
