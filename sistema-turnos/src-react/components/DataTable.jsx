import React from 'react';

export const DataTable = ({ columns, data, actions, loading = false, emptyMessage = 'No hay datos' }) => {
  if (loading) {
    return <div className="data-table-loading">Cargando...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="data-table-empty">{emptyMessage}</div>;
  }

  return (
    <section className="section">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                ))}
                {actions && (
                  <td className="table-actions">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DataTable;
