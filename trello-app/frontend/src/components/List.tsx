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
}

const List: React.FC<ListProps> = ({ 
  id, 
  title, 
  cards, 
  onAddCard, 
  onEditCard, 
  onDeleteCard, 
  onEditList, 
  onDeleteList 
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

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

  return (
    <div className="list">
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