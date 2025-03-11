# Identity Engine

The central authentication and authorization service for OpenSuite.

## Features

- User management
- Role-based access control (RBAC)
- Permission management
- JWT-based authentication
- GraphQL API

## Tech Stack

- TypeScript
- Hono.js (API Framework)
- TypeORM (Database ORM)
- PostgreSQL (Database)
- GraphQL (API Query Language)

## Setup

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Update the values in `.env` as needed.

3. Run the setup script:
```bash
bun run setup
```
This will:
- Create the database if it doesn't exist
- Run migrations
- Seed initial data (admin user, roles, permissions)

4. Start the development server:
```bash
bun run dev
```

## Database Management

### Migrations

Generate a new migration:
```bash
bun run migration:generate src/database/migrations/MigrationName
```

Run migrations:
```bash
bun run migration:run
```

Revert last migration:
```bash
bun run migration:revert
```

### Seeding

To run the seed script separately:
```bash
bun run seed
```

## API Documentation

### GraphQL Endpoint

The GraphQL API is available at: `http://localhost:4000/api/graphql`

### Authentication

All API routes (except /api/auth/*) require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Default Admin Account

After setup, you can log in with:
- Email: admin@opensuite.com
- Password: Admin123!

## Development

### Project Structure

```
src/
├── database/
│   ├── entities/        # TypeORM entity definitions
│   ├── migrations/      # Database migrations
│   └── data-source.ts   # TypeORM configuration
├── graphql/
│   ├── resolvers.ts     # GraphQL resolvers
│   ├── schema.ts        # GraphQL schema setup
│   └── typeDefs.ts      # GraphQL type definitions
├── middleware/          # Custom middleware
├── routes/             # API routes
└── server.ts           # Main application entry
```

### Adding New Features

1. Create entity in `src/database/entities/`
2. Generate migration using `bun run migration:generate`
3. Add GraphQL types in `src/graphql/typeDefs.ts`
4. Implement resolvers in `src/graphql/resolvers.ts`
5. Run migrations and test

## Testing

```bash
bun test
```

## License

MIT
