import { getDataSource, User } from '../lib/database';

async function createTestUser() {
    try {
        console.log('Connecting to database...');
        const dataSource = await getDataSource();

        console.log('Checking if test user exists...');
        const userRepository = dataSource.getRepository(User);
        const existingUser = await userRepository.findOne({ where: { username: 'admin' } });

        if (existingUser) {
            console.log('Test user already exists.');
            return;
        }

        console.log('Creating test user...');
        const user = new User();
        user.username = 'admin';
        user.password = 'password';

        // Hash the password
        await user.hashPassword();

        // Save the user
        await userRepository.save(user);

        console.log('Test user created successfully.');
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        process.exit(0);
    }
}

createTestUser();
