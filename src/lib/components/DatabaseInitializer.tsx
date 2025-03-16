import { initializeDatabase } from '@/lib/database';

// This component initializes the database connection when the app starts
export default async function DatabaseInitializer() {
  try {
    await initializeDatabase();
    // This component doesn't render anything
    return null;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return null;
  }
}
