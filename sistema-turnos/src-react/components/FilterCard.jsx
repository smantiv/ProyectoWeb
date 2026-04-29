import React from 'react';

export const FilterCard = ({ children, title = 'Búsqueda y Filtros' }) => {
  return (
    <section className="section">
      <div className="filter-card">
        <div className="filter-title-row">
          <span className="filter-icon">⚲</span>
          <h3>{title}</h3>
        </div>
        <div className="filter-grid">
          {children}
        </div>
      </div>
    </section>
  );
};

export const FilterField = ({ label, children }) => {
  return (
    <div className="filter-field">
      <label>{label}</label>
      {children}
    </div>
  );
};

export default FilterCard;
