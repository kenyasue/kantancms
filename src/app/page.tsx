import Link from 'next/link';
import { Post } from '@/lib/database';

export default async function Home() {
  // In a real implementation, we would fetch posts from the database here
  const posts: Post[] = []; // Placeholder for posts data

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">KantanCMS</h1>
          <Link
            href="/admin"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Admin Panel
          </Link>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 min-h-96">
              <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
              
              {posts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <div className="mt-2 text-sm text-gray-500">
                          <p className="line-clamp-3">{post.content}</p>
                        </div>
                        <div className="mt-3">
                          <Link
                            href={`/posts/${post.id}`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                          >
                            Read more →
                          </Link>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm text-gray-500">
                          Posted on {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No posts found.</p>
                  <p className="text-gray-500">
                    Visit the{' '}
                    <Link href="/admin" className="text-indigo-600 hover:text-indigo-900">
                      admin panel
                    </Link>{' '}
                    to create your first post.
                  </p>
                </div>
              )}
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
