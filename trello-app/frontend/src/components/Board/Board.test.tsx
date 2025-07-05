import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Board from './index';

// Listコンポーネントをモック
jest.mock('../List', () => {
  return function MockList({ 
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
  }: any) {
    return (
      <div data-testid={`list-${id}`} className="mock-list">
        <h3>{title}</h3>
        <div>{cards.length} cards</div>
        {onEditList && (
          <button onClick={() => onEditList(id)}>Edit List</button>
        )}
        {onDeleteList && (
          <button onClick={() => onDeleteList(id)}>Delete List</button>
        )}
        {onAddCard && (
          <button onClick={() => onAddCard(id, 'New Card')}>Add Card</button>
        )}
        {onEditCard && (
          <button onClick={() => onEditCard('card-1')}>Edit Card</button>
        )}
        {onDeleteCard && (
          <button onClick={() => onDeleteCard('card-1')}>Delete Card</button>
        )}
        {onCardDrop && (
          <button onClick={() => onCardDrop('card-1', 'source-list', id)}>Drop Card</button>
        )}
        {onCardDragStart && (
          <button onClick={() => onCardDragStart('card-1', id)}>Drag Start</button>
        )}
        {onCardDragEnd && (
          <button onClick={() => onCardDragEnd()}>Drag End</button>
        )}
      </div>
    );
  };
});

describe('Board Component', () => {
  const mockLists = [
    {
      id: 'list-1',
      title: 'To Do',
      cards: [
        { id: 'card-1', title: 'Task 1' },
        { id: 'card-2', title: 'Task 2' }
      ]
    },
    {
      id: 'list-2',
      title: 'In Progress',
      cards: [
        { id: 'card-3', title: 'Task 3' }
      ]
    }
  ];

  const mockProps = {
    title: 'Test Board',
    lists: mockLists
  };

  const mockCallbacks = {
    onAddList: jest.fn(),
    onEditList: jest.fn(),
    onDeleteList: jest.fn(),
    onAddCard: jest.fn(),
    onEditCard: jest.fn(),
    onDeleteCard: jest.fn(),
    onCardMove: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders board title', () => {
    render(<Board {...mockProps} />);
    expect(screen.getByText('Test Board')).toBeInTheDocument();
  });

  test('renders all lists', () => {
    render(<Board {...mockProps} />);
    expect(screen.getByTestId('list-list-1')).toBeInTheDocument();
    expect(screen.getByTestId('list-list-2')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('displays correct card counts for each list', () => {
    render(<Board {...mockProps} />);
    expect(screen.getByText('2 cards')).toBeInTheDocument();
    expect(screen.getByText('1 cards')).toBeInTheDocument();
  });

  test('shows add list trigger by default', () => {
    render(<Board {...mockProps} />);
    expect(screen.getByText('+ Add another list')).toBeInTheDocument();
  });

  test('shows add list form when add list trigger is clicked', async () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
      expect(screen.getByText('Add List')).toBeInTheDocument();
    });
  });

  test('hides add list form when cancel button is clicked', async () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    userEvent.click(screen.getByText('✕'));
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter list title...')).not.toBeInTheDocument();
      expect(screen.getByText('+ Add another list')).toBeInTheDocument();
    });
  });

  test('calls onAddList when add list form is submitted', async () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    userEvent.type(screen.getByPlaceholderText('Enter list title...'), 'New List');
    userEvent.click(screen.getByText('Add List'));
    
    expect(mockCallbacks.onAddList).toHaveBeenCalledWith('New List');
  });

  test('calls onAddList when Enter key is pressed in input', async () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Enter list title...');
    userEvent.type(input, 'New List');
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(mockCallbacks.onAddList).toHaveBeenCalledWith('New List');
  });

  test('cancels add list form when Escape key is pressed', async () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('Enter list title...');
    userEvent.type(input, 'New List');
    fireEvent.keyDown(input, { key: 'Escape' });
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter list title...')).not.toBeInTheDocument();
      expect(screen.getByText('+ Add another list')).toBeInTheDocument();
    });
  });

  test('does not add list if title is empty', async () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    userEvent.click(screen.getByText('Add List'));
    
    expect(mockCallbacks.onAddList).not.toHaveBeenCalled();
  });

  test('trims whitespace from list title', async () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    userEvent.type(screen.getByPlaceholderText('Enter list title...'), '  New List  ');
    userEvent.click(screen.getByText('Add List'));
    
    expect(mockCallbacks.onAddList).toHaveBeenCalledWith('New List');
  });

  test('clears form and hides it after successful list addition', async () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    userEvent.type(screen.getByPlaceholderText('Enter list title...'), 'New List');
    userEvent.click(screen.getByText('Add List'));
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter list title...')).not.toBeInTheDocument();
      expect(screen.getByText('+ Add another list')).toBeInTheDocument();
    });
  });

  test('passes list callbacks to List components', () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    // Test edit list callback
    const editListButtons = screen.getAllByText('Edit List');
    fireEvent.click(editListButtons[0]);
    expect(mockCallbacks.onEditList).toHaveBeenCalledWith('list-1');
    
    // Test delete list callback
    const deleteListButtons = screen.getAllByText('Delete List');
    fireEvent.click(deleteListButtons[0]);
    expect(mockCallbacks.onDeleteList).toHaveBeenCalledWith('list-1');
  });

  test('passes card callbacks to List components', () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    // Test add card callback
    const addCardButtons = screen.getAllByText('Add Card');
    fireEvent.click(addCardButtons[0]);
    expect(mockCallbacks.onAddCard).toHaveBeenCalledWith('list-1', 'New Card');
    
    // Test edit card callback
    const editCardButtons = screen.getAllByText('Edit Card');
    fireEvent.click(editCardButtons[0]);
    expect(mockCallbacks.onEditCard).toHaveBeenCalledWith('card-1');
    
    // Test delete card callback
    const deleteCardButtons = screen.getAllByText('Delete Card');
    fireEvent.click(deleteCardButtons[0]);
    expect(mockCallbacks.onDeleteCard).toHaveBeenCalledWith('card-1');
  });

  test('passes drag and drop callbacks to List components', () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    // Test card drop callback
    const dropButtons = screen.getAllByText('Drop Card');
    fireEvent.click(dropButtons[0]);
    expect(mockCallbacks.onCardMove).toHaveBeenCalledWith('card-1', 'source-list', 'list-1');
    
    // Test drag start callback (should not call onCardMove directly)
    const dragStartButtons = screen.getAllByText('Drag Start');
    fireEvent.click(dragStartButtons[0]);
    // onCardMove should not be called on drag start
    expect(mockCallbacks.onCardMove).toHaveBeenCalledTimes(1); // Only from the drop test above
    
    // Test drag end callback
    const dragEndButtons = screen.getAllByText('Drag End');
    fireEvent.click(dragEndButtons[0]);
    // ドラッグ終了時もonCardMoveを呼び出すべきではない
    expect(mockCallbacks.onCardMove).toHaveBeenCalledTimes(1);
  });

  test('does not render list action buttons when callbacks are not provided', () => {
    render(<Board {...mockProps} />);
    expect(screen.queryByText('Edit List')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete List')).not.toBeInTheDocument();
  });

  test('does not render card action buttons when callbacks are not provided', () => {
    render(<Board {...mockProps} />);
    expect(screen.queryByText('Add Card')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit Card')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete Card')).not.toBeInTheDocument();
  });

  test('renders empty board with no lists', () => {
    const emptyProps = { ...mockProps, lists: [] };
    render(<Board {...emptyProps} />);
    
    expect(screen.getByText('Test Board')).toBeInTheDocument();
    expect(screen.getByText('+ Add another list')).toBeInTheDocument();
    expect(screen.queryByTestId(/^list-/)).not.toBeInTheDocument();
  });

  test('handles card drop between different lists', () => {
    render(<Board {...mockProps} {...mockCallbacks} />);
    
    // あるリストから別のリストへのカードドロップをシミュレート
    const dropButtons = screen.getAllByText('Drop Card');
    fireEvent.click(dropButtons[1]); // 2番目のリストでドロップをクリック
    
    expect(mockCallbacks.onCardMove).toHaveBeenCalledWith('card-1', 'source-list', 'list-2');
  });
});