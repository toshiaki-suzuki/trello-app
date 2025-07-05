# Trello App Backend

A NestJS-based backend API for a Trello-like task management application.

## Features

- **Boards**: Create and manage project boards
- **Lists**: Organize tasks into customizable lists
- **Cards**: Create detailed task cards with descriptions and due dates
- **TypeORM**: Database operations with SQLite
- **CORS**: Cross-origin resource sharing enabled

## Tech Stack

- **Framework**: NestJS
- **Database**: SQLite with TypeORM
- **Language**: TypeScript
- **Runtime**: Node.js

## Installation

```bash
npm install
```

## Development

```bash
# Start development server
npm run start:dev

# Start with debug mode
npm run start:debug
```

## Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

## Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:cov

# Run e2e tests
npm run test:e2e
```

## API Endpoints

The server runs on port 3001 by default.

### Data Model

- **Board**: Contains multiple lists, has title, description, and background color
- **List**: Belongs to a board, contains multiple cards, has position ordering
- **Card**: Belongs to a list, has title, description, position, and optional due date

## Project Structure

```
src/
├── entities/          # TypeORM entities
│   ├── board.entity.ts
│   ├── list.entity.ts
│   └── card.entity.ts
├── app.controller.ts   # Main controller
├── app.module.ts      # Main module
├── app.service.ts     # Main service
└── main.ts           # Application entry point
```