import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';

export const Soporte = () => {
  const { user } = useAuth();
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqItems = [
    {
      id: 1,
      pregunta: '¿Cómo registro un checkpoint?',
      respuesta: 'Para registrar un checkpoint, ve a "Registrar Punto de Control" en tu menú principal. Ingresa el PIN de 6 dígitos correspondiente a tu zona y confirma. El sistema registrará automáticamente tu ubicación y hora.'
    },
    {
      id: 2,
      pregunta: '¿Qué debo hacer si olvido mi contraseña?',
      respuesta: 'Haz clic en "¿Olvidaste tu contraseña?" en la pantalla de login. Recibirás un email con un enlace para restablecerla. Si no recibes el email, contacta al equipo de soporte técnico.'
    },
    {
      id: 3,
      pregunta: '¿Cómo reporto un incidente?',
      respuesta: 'Accede a "Reportar Incidente" durante tu turno. Completa el formulario con el tipo de incidente, ubicación, nivel de prioridad y descripción detallada. Puedes adjuntar evidencia (fotos/videos).'
    },
    {
      id: 4,
      pregunta: '¿Cómo solicito un reemplazo de turno?',
      respuesta: 'Ve a "Solicitar Reemplazo", selecciona el turno que necesitas reemplazar, especifica el motivo, indica el nivel de urgencia y envía. Los administradores revisarán tu solicitud.'
    }
  ];

  const supportGuides = [
    {
      titulo: 'Primeros pasos',
      descripcion: 'Aprende cómo usar el sistema',
      icono: '🚀',
      link: '#'
    },
    {
      titulo: 'Gestión de turnos',
      descripcion: 'Cómo ver, aceptar y completar turnos',
      icono: '📅',
      link: '#'
    },
    {
      titulo: 'Reportes y análisis',
      descripcion: 'Cómo generar reportes y ver analíticas',
      icono: '📊',
      link: '#'
    },
    {
      titulo: 'Solución de problemas',
      descripcion: 'Resuelve problemas comunes',
      icono: '🔧',
      link: '#'
    }
  ];

  return (
    <ProtectedLayout>
      <div className="page">
        <NavBar />
        <main className="mis-turnos-main">
          <div className="back-wrap">
            <button className="back-btn" onClick={() => window.history.back()} title="Volver">←</button>
          </div>

          <div className="container">
            <section className="section-header">
              <h1>Centro de Soporte</h1>
              <p>Encontrar respuestas a tus preguntas sobre el sistema.</p>
            </section>

            <section className="section">
              <h2 className="subsection-title">Preguntas Frecuentes (FAQ)</h2>
              <div className="faq-list">
                {faqItems.map((item) => (
                  <div key={item.id} className="faq-item">
                    <div
                      className="faq-question"
                      onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                    >
                      <span className="faq-icon">{expandedFAQ === item.id ? '▼' : '▶'}</span>
                      <h3>{item.pregunta}</h3>
                    </div>
                    {expandedFAQ === item.id && (
                      <div className="faq-answer">
                        <p>{item.respuesta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Guías de Soporte</h2>
              <div className="support-guides-grid">
                {supportGuides.map((guide, idx) => (
                  <a key={idx} href={guide.link} className="support-guide-card">
                    <div className="guide-icon">{guide.icono}</div>
                    <h3>{guide.titulo}</h3>
                    <p>{guide.descripcion}</p>
                    <span className="guide-arrow">→</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="section">
              <h2 className="subsection-title">Soporte Técnico</h2>
              <div className="technical-support">
                <div className="support-info">
                  <h3>¿Necesitas ayuda adicional?</h3>
                  <p>Si no encuentras la respuesta a tu pregunta en las guías anteriores, ponte en contacto con nuestro equipo de soporte técnico.</p>
                </div>
                <div className="support-contacts">
                  <p>📧 Email: <strong>soporte@test.com</strong></p>
                  <p>📞 Teléfono: <strong>+34 912 345 679</strong></p>
                  <p>🕒 Disponibilidad: <strong>Lunes a viernes 7:00 - 19:00</strong></p>
                </div>
                <button className="btn btn-primary">📞 Contactar soporte</button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default Soporte;
