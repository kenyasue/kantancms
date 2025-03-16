import Link from 'next/link';
import { getDataSource, Post } from '@/lib/database';
import { headers } from 'next/headers';

interface PostWithChildren extends Post {
    children?: PostWithChildren[];
}

export default async function PostSidebar() {
    // Get current path for highlighting active post
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';

    // Fetch posts from the database
    let posts: PostWithChildren[] = [];
    let error = null;

    try {
        const dataSource = await getDataSource();
        const postRepository = dataSource.getRepository(Post);
        const data = await postRepository.find();

        // Organize posts into a tree structure
        const postsMap = new Map<string, PostWithChildren>();
        const rootPosts: PostWithChildren[] = [];

        // First pass: create a map of all posts
        data.forEach((post) => {
            postsMap.set(post.id, { ...post, children: [] });
        });

        // Second pass: build the tree structure
        data.forEach((post) => {
            const postWithChildren = postsMap.get(post.id)!;

            if (post.parentId && postsMap.has(post.parentId)) {
                // Add as child to parent
                const parent = postsMap.get(post.parentId)!;
                parent.children = parent.children || [];
                parent.children.push(postWithChildren);
            } else {
                // Add to root posts
                rootPosts.push(postWithChildren);
            }
        });

        posts = rootPosts;
    } catch (err) {
        console.error('Error fetching posts:', err);
        error = 'Failed to load posts';
    }

    // Recursive function to render post tree
    const renderPostTree = (posts: PostWithChildren[], level = 0) => {
        return posts.map((post) => (
            <div key={post.id} className="mb-1">
                <Link
                    href={`/posts/${post.id}`}
                    className={`block py-1 px-2 rounded text-sm hover:bg-gray-100 ${pathname === `/posts/${post.id}` ? 'bg-gray-100 font-medium' : ''
                        }`}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                    prefetch={false}
                >
                    {post.title}
                </Link>
                {post.children && post.children.length > 0 && (
                    <div className="ml-2">
                        {renderPostTree(post.children, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (posts.length === 0) {
        return <div className="p-4 text-gray-500">No posts found</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Posts</h3>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {renderPostTree(posts)}
            </div>
        </div>
    );
}
