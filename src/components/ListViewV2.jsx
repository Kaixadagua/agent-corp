import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './listviewv2.css'; // Optional: component styles

/**
 * ListViewV2 Component
 * Enhanced React component with full functionality
 * @module components/ListViewV2
 * @version 2.0.0
 */

/**
 * ListViewV2 - Main component
 */
const ListViewV2 = ({
  data = [],
  onAction,
  onSelect,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  className = '',
  style = {},
  ...restProps
}) => {
  // State management
  const [selectedItems, setSelectedItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [localError, setLocalError] = useState(error);

  // Reset local error when prop changes
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  // Handle item selection
  const handleSelect = useCallback((item) => {
    const newSelection = selectedItems.includes(item.id)
      ? selectedItems.filter(id => id !== item.id)
      : [...selectedItems, item.id];
    
    setSelectedItems(newSelection);
    
    if (onSelect) {
      onSelect(newSelection);
    }
  }, [selectedItems, onSelect]);

  // Handle action
  const handleAction = useCallback((action, item) => {
    try {
      if (onAction) {
        onAction(action, item);
      }
    } catch (err) {
      setLocalError(err.message);
      console.error('Action failed:', err);
    }
  }, [onAction]);

  // Loading state
  if (loading) {
    return (
      <div className="listviewv2-loading" data-testid="listviewv2-loading">
        <div className="listviewv2-spinner"></div>
        <p>Loading ListViewV2...</p>
      </div>
    );
  }

  // Error state
  if (localError) {
    return (
      <div className="listviewv2-error" data-testid="listviewv2-error">
        <h3>Error</h3>
        <p>{localError}</p>
        <button onClick={() => setLocalError(null)}>
          Dismiss
        </button>
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="listviewv2-empty" data-testid="listviewv2-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div 
      className={`listviewv2-container ${className}`}
      style={style}
      data-testid="listviewv2"
      {...restProps}
    >
      <header className="listviewv2-header">
        <h2>ListViewV2</h2>
        <div className="listviewv2-actions">
          <button onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </header>

      <div className={`listviewv2-content ${isExpanded ? 'expanded' : ''}`}>
        {data.map((item, index) => (
          <div 
            key={item.id || index}
            className={`listviewv2-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
            onClick={() => handleSelect(item)}
          >
            <pre>{JSON.stringify(item, null, 2)}</pre>
            <div className="listviewv2-item-actions">
              <button onClick={(e) => {
                e.stopPropagation();
                handleAction('edit', item);
              }}>
                Edit
              </button>
              <button onClick={(e) => {
                e.stopPropagation();
                handleAction('delete', item);
              }}>
                Delete
              </button>
            </div>
          </div㸀
        ))}
      </div>

      <footer className="listviewv2-footer">
        <span>{data.length} items</span>
        <span>{selectedItems.length} selected</span>
      </footer>
    </div>
  );
};

// PropTypes
ListViewV2.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onAction: PropTypes.func,
  onSelect: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyMessage: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

// Default props
ListViewV2.defaultProps = {
  data: [],
  loading: false,
  emptyMessage: 'No data available',
  className: ''
};

export default ListViewV2;
export { ListViewV2 };
