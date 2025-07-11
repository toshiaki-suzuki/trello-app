import React, { useState } from 'react';
import Board from './components/Board';
import './App.css';

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

function App() {
  const [lists, setLists] = useState<ListData[]>([
    {
      id: '1',
      title: 'To Do',
      cards: [
        {
          id: '1',
          title: 'Design login page',
          description: 'Create mockups and wireframes for the login interface',
          dueDate: '2024-01-15'
        },
        {
          id: '2',
          title: 'Set up database',
          description: 'Configure PostgreSQL database and initial schema'
        },
        {
          id: '3',
          title: 'Write API documentation',
          dueDate: '2024-01-20'
        }
      ]
    },
    {
      id: '2',
      title: 'In Progress',
      cards: [
        {
          id: '4',
          title: 'Implement user authentication',
          description: 'Add JWT token-based authentication system',
          dueDate: '2024-01-18'
        },
        {
          id: '5',
          title: 'Create dashboard components',
          description: 'Build React components for the main dashboard'
        }
      ]
    },
    {
      id: '3',
      title: 'Review',
      cards: [
        {
          id: '6',
          title: 'Code review for user service',
          description: 'Review and approve the user management service implementation'
        }
      ]
    },
    {
      id: '4',
      title: 'Done',
      cards: [
        {
          id: '7',
          title: 'Project setup',
          description: 'Initialize React and Node.js project structure'
        },
        {
          id: '8',
          title: 'Install dependencies',
          description: 'Set up all required npm packages'
        }
      ]
    }
  ]);

  const handleAddList = (listTitle: string) => {
    const newList: ListData = {
      id: Date.now().toString(),
      title: listTitle,
      cards: []
    };
    setLists([...lists, newList]);
  };

  const handleDeleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  const handleAddCard = (listId: string, cardTitle: string) => {
    const newCard: CardData = {
      id: Date.now().toString(),
      title: cardTitle
    };
    
    setLists(lists.map(list => 
      list.id === listId 
        ? { ...list, cards: [...list.cards, newCard] }
        : list
    ));
  };

  const handleDeleteCard = (cardId: string) => {
    setLists(lists.map(list => ({
      ...list,
      cards: list.cards.filter(card => card.id !== cardId)
    })));
  };

  const handleEditList = (listId: string) => {
    const newTitle = prompt('Enter new list title:');
    if (newTitle && newTitle.trim()) {
      setLists(lists.map(list => 
        list.id === listId 
          ? { ...list, title: newTitle.trim() }
          : list
      ));
    }
  };

  const handleEditCard = (cardId: string) => {
    const newTitle = prompt('Enter new card title:');
    if (newTitle && newTitle.trim()) {
      setLists(lists.map(list => ({
        ...list,
        cards: list.cards.map(card =>
          card.id === cardId
            ? { ...card, title: newTitle.trim() }
            : card
        )
      })));
    }
  };

  const handleCardMove = (cardId: string, sourceListId: string, targetListId: string) => {
    // まず移動するカードを見つける
    let cardToMove: CardData | undefined;
    
    for (const list of lists) {
      if (list.id === sourceListId) {
        cardToMove = list.cards.find(card => card.id === cardId);
        break;
      }
    }
    
    // カードが見つからない場合は早期終了
    if (!cardToMove) {
      console.error(`Card with id ${cardId} not found in list ${sourceListId}`);
      return;
    }
    
    // ソースリストからカードを削除し、ターゲットリストに追加
    setLists(lists.map(list => {
      if (list.id === sourceListId) {
        return {
          ...list,
          cards: list.cards.filter(card => card.id !== cardId)
        };
      } else if (list.id === targetListId) {
        return {
          ...list,
          cards: [...list.cards, cardToMove!]
        };
      }
      return list;
    }));
  };

  return (
    <div className="App">
      <Board
        title="My Trello Board"
        lists={lists}
        onAddList={handleAddList}
        onEditList={handleEditList}
        onDeleteList={handleDeleteList}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
        onDeleteCard={handleDeleteCard}
        onCardMove={handleCardMove}
      />
    </div>
  );
}

export default App;
