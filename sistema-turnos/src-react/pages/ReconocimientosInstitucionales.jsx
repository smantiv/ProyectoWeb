import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProtectedLayout from '../components/ProtectedLayout';
import NavBar from '../components/NavBar';
import { DataTable } from '../components/DataTable';

export const ReconocimientosInstitucionales = () => {
  const { user } = useAuth();
  const [candidatos, setCandidatos] = useState([]);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    // Datos de ejemplo
    setCandidatos([
      { id: 1, profesor: 'Juan Pérez', zona: 'Zona A', metrica: 'Puntualidad', puntaje: 98, reconocimiento: 'Docente Destacado', estado: 'PENDIENTE' },
      { id: 2, profesor: 'María González', zona: 'Zona B', metrica: 'Incidentes evitados', puntaje: 23, reconocimiento: 'Vigilancia Preventiva', estado: 'APROBADO' }
    ]);

    setHistorial([
      { id: 1, profesor: 'Carlos López', reconocimiento: 'Excelencia en Vigilancia', fecha: '2026-03-15' },
      { id: 2, profesor: 'Ana Rodríguez', reconocimiento: 'Docente Destacado', fecha: '2026-03-10' }
    ]);
  }, []);

  const candidatosColumns = [
    { key: 'profesor', label: 'Profesor' },
    { key: 'zona', label: 'Zona' },
    { key: 'metrica', label: 'Métrica destacada' },
    { key: 'puntaje', label: 'Puntaje' },
    { key: 'reconocimiento', label: 'Tipo de reconocimiento' },
    {
      key: 'estado',
      label: 'Estado',
      render: (v) => <span className={`badge badge-${v === 'APROBADO' ? 'success' : 'warning'}`}>{v}</span>
    }
  ];

  const historialColumns = [
    { key: 'profesor', label: 'Profesor' },
    { key: 'reconocimiento', label: 'Reconocimiento' },
    { key: 'fecha', label: 'Fecha de otorgamiento' }
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
              <h1>Reconocimientos Institucionales</h1>
              <p>Gestiona los reconocimientos a docentes destacados.</p>
            </section>

            <section className="section">
              <h2 className="subsection-title">Candidatos Pendientes de Aprobación</h2>
              <DataTable
                columns={candidatosColumns}
                data={candidatos}
                actions={(row) => (
                  <div className="table-action-buttons">
                    <button className="btn btn-sm btn-primary">Aprobar</button>
                    <button className="btn btn-sm btn-danger">Rechazar</button>
                  </div>
                )}
              />
            </section>

            <section className="section">
              <h2 className="subsection-title">Historial de Reconocimientos</h2>
              <DataTable
                columns={historialColumns}
                data={historial}
              />
            </section>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
};

export default ReconocimientosInstitucionales;
