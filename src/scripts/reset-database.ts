import fs from 'fs';
import path from 'path';
import { getDataSource, User, Post } from '../lib/database';

async function resetDatabase() {
    try {
        console.log('Resetting database...');

        // Path to the SQLite database file
        const dbPath = path.join(process.cwd(), 'data', 'database.sqlite');

        // Check if the database file exists
        if (fs.existsSync(dbPath)) {
            console.log('Deleting existing database file...');
            // Delete the database file
            fs.unlinkSync(dbPath);
            console.log('Database file deleted.');
        }

        // Initialize a new database connection
        // This will create a new database file with the updated schema
        console.log('Initializing new database...');
        const dataSource = await getDataSource();

        // Create a test user
        console.log('Creating test user...');
        const userRepository = dataSource.getRepository(User);

        const user = new User();
        user.username = 'admin';
        user.password = 'password';
        user.theme = 'system'; // Default to system theme

        // Hash the password
        await user.hashPassword();

        // Save the user
        await userRepository.save(user);

        console.log('Test user created successfully.');
        console.log('Username: admin');
        console.log('Password: password');

        // Create a sample post
        console.log('Creating sample post...');
        const postRepository = dataSource.getRepository(Post);

        const post = new Post();
        post.title = 'Welcome to KantanCMS';
        post.content = JSON.stringify({
            time: new Date().getTime(),
            blocks: [
                {
                    type: 'header',
                    data: {
                        text: 'Welcome to KantanCMS',
                        level: 2
                    }
                },
                {
                    type: 'paragraph',
                    data: {
                        text: 'This is a sample post created by the database reset script. You can edit or delete this post from the admin panel.'
                    }
                }
            ]
        });
        post.user = user;

        await postRepository.save(post);

        console.log('Sample post created successfully.');
        console.log('Database reset complete!');

    } catch (error) {
        console.error('Error resetting database:', error);
    } finally {
        // Close the connection
        try {
            const dataSource = await getDataSource();
            if (dataSource.isInitialized) {
                await dataSource.destroy();
            }
        } catch (error) {
            console.error('Error closing database connection:', error);
        }
    }
}

// Run the function
resetDatabase();
