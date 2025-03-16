# KantanCMS

A simple CMS with admin console and frontpage built with Next.js 14, TypeORM, and Tailwind CSS.

## Features

- Next.js 14 with App Router
- TypeORM for database management
- Tailwind CSS for styling
- Docker Compose for development environment
- Support for multiple databases (MySQL, PostgreSQL, SQLite)

## Database Structure

- **User**: id, username, password, avatar, modifiedAt, createdAt
- **Posts**: id, parentId, userId, title, content, modifiedAt, createdAt

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (optional, for running MySQL/PostgreSQL)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd kantancms
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Copy the environment file and configure it
   ```bash
   cp .env.example .env
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Using Docker

1. Start the Docker containers
   ```bash
   docker-compose up -d
   ```

2. Access the application at [http://localhost:3000](http://localhost:3000)

## Database Configuration

By default, the application uses SQLite for development and testing. You can switch to MySQL or PostgreSQL by changing the `DB_TYPE` environment variable in your `.env` file or in the `docker-compose.yml` file.

## Development

This project uses the `dev` branch for development. The `main` branch is reserved for stable releases.

```bash
# Switch to the dev branch
git checkout dev

# Create a new feature branch
git checkout -b feature/your-feature-name

# After making changes, commit and push to your feature branch
git add .
git commit -m "Description of your changes"
git push origin feature/your-feature-name

# When ready, merge to dev branch
git checkout dev
git merge feature/your-feature-name
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
