import React from 'react';
import './Card.css';

interface CardProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ id, title, description, dueDate, onEdit, onDelete }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title">{title}</h4>
        <div className="card-actions">
          {onEdit && (
            <button className="card-action-btn" onClick={() => onEdit(id)} title="Edit">
              ✏️
            </button>
          )}
          {onDelete && (
            <button className="card-action-btn" onClick={() => onDelete(id)} title="Delete">
              🗑️
            </button>
          )}
        </div>
      </div>
      {description && <p className="card-description">{description}</p>}
      {dueDate && <div className="card-due-date">Due: {dueDate}</div>}
    </div>
  );
};

export default Card;