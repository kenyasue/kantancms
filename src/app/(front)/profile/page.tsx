'use client';

import ProfileEditor from '@/lib/components/ProfileEditor';
import Link from 'next/link';

export default function FrontendProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">KantanCMS</h1>
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Back to Home
                    </Link>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="max-w-2xl mx-auto">
                            <ProfileEditor isAdmin={false} />
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
