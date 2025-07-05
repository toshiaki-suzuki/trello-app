import React, { useState } from 'react';
import Card from './Card';
import './List.css';

interface CardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
}

interface ListProps {
  id: string;
  title: string;
  cards: CardData[];
  onAddCard?: (listId: string, cardTitle: string) => void;
  onEditCard?: (cardId: string) => void;
  onDeleteCard?: (cardId: string) => void;
  onEditList?: (listId: string) => void;
  onDeleteList?: (listId: string) => void;
  onCardDrop?: (cardId: string, sourceListId: string, targetListId: string) => void;
  onCardDragStart?: (cardId: string, sourceListId: string) => void;
  onCardDragEnd?: () => void;
}

const List: React.FC<ListProps> = ({ 
  id, 
  title, 
  cards, 
  onAddCard, 
  onEditCard, 
  onDeleteCard, 
  onEditList, 
  onDeleteList,
  onCardDrop,
  onCardDragStart,
  onCardDragEnd
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle.trim() && onAddCard) {
      onAddCard(id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      setIsAddingCard(false);
      setNewCardTitle('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const dragData = e.dataTransfer.getData('application/json');
      const { cardId, sourceListId } = JSON.parse(dragData);
      
      if (onCardDrop && sourceListId !== id) {
        onCardDrop(cardId, sourceListId, id);
      }
    } catch (error) {
      console.error('Error handling card drop:', error);
    }
  };

  return (
    <div 
      className={`list ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="list-header">
        <h3 className="list-title">{title}</h3>
        <div className="list-actions">
          {onEditList && (
            <button className="list-action-btn" onClick={() => onEditList(id)} title="Edit List">
              ✏️
            </button>
          )}
          {onDeleteList && (
            <button className="list-action-btn" onClick={() => onDeleteList(id)} title="Delete List">
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <div className="list-cards">
        {cards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            dueDate={card.dueDate}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onDragStart={onCardDragStart}
            onDragEnd={onCardDragEnd}
            sourceListId={id}
          />
        ))}
      </div>

      {isAddingCard ? (
        <div className="add-card-form">
          <textarea
            className="add-card-input"
            placeholder="Enter a title for this card..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <div className="add-card-actions">
            <button className="add-card-btn" onClick={handleAddCard}>
              Add Card
            </button>
            <button 
              className="cancel-btn" 
              onClick={() => {
                setIsAddingCard(false);
                setNewCardTitle('');
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="add-card-trigger"
          onClick={() => setIsAddingCard(true)}
        >
          + Add a card
        </button>
      )}
    </div>
  );
};

export default List;