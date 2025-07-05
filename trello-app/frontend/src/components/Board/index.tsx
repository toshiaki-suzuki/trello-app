import React, { useState } from 'react';
import List from '../List';
import './Board.css';

interface CardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
}

interface ListData {
  id: string;
  title: string;
  cards: CardData[];
}

interface BoardProps {
  title: string;
  lists: ListData[];
  onAddList?: (listTitle: string) => void;
  onEditList?: (listId: string) => void;
  onDeleteList?: (listId: string) => void;
  onAddCard?: (listId: string, cardTitle: string) => void;
  onEditCard?: (cardId: string) => void;
  onDeleteCard?: (cardId: string) => void;
  onCardMove?: (cardId: string, sourceListId: string, targetListId: string) => void;
}

const Board: React.FC<BoardProps> = ({
  title,
  lists,
  onAddList,
  onEditList,
  onDeleteList,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onCardMove
}) => {
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const handleAddList = () => {
    if (newListTitle.trim() && onAddList) {
      onAddList(newListTitle.trim());
      setNewListTitle('');
      setIsAddingList(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddList();
    } else if (e.key === 'Escape') {
      setIsAddingList(false);
      setNewListTitle('');
    }
  };

  const handleCardDragStart = (cardId: string, sourceListId: string) => {
    // 将来のドラッグ状態管理に使用可能
  };

  const handleCardDragEnd = () => {
    // 将来のドラッグ状態管理に使用可能
  };

  const handleCardDrop = (cardId: string, sourceListId: string, targetListId: string) => {
    if (onCardMove && sourceListId !== targetListId) {
      onCardMove(cardId, sourceListId, targetListId);
    }
  };

  return (
    <div className="board">
      <div className="board-header">
        <h1 className="board-title">{title}</h1>
      </div>
      
      <div className="board-content">
        <div className="lists-container">
          {lists.map(list => (
            <List
              key={list.id}
              id={list.id}
              title={list.title}
              cards={list.cards}
              onAddCard={onAddCard}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
              onEditList={onEditList}
              onDeleteList={onDeleteList}
              onCardDrop={handleCardDrop}
              onCardDragStart={handleCardDragStart}
              onCardDragEnd={handleCardDragEnd}
            />
          ))}
          
          {isAddingList ? (
            <div className="add-list-form">
              <input
                className="add-list-input"
                placeholder="Enter list title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
              <div className="add-list-actions">
                <button className="add-list-btn" onClick={handleAddList}>
                  Add List
                </button>
                <button 
                  className="cancel-btn" 
                  onClick={() => {
                    setIsAddingList(false);
                    setNewListTitle('');
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button 
              className="add-list-trigger"
              onClick={() => setIsAddingList(true)}
            >
              + Add another list
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;