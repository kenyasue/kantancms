'use client';

import { useState, useEffect } from 'react';
import Editor from '@/lib/components/EditorJS';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
    id: string;
    title: string;
    content: string;
    parentId: string | null;
    userId: string;
}

interface User {
    id: string;
    username: string;
}

interface EditPostProps {
    params: {
        id: string;
    };
}

export default function EditPost({ params }: EditPostProps) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<any>({});
    const [parentId, setParentId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string>('');
    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch post data and options for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch the post to edit
                const postResponse = await fetch(`/api/posts/${params.id}`);
                if (!postResponse.ok) {
                    throw new Error('Failed to fetch post');
                }
                const postData = await postResponse.json();

                // Set form values
                setTitle(postData.title);

                // Try to parse the content as JSON, or use it as a simple string if parsing fails
                try {
                    setContent(JSON.parse(postData.content));
                } catch (e) {
                    // If content is not valid JSON, create a simple paragraph block
                    setContent({
                        time: new Date().getTime(),
                        blocks: [
                            {
                                type: 'paragraph',
                                data: {
                                    text: postData.content
                                }
                            }
                        ]
                    });
                }
                setParentId(postData.parentId);
                setUserId(postData.userId);

                // Fetch all posts for parent selection (excluding the current post)
                const postsResponse = await fetch('/api/posts');
                const postsData = await postsResponse.json();
                setPosts(postsData.filter((post: Post) => post.id !== params.id));

                // Fetch users for author selection
                const usersResponse = await fetch('/api/users');
                const usersData = await usersResponse.json();
                setUsers(usersData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title || !content) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/posts/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content: JSON.stringify(content),
                    parentId: parentId || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update post');
            }

            router.push('/admin/posts');
            router.refresh();
        } catch (err) {
            console.error('Error updating post:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading post data...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Post</h1>
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

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Author
                    </label>
                    <div className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500">
                        {users.find(user => user.id === userId)?.username || 'Unknown'}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Author cannot be changed after creation</p>
                </div>

                <div className="flex justify-end space-x-3">
                    <Link
                        href="/admin/posts"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
