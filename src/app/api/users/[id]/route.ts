import { NextRequest, NextResponse } from 'next/server';
import { getDataSource, User } from '@/lib/database';
import fs from 'fs';
import path from 'path';

// GET /api/users/[id] - Get a specific user
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: id },
      select: ['id', 'username', 'avatar', 'createdAt', 'modifiedAt']
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Find the user to update
    const user = await userRepository.findOne({
      where: { id: id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string | null;

    // Update username if provided
    if (username && username !== user.username) {
      // Check if the new username already exists
      const existingUser = await userRepository.findOne({ where: { username } });
      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        );
      }

      user.username = username;
    }

    // Update password if provided
    if (password) {
      user.password = password;
      await user.hashPassword();
    }

    // Handle avatar upload if provided
    const avatarFile = formData.get('avatar') as File;

    if (avatarFile && avatarFile.size > 0) {
      // Delete old avatar file if it exists
      if (user.avatar) {
        const oldAvatarPath = path.join(process.cwd(), 'public', user.avatar);
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      // Create a unique filename
      const fileExtension = avatarFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

      // Save the file to the public directory
      const avatarBuffer = await avatarFile.arrayBuffer();

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Write the file
      fs.writeFileSync(path.join(uploadDir, fileName), Buffer.from(avatarBuffer));

      // Set the avatar path to be stored in the database
      user.avatar = `/uploads/${fileName}`;
    }

    // Save the updated user
    const updatedUser = await userRepository.save(user);

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const dataSource = await getDataSource();
    const userRepository = dataSource.getRepository(User);

    // Find the user to delete
    const user = await userRepository.findOne({
      where: { id: id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete avatar file if it exists
    if (user.avatar) {
      const avatarPath = path.join(process.cwd(), 'public', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Delete the user
    await userRepository.remove(user);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
