'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    username: string;
    avatar: string | null;
}

interface UserMenuProps {
    user: User;
    isAdmin?: boolean;
}

export default function UserMenu({ user, isAdmin = false }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close the menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth', {
                method: 'DELETE',
            });
            router.push(isAdmin ? '/admin/login' : '/');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const profilePath = isAdmin ? `/admin/profile` : `/profile`;

    return (
        <div className="relative" ref={menuRef}>
            <button
                className="flex items-center focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                        <Image
                            src={user.avatar}
                            alt={user.username}
                            width={32}
                            height={32}
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-gray-500 text-sm font-medium">
                            {user.username.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                    {user.username}
                </span>
                <svg
                    className="ml-1 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu"
                    >
                        <Link
                            href={profilePath}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            Edit Profile
                        </Link>
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
