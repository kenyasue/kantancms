import { NextRequest, NextResponse } from 'next/server';
import { getDataSource, User } from '@/lib/database';

// POST /api/auth - Login
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { username, password } = data;

        // Validate required fields
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        // Get user from database
        const dataSource = await getDataSource();
        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { username } });

        // Check if user exists
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Validate password
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid username or password' },
                { status: 401 }
            );
        }

        // Return success without password
        const { password: _, ...userWithoutPassword } = user;

        // Create response with authentication cookie
        const response = NextResponse.json(userWithoutPassword);
        response.cookies.set({
            name: 'auth',
            value: user.id,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            sameSite: 'strict',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

// DELETE /api/auth - Logout
export async function DELETE() {
    try {
        // Create response and clear authentication cookie
        const response = NextResponse.json({ success: true });
        response.cookies.delete('auth');

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}

// GET /api/auth - Check if user is authenticated
export async function GET(request: NextRequest) {
    try {
        // Get auth cookie from request
        const authCookie = request.cookies.get('auth');

        if (!authCookie?.value) {
            return NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
        }

        // Get user from database
        const dataSource = await getDataSource();
        const userRepository = dataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: authCookie.value },
            select: ['id', 'username', 'avatar', 'theme', 'createdAt', 'modifiedAt']
        });

        if (!user) {
            // Create response and clear invalid auth cookie
            const response = NextResponse.json(
                { authenticated: false },
                { status: 401 }
            );
            response.cookies.delete('auth');
            return response;
        }

        return NextResponse.json({
            authenticated: true,
            user
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { authenticated: false },
            { status: 500 }
        );
    }
}
