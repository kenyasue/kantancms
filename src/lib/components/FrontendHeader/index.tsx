'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import UserMenu from '@/lib/components/UserMenu';
import ThemeToggle from '@/lib/components/ThemeToggle';

interface User {
    id: string;
    username: string;
    avatar: string | null;
}

export default function FrontendHeader() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth');
                const data = await response.json();

                if (data.authenticated) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">KantanCMS</h1>
                <div className="flex items-center space-x-4">
                    <ThemeToggle className="mr-2" />
                    {!isLoading && user ? (
                        <UserMenu user={user} isAdmin={false} />
                    ) : (
                        <Link
                            href="/admin"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Admin Panel
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
