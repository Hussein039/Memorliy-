import React from 'react';
import './FilterBar.css';

function FilterBar({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All Memories' },
    { id: 'Heartwarming', label: 'Heartwarming' },
    { id: 'Sad', label: 'Sad' },
    { id: 'Mysterious', label: 'Mysterious' },
    { id: 'Funny', label: 'Funny' },
    { id: 'Regretful', label: 'Regretful' },
    { id: 'Inspiring', label: 'Inspiring' }
  ];

  return (
    <div className="filter-bar">
      <div className="filter-options">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-button ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar; 