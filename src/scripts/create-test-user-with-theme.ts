import { getDataSource, User } from '../lib/database';

async function createTestUser() {
    try {
        // Initialize database connection
        const dataSource = await getDataSource();
        const userRepository = dataSource.getRepository(User);

        // Check if test user already exists
        const existingUser = await userRepository.findOne({
            where: { username: 'admin' }
        });

        if (existingUser) {
            console.log('Test user already exists');
            return;
        }

        // Create a new user
        const user = new User();
        user.username = 'admin';
        user.password = 'password';
        user.theme = 'system'; // Default to system theme

        // Hash the password
        await user.hashPassword();

        // Save the user
        await userRepository.save(user);

        console.log('Test user created successfully');
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        // Close the connection
        const dataSource = await getDataSource();
        await dataSource.destroy();
    }
}

// Run the function
createTestUser();
