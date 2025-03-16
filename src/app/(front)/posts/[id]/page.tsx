import Link from 'next/link';
import { Post } from '@/lib/database';

interface PostDetailProps {
  params: {
    id: string;
  };
}

export default async function PostDetail({ params }: PostDetailProps) {
  // In a real implementation, we would fetch the post from the database here
  // const post = await getPostById(params.id);
  
  // For now, we'll use a placeholder
  const post: Post | null = null as unknown as Post; // This is just for development, in production we would fetch the real post

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              KantanCMS
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Admin Panel
            </Link>
          </div>
        </header>
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
                <p className="text-gray-500 mb-4">The post you are looking for does not exist.</p>
                <Link href="/" className="text-indigo-600 hover:text-indigo-900">
                  Return to homepage
                </Link>
              </div>
            </div>
          </div>
        </main>
        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} KantanCMS. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            KantanCMS
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Admin Panel
          </Link>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Posted on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6 prose max-w-none">
                  {post.content}
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <Link href="/" className="text-indigo-600 hover:text-indigo-900">
                  ← Back to all posts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} KantanCMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
