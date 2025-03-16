import Link from 'next/link';
import { Post, getDataSource } from '@/lib/database';
import FrontendHeader from '@/lib/components/FrontendHeader';
import PostSidebar from '@/lib/components/PostSidebar';
import EditorJSRenderer from '@/lib/components/EditorJSRenderer';

interface PostDetailProps {
  params: {
    id: string;
  };
}

// Generate static params for all posts
export async function generateStaticParams() {
  const dataSource = await getDataSource();
  const postRepository = dataSource.getRepository(Post);
  const posts = await postRepository.find();

  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostDetail({ params }: PostDetailProps) {
  // Fetch the post from the database
  const dataSource = await getDataSource();
  const postRepository = dataSource.getRepository(Post);
  const post = await postRepository.findOne({
    where: { id: params.id },
    relations: ['user', 'parent']
  });

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <FrontendHeader />
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
      <FrontendHeader />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="md:w-1/4">
                <PostSidebar />
              </div>

              {/* Main content */}
              <div className="md:w-3/4">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Posted on {new Date(post.createdAt).toLocaleDateString()}
                      {post.user && ` by ${post.user.username}`}
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <EditorJSRenderer data={post.content} />
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
