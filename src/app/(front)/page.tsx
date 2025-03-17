import Link from 'next/link';
import { Post, getDataSource } from '@/lib/database';
import FrontendHeader from '@/lib/components/FrontendHeader';
import PostSidebar from '@/lib/components/PostSidebar';
import EditorJSRenderer from '@/lib/components/EditorJSRenderer';

export default async function Home() {
  // Fetch posts from the database
  const dataSource = await getDataSource();
  const postRepository = dataSource.getRepository(Post);
  const posts = await postRepository.find({
    relations: ['user'],
    order: { createdAt: 'DESC' },
    take: 10 // Limit to 10 most recent posts
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <FrontendHeader />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="md:w-1/4">
                <PostSidebar />
              </div>

              {/* Main content */}
              <div className="md:w-3/4 border-4 border-dashed border-gray-200 rounded-lg p-4 min-h-96">
                <h2 className="text-2xl font-bold text-black mb-6">Latest Posts</h2>

                {posts.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                      <div key={post.id} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {post.title}
                          </h3>
                          <div className="mt-2 text-sm text-gray-500 line-clamp-3 overflow-hidden max-h-16">
                            {/* Try to extract a preview from the EditorJS content */}
                            {(() => {
                              try {
                                const content = JSON.parse(post.content);
                                if (content.blocks && content.blocks.length > 0) {
                                  // Get the first block's text content
                                  const firstBlock = content.blocks[0];
                                  if (firstBlock.type === 'paragraph' && firstBlock.data.text) {
                                    return firstBlock.data.text.substring(0, 150) + (firstBlock.data.text.length > 150 ? '...' : '');
                                  }
                                }
                              } catch (e) {
                                // If parsing fails, just show the first 150 characters
                              }
                              return post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');
                            })()}
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
