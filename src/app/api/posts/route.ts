import { NextRequest, NextResponse } from 'next/server';
import { getDataSource, Post } from '@/lib/database';

// GET /api/posts - Get all posts
export async function GET(request: NextRequest) {
    try {
        const dataSource = await getDataSource();
        const postRepository = dataSource.getRepository(Post);

        // Get query parameters
        const url = new URL(request.url);
        const parentId = url.searchParams.get('parentId');

        // Build query
        let query = postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.parent', 'parent')
            .orderBy('post.createdAt', 'DESC');

        // Filter by parentId if provided
        if (parentId) {
            if (parentId === 'null') {
                // Get root posts (no parent)
                query = query.where('post.parentId IS NULL');
            } else {
                // Get children of specific parent
                query = query.where('post.parentId = :parentId', { parentId });
            }
        }

        const posts = await query.getMany();

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        const { title, content, userId, parentId } = data;

        // Validate required fields
        if (!title || !content || !userId) {
            return NextResponse.json(
                { error: 'Title, content, and userId are required' },
                { status: 400 }
            );
        }

        const dataSource = await getDataSource();
        const postRepository = dataSource.getRepository(Post);

        // Create new post
        const newPost = postRepository.create({
            title,
            content,
            userId,
            parentId: parentId || null
        });

        await postRepository.save(newPost);

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}
