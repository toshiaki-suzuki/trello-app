import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import List from './index';

// Mock the Card component
jest.mock('../Card', () => {
  return function MockCard({ id, title, onEdit, onDelete, onDragStart, onDragEnd, sourceListId }: any) {
    return (
      <div 
        data-testid={`card-${id}`}
        className="mock-card"
        draggable
        onDragStart={() => onDragStart?.(id, sourceListId)}
        onDragEnd={() => onDragEnd?.()}
      >
        <span>{title}</span>
        {onEdit && <button onClick={() => onEdit(id)}>Edit</button>}
        {onDelete && <button onClick={() => onDelete(id)}>Delete</button>}
      </div>
    );
  };
});

describe('List Component', () => {
  const mockCards = [
    { id: '1', title: 'Card 1', description: 'Description 1' },
    { id: '2', title: 'Card 2', dueDate: '2024-01-15' }
  ];

  const mockProps = {
    id: 'list-1',
    title: 'Test List',
    cards: mockCards
  };

  const mockCallbacks = {
    onAddCard: jest.fn(),
    onEditCard: jest.fn(),
    onDeleteCard: jest.fn(),
    onEditList: jest.fn(),
    onDeleteList: jest.fn(),
    onCardDrop: jest.fn(),
    onCardDragStart: jest.fn(),
    onCardDragEnd: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders list title', () => {
    render(<List {...mockProps} />);
    expect(screen.getByText('Test List')).toBeInTheDocument();
  });

  test('renders all cards', () => {
    render(<List {...mockProps} />);
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
  });

  test('renders edit button when onEditList is provided', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    expect(screen.getByTitle('Edit List')).toBeInTheDocument();
  });

  test('renders delete button when onDeleteList is provided', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    expect(screen.getByTitle('Delete List')).toBeInTheDocument();
  });

  test('does not render edit button when onEditList is not provided', () => {
    render(<List {...mockProps} />);
    expect(screen.queryByTitle('Edit List')).not.toBeInTheDocument();
  });

  test('does not render delete button when onDeleteList is not provided', () => {
    render(<List {...mockProps} />);
    expect(screen.queryByTitle('Delete List')).not.toBeInTheDocument();
  });

  test('calls onEditList when edit button is clicked', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    fireEvent.click(screen.getByTitle('Edit List'));
    expect(mockCallbacks.onEditList).toHaveBeenCalledWith('list-1');
  });

  test('calls onDeleteList when delete button is clicked', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    fireEvent.click(screen.getByTitle('Delete List'));
    expect(mockCallbacks.onDeleteList).toHaveBeenCalledWith('list-1');
  });

  test('shows add card trigger by default', () => {
    render(<List {...mockProps} />);
    expect(screen.getByText('+ Add a card')).toBeInTheDocument();
  });

  test('shows add card form when add card trigger is clicked', async () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add a card'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
      expect(screen.getByText('Add Card')).toBeInTheDocument();
    });
  });

  test('hides add card form when cancel button is clicked', async () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add a card'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    userEvent.click(screen.getByText('✕'));
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter a title for this card...')).not.toBeInTheDocument();
      expect(screen.getByText('+ Add a card')).toBeInTheDocument();
    });
  });

  test('calls onAddCard when add card form is submitted', async () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add a card'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    userEvent.type(screen.getByPlaceholderText('Enter a title for this card...'), 'New Card');
    userEvent.click(screen.getByText('Add Card'));
    
    expect(mockCallbacks.onAddCard).toHaveBeenCalledWith('list-1', 'New Card');
  });

  test('calls onAddCard when Enter key is pressed in textarea', async () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add a card'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    const textarea = screen.getByPlaceholderText('Enter a title for this card...');
    userEvent.type(textarea, 'New Card');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    
    expect(mockCallbacks.onAddCard).toHaveBeenCalledWith('list-1', 'New Card');
  });

  test('cancels add card form when Escape key is pressed', async () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add a card'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    const textarea = screen.getByPlaceholderText('Enter a title for this card...');
    userEvent.type(textarea, 'New Card');
    fireEvent.keyDown(textarea, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter a title for this card...')).not.toBeInTheDocument();
      expect(screen.getByText('+ Add a card')).toBeInTheDocument();
    });
  });

  test('does not add card if title is empty', async () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add a card'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    userEvent.click(screen.getByText('Add Card'));
    
    expect(mockCallbacks.onAddCard).not.toHaveBeenCalled();
  });

  test('trims whitespace from card title', async () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add a card'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    userEvent.type(screen.getByPlaceholderText('Enter a title for this card...'), '  New Card  ');
    userEvent.click(screen.getByText('Add Card'));
    
    expect(mockCallbacks.onAddCard).toHaveBeenCalledWith('list-1', 'New Card');
  });

  test('clears form and hides it after successful card addition', async () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add a card'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    userEvent.type(screen.getByPlaceholderText('Enter a title for this card...'), 'New Card');
    userEvent.click(screen.getByText('Add Card'));
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter a title for this card...')).not.toBeInTheDocument();
      expect(screen.getByText('+ Add a card')).toBeInTheDocument();
    });
  });

  test('passes card callbacks to Card components', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    // Click edit button on first card
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    expect(mockCallbacks.onEditCard).toHaveBeenCalledWith('1');
    
    // Click delete button on first card
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(mockCallbacks.onDeleteCard).toHaveBeenCalledWith('1');
  });

  test('handles drag over event', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    const listElement = screen.getByText('Test List').closest('.list');
    
    const dragOverEvent = new Event('dragover', { bubbles: true });
    Object.defineProperty(dragOverEvent, 'preventDefault', {
      value: jest.fn()
    });
    Object.defineProperty(dragOverEvent, 'dataTransfer', {
      value: { dropEffect: '' }
    });
    
    fireEvent(listElement!, dragOverEvent);
    expect(listElement).toHaveClass('drag-over');
  });

  test('handles drag leave event', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    const listElement = screen.getByText('Test List').closest('.list');
    
    // First trigger drag over to set drag-over class
    const dragOverEvent = new Event('dragover', { bubbles: true });
    Object.defineProperty(dragOverEvent, 'preventDefault', { value: jest.fn() });
    Object.defineProperty(dragOverEvent, 'dataTransfer', { value: { dropEffect: '' } });
    fireEvent(listElement!, dragOverEvent);
    
    // Then trigger drag leave
    const dragLeaveEvent = new Event('dragleave', { bubbles: true });
    Object.defineProperty(dragLeaveEvent, 'preventDefault', { value: jest.fn() });
    fireEvent(listElement!, dragLeaveEvent);
    
    expect(listElement).not.toHaveClass('drag-over');
  });

  test('handles drop event and calls onCardDrop', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    const listElement = screen.getByText('Test List').closest('.list');
    
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'preventDefault', { value: jest.fn() });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        getData: jest.fn((type) => {
          if (type === 'application/json') {
            return JSON.stringify({ cardId: 'card-1', sourceListId: 'list-2' });
          }
          return '';
        })
      }
    });
    
    fireEvent(listElement!, dropEvent);
    expect(mockCallbacks.onCardDrop).toHaveBeenCalledWith('card-1', 'list-2', 'list-1');
  });

  test('does not call onCardDrop if source and target lists are the same', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    const listElement = screen.getByText('Test List').closest('.list');
    
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'preventDefault', { value: jest.fn() });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        getData: jest.fn((type) => {
          if (type === 'application/json') {
            return JSON.stringify({ cardId: 'card-1', sourceListId: 'list-1' });
          }
          return '';
        })
      }
    });
    
    fireEvent(listElement!, dropEvent);
    expect(mockCallbacks.onCardDrop).not.toHaveBeenCalled();
  });

  test('passes drag callbacks to Card components', () => {
    render(<List {...mockProps} {...mockCallbacks} />);
    
    const cardElement = screen.getByTestId('card-1');
    
    // Test drag start
    fireEvent.dragStart(cardElement);
    expect(mockCallbacks.onCardDragStart).toHaveBeenCalledWith('1', 'list-1');
    
    // Test drag end
    fireEvent.dragEnd(cardElement);
    expect(mockCallbacks.onCardDragEnd).toHaveBeenCalled();
  });
});