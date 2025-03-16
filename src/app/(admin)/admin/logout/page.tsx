'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
    const router = useRouter();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await fetch('/api/auth', {
                    method: 'DELETE',
                });

                // Redirect to login page
                router.push('/admin/login');
                router.refresh();
            } catch (error) {
                console.error('Logout error:', error);
                // Redirect to login page even if there's an error
                router.push('/admin/login');
            }
        };

        performLogout();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Logging out...</h2>
                <p className="text-gray-500">Please wait while we log you out.</p>
            </div>
        </div>
    );
}
