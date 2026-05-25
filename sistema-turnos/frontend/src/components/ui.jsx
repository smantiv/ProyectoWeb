import { AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';

export function Button({ children, variant = 'primary', type = 'button', ...props }) {
  return (
    <button className={`btn btn-${variant}`} type={type} {...props}>
      {children}
    </button>
  );
}

export function StatCard({ icon, label, value, tone = 'navy' }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

export function DataTable({ columns, rows, empty = 'Sin registros para mostrar.' }) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column.key}>{column.header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-cell">{empty}</td>
            </tr>
          ) : rows.map((row) => (
            <tr key={row.id || JSON.stringify(row)}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LoadingState() {
  return <div className="state"><Loader2 className="spin" /> Cargando datos...</div>;
}

export function ErrorState({ error }) {
  return <div className="state state-error"><AlertCircle /> {error?.message || 'No se pudo completar la solicitud.'}</div>;
}

export function Message({ type = 'success', children }) {
  const Icon = type === 'success' ? CheckCircle2 : AlertCircle;
  return <div className={`message message-${type}`}><Icon size={18} />{children}</div>;
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </header>
        {children}
      </section>
    </div>
  );
}

