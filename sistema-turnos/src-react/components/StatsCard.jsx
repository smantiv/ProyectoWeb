import React from 'react';

export const StatsCard = ({ icon, title, value, trend, trendColor = 'orange-text' }) => {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-top">
        <div className="admin-stat-icon bg-navy">{icon}</div>
        <span className={`admin-trend ${trendColor}`}>{trend}</span>
      </div>
      <h3>{value}</h3>
      <p>{title}</p>
    </article>
  );
};

export const MiniStatsCard = ({ icon, label, value, textColor = 'navy-text' }) => {
  return (
    <article className="mis-stat-card">
      <div className="mis-stat-icon">{icon}</div>
      <div className="mis-stat-content">
        <div className={`mis-stat-value ${textColor}`}>{value}</div>
        <div className="mis-stat-label">{label}</div>
      </div>
    </article>
  );
};

export default StatsCard;
