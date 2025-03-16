import { NextRequest, NextResponse } from 'next/server';
import { getDataSource, Post } from '@/lib/database';

// GET /api/posts/[id] - Get a specific post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const dataSource = await getDataSource();
        const postRepository = dataSource.getRepository(Post);

        const post = await postRepository.findOne({
            where: { id },
            relations: ['user', 'parent']
        });

        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return NextResponse.json(
            { error: 'Failed to fetch post' },
            { status: 500 }
        );
    }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const data = await request.json();
        const { title, content, parentId } = data;

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const dataSource = await getDataSource();
        const postRepository = dataSource.getRepository(Post);

        // Check if post exists
        const post = await postRepository.findOneBy({ id });
        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Update post
        post.title = title;
        post.content = content;
        post.parentId = parentId || null;

        await postRepository.save(post);

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Failed to update post' },
            { status: 500 }
        );
    }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const dataSource = await getDataSource();
        const postRepository = dataSource.getRepository(Post);

        // Check if post exists
        const post = await postRepository.findOneBy({ id });
        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Delete post
        await postRepository.remove(post);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
