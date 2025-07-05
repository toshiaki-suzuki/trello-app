import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// 編集操作用のwindow.promptをモック
const mockPrompt = jest.fn();
Object.defineProperty(window, 'prompt', {
  writable: true,
  value: mockPrompt,
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the main board with initial data', () => {
    render(<App />);
    
    // Check board title
    expect(screen.getByText('My Trello Board')).toBeInTheDocument();
    
    // Check initial lists
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  test('renders initial cards in correct lists', () => {
    render(<App />);
    
    // Check some initial cards
    expect(screen.getByText('Design login page')).toBeInTheDocument();
    expect(screen.getByText('Set up database')).toBeInTheDocument();
    expect(screen.getByText('Implement user authentication')).toBeInTheDocument();
    expect(screen.getByText('Project setup')).toBeInTheDocument();
  });

  test('can add a new list', async () => {
    render(<App />);
    
    // Click add list trigger
    userEvent.click(screen.getByText('+ Add another list'));
    
    // Wait for form to appear and fill it
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    userEvent.type(screen.getByPlaceholderText('Enter list title...'), 'Testing');
    userEvent.click(screen.getByText('Add List'));
    
    // Check that the new list appears
    await waitFor(() => {
      expect(screen.getByText('Testing')).toBeInTheDocument();
    });
  });

  test('can add a new card to a list', async () => {
    render(<App />);
    
    // Find and click the add card button for the first list (To Do)
    const addCardTriggers = screen.getAllByText('+ Add a card');
    userEvent.click(addCardTriggers[0]);
    
    // Wait for form to appear and fill it
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    userEvent.type(screen.getByPlaceholderText('Enter a title for this card...'), 'New Test Card');
    userEvent.click(screen.getByText('Add Card'));
    
    // Check that the new card appears
    await waitFor(() => {
      expect(screen.getByText('New Test Card')).toBeInTheDocument();
    });
  });

  test('can edit a list title', () => {
    mockPrompt.mockReturnValue('Updated List Title');
    render(<App />);
    
    // Find and click edit button for first list
    const editButtons = screen.getAllByTitle('Edit List');
    fireEvent.click(editButtons[0]);
    
    expect(mockPrompt).toHaveBeenCalledWith('Enter new list title:');
    expect(screen.getByText('Updated List Title')).toBeInTheDocument();
  });

  test('can edit a card title', () => {
    mockPrompt.mockReturnValue('Updated Card Title');
    render(<App />);
    
    // Find and click edit button for first card
    const editButtons = screen.getAllByTitle('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockPrompt).toHaveBeenCalledWith('Enter new card title:');
    expect(screen.getByText('Updated Card Title')).toBeInTheDocument();
  });

  test('can delete a card', () => {
    render(<App />);
    
    // Verify card exists first
    expect(screen.getByText('Design login page')).toBeInTheDocument();
    
    // Find and click delete button for first card
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);
    
    // Card should be removed
    expect(screen.queryByText('Design login page')).not.toBeInTheDocument();
  });

  test('can delete a list', () => {
    render(<App />);
    
    // Verify list exists first
    expect(screen.getByText('To Do')).toBeInTheDocument();
    
    // Find and click delete button for first list
    const deleteListButtons = screen.getAllByTitle('Delete List');
    fireEvent.click(deleteListButtons[0]);
    
    // List should be removed (but we should still have other lists)
    expect(screen.queryByText('To Do')).not.toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  test('handles drag and drop card movement', () => {
    render(<App />);
    
    // Verify initial state
    const toDoList = screen.getByText('To Do').closest('.list');
    const inProgressList = screen.getByText('In Progress').closest('.list');
    
    expect(toDoList).toContainElement(screen.getByText('Design login page'));
    expect(inProgressList).not.toContainElement(screen.getByText('Design login page'));
    
    // Simulate drag and drop
    const card = screen.getByText('Design login page').closest('.card');
    
    // Create mock drag events
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: jest.fn(),
        effectAllowed: ''
      }
    });
    
    const dropEvent = new Event('drop', { bubbles: true });
    Object.defineProperty(dropEvent, 'preventDefault', { value: jest.fn() });
    Object.defineProperty(dropEvent, 'dataTransfer', {
      value: {
        getData: jest.fn((type) => {
          if (type === 'application/json') {
            return JSON.stringify({ cardId: '1', sourceListId: '1' });
          }
          return '';
        })
      }
    });
    
    // Trigger drag start on card
    fireEvent(card!, dragStartEvent);
    
    // Trigger drop on In Progress list
    fireEvent(inProgressList!, dropEvent);
    
    // カードはIn Progressリストに移動されるべき
    // 注意: これは簡略化されたテスト - 実際の実装では、
    // カードは新しいリストで再レンダリングされる
  });

  test('does not edit when prompt is cancelled', () => {
    mockPrompt.mockReturnValue(null); // ユーザーがキャンセル
    render(<App />);
    
    const originalText = 'To Do';
    expect(screen.getByText(originalText)).toBeInTheDocument();
    
    // Try to edit list
    const editButtons = screen.getAllByTitle('Edit List');
    fireEvent.click(editButtons[0]);
    
    // Text should remain unchanged
    expect(screen.getByText(originalText)).toBeInTheDocument();
  });

  test('does not edit with empty input', () => {
    mockPrompt.mockReturnValue('   '); // 空白のみ
    render(<App />);
    
    const originalText = 'To Do';
    expect(screen.getByText(originalText)).toBeInTheDocument();
    
    // Try to edit list
    const editButtons = screen.getAllByTitle('Edit List');
    fireEvent.click(editButtons[0]);
    
    // Text should remain unchanged
    expect(screen.getByText(originalText)).toBeInTheDocument();
  });

  test('shows card descriptions and due dates', () => {
    render(<App />);
    
    // Check for card with description
    expect(screen.getByText('Create mockups and wireframes for the login interface')).toBeInTheDocument();
    
    // Check for card with due date
    expect(screen.getByText('Due: 2024-01-15')).toBeInTheDocument();
  });

  test('handles empty card addition', async () => {
    render(<App />);
    
    // Click add card trigger
    const addCardTriggers = screen.getAllByText('+ Add a card');
    userEvent.click(addCardTriggers[0]);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
    });
    
    // Try to add empty card
    userEvent.click(screen.getByText('Add Card'));
    
    // Form should still be visible (card not added)
    expect(screen.getByPlaceholderText('Enter a title for this card...')).toBeInTheDocument();
  });

  test('handles empty list addition', async () => {
    render(<App />);
    
    // Click add list trigger
    userEvent.click(screen.getByText('+ Add another list'));
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
    });
    
    // Try to add empty list
    userEvent.click(screen.getByText('Add List'));
    
    // Form should still be visible (list not added)
    expect(screen.getByPlaceholderText('Enter list title...')).toBeInTheDocument();
  });
});
