import React, { useState } from 'react';
import './Card.css';

interface CardProps {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDragStart?: (cardId: string, sourceListId: string) => void;
  onDragEnd?: () => void;
  sourceListId?: string;
}

const Card: React.FC<CardProps> = ({ 
  id, 
  title, 
  description, 
  dueDate, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragEnd, 
  sourceListId 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.setData('application/json', JSON.stringify({ cardId: id, sourceListId }));
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    
    if (onDragStart && sourceListId) {
      onDragStart(id, sourceListId);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <div 
      className={`card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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