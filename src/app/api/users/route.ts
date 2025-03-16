import { NextRequest, NextResponse } from 'next/server';
import { getDataSource, User } from '@/lib/database';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    
    const users = await userRepository.find({
      select: ['id', 'username', 'avatar', 'createdAt', 'modifiedAt'],
      order: { createdAt: 'DESC' }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);
    
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Check if username already exists
    const existingUser = await userRepository.findOne({ where: { username } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }
    
    // Handle avatar upload if provided
    let avatarPath: string | null = null;
    const avatarFile = formData.get('avatar') as File;
    
    if (avatarFile && avatarFile.size > 0) {
      // Create a unique filename
      const fileExtension = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      
      // Save the file to the public directory
      const avatarBuffer = await avatarFile.arrayBuffer();
      const fs = require('fs');
      const path = require('path');
      
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Write the file
      fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(avatarBuffer));
      
      // Set the avatar path to be stored in the database
      avatarPath = `/uploads/${fileName}`;
    }
    
    // Create and save the new user
    const user = new User();
    user.username = username;
    user.password = password;
    user.avatar = avatarPath;
    
    // Hash the password before saving
    await user.hashPassword();
    
    const savedUser = await userRepository.save(user);
    
    // Return the user without the password
    const { password: _, ...userWithoutPassword } = savedUser;
    
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
