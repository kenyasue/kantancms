'use client';

import { useState, useEffect } from 'react';
import Editor from '@/lib/components/EditorJS';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
    id: string;
    title: string;
    parentId: string | null;
}

interface User {
    id: string;
    username: string;
}

export default function NewPost() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<any>({});
    const [parentId, setParentId] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch posts and current user
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch posts for parent selection
                const postsResponse = await fetch('/api/posts');
                const postsData = await postsResponse.json();
                setPosts(postsData);

                // Fetch current user
                const authResponse = await fetch('/api/auth');
                const authData = await authResponse.json();

                if (authData.authenticated) {
                    setCurrentUser(authData.user);
                } else {
                    setError('You must be logged in to create a post');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content) {
            setError('Please fill in all required fields');
            return;
        }

        if (!currentUser) {
            setError('You must be logged in to create a post');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content: JSON.stringify(content),
                    userId: currentUser.id,
                    parentId: parentId || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create post');
            }

            router.push('/admin/posts');
            router.refresh();
        } catch (err) {
            console.error('Error creating post:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Create New Post</h1>
                <Link
                    href="/admin/posts"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    Cancel
                </Link>
            </div>

            {error && (
                <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-4 py-2"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <Editor
                        data={content}
                        onChange={setContent}
                    />
                </div>

                <div>
                    <label htmlFor="parent" className="block text-sm font-medium text-gray-700">
                        Parent Post
                    </label>
                    <select
                        id="parent"
                        value={parentId || ''}
                        onChange={(e) => setParentId(e.target.value || null)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black px-4 py-2"
                    >
                        <option value="">None (Root Post)</option>
                        {posts.map((post) => (
                            <option key={post.id} value={post.id}>
                                {post.title}
                            </option>
                        ))}
                    </select>
                </div>

                {currentUser && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Author
                        </label>
                        <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500">
                            {currentUser.username}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Posts are created with your current user account</p>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
