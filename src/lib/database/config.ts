import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './entities/User';
import { Post } from './entities/Post';
import path from 'path';

// Default configuration for SQLite (development/testing)
const sqliteConfig: DataSourceOptions = {
  type: 'sqlite',
  database: path.join(process.cwd(), 'data', 'database.sqlite'),
  entities: [User, Post],
  synchronize: true, // Set to false in production
  logging: process.env.NODE_ENV === 'development',
};

// MySQL configuration
const mysqlConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'kantancms',
  entities: [User, Post],
  synchronize: false, // Always false in production
  logging: process.env.NODE_ENV === 'development',
};

// PostgreSQL configuration
const postgresConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'kantancms',
  entities: [User, Post],
  synchronize: false, // Always false in production
  logging: process.env.NODE_ENV === 'development',
};

// Select the database configuration based on environment variable
const getConfig = (): DataSourceOptions => {
  const dbType = process.env.DB_TYPE || 'sqlite';

  switch (dbType) {
    case 'mysql':
      return mysqlConfig;
    case 'postgres':
      return postgresConfig;
    case 'sqlite':
    default:
      return sqliteConfig;
  }
};

// Create and export the DataSource
export const AppDataSource = new DataSource(getConfig());
