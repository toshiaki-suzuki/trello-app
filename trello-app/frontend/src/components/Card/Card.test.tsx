import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './index';

describe('Card Component', () => {
  const mockProps = {
    id: '1',
    title: 'Test Card',
    description: 'Test description',
    dueDate: '2024-01-15',
    sourceListId: 'list-1'
  };

  const mockCallbacks = {
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onDragStart: jest.fn(),
    onDragEnd: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders card with title', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  test('renders card with description when provided', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  test('renders card with due date when provided', () => {
    render(<Card {...mockProps} />);
    expect(screen.getByText('Due: 2024-01-15')).toBeInTheDocument();
  });

  test('does not render description when not provided', () => {
    const propsWithoutDescription = { ...mockProps };
    delete propsWithoutDescription.description;
    render(<Card {...propsWithoutDescription} />);
    expect(screen.queryByText('Test description')).not.toBeInTheDocument();
  });

  test('does not render due date when not provided', () => {
    const propsWithoutDueDate = { ...mockProps };
    delete propsWithoutDueDate.dueDate;
    render(<Card {...propsWithoutDueDate} />);
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  test('renders edit button when onEdit is provided', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    expect(screen.getByTitle('Edit')).toBeInTheDocument();
  });

  test('renders delete button when onDelete is provided', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  test('does not render edit button when onEdit is not provided', () => {
    render(<Card {...mockProps} />);
    expect(screen.queryByTitle('Edit')).not.toBeInTheDocument();
  });

  test('does not render delete button when onDelete is not provided', () => {
    render(<Card {...mockProps} />);
    expect(screen.queryByTitle('Delete')).not.toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    fireEvent.click(screen.getByTitle('Edit'));
    expect(mockCallbacks.onEdit).toHaveBeenCalledWith('1');
  });

  test('calls onDelete when delete button is clicked', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    fireEvent.click(screen.getByTitle('Delete'));
    expect(mockCallbacks.onDelete).toHaveBeenCalledWith('1');
  });

  test('is draggable', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    const cardElement = screen.getByText('Test Card').closest('.card');
    expect(cardElement).toHaveAttribute('draggable', 'true');
  });

  test('calls onDragStart when drag starts', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    const cardElement = screen.getByText('Test Card').closest('.card');
    
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: jest.fn(),
        effectAllowed: ''
      }
    });

    fireEvent(cardElement!, dragStartEvent);
    expect(mockCallbacks.onDragStart).toHaveBeenCalledWith('1', 'list-1');
  });

  test('calls onDragEnd when drag ends', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    const cardElement = screen.getByText('Test Card').closest('.card');
    
    fireEvent.dragEnd(cardElement!);
    expect(mockCallbacks.onDragEnd).toHaveBeenCalled();
  });

  test('applies dragging class during drag', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    const cardElement = screen.getByText('Test Card').closest('.card');
    
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: jest.fn(),
        effectAllowed: ''
      }
    });

    fireEvent(cardElement!, dragStartEvent);
    expect(cardElement).toHaveClass('dragging');
  });

  test('removes dragging class when drag ends', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    const cardElement = screen.getByText('Test Card').closest('.card');
    
    // ドラッグ開始
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: jest.fn(),
        effectAllowed: ''
      }
    });
    fireEvent(cardElement!, dragStartEvent);
    
    // ドラッグ終了
    fireEvent.dragEnd(cardElement!);
    expect(cardElement).not.toHaveClass('dragging');
  });

  test('sets correct data transfer data on drag start', () => {
    render(<Card {...mockProps} {...mockCallbacks} />);
    const cardElement = screen.getByText('Test Card').closest('.card');
    
    const setDataMock = jest.fn();
    const dragStartEvent = new Event('dragstart', { bubbles: true });
    Object.defineProperty(dragStartEvent, 'dataTransfer', {
      value: {
        setData: setDataMock,
        effectAllowed: ''
      }
    });

    fireEvent(cardElement!, dragStartEvent);
    
    expect(setDataMock).toHaveBeenCalledWith('text/plain', '1');
    expect(setDataMock).toHaveBeenCalledWith(
      'application/json', 
      JSON.stringify({ cardId: '1', sourceListId: 'list-1' })
    );
  });
});