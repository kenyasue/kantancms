'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface User {
    id: string;
    username: string;
    avatar: string | null;
    createdAt: string;
    modifiedAt: string;
}

interface ProfileEditorProps {
    isAdmin?: boolean;
}

export default function ProfileEditor({ isAdmin = false }: ProfileEditorProps) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '', // Optional for updates
    });
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Fetch current user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth');
                const data = await response.json();

                if (!data.authenticated) {
                    router.push(isAdmin ? '/admin/login' : '/');
                    return;
                }

                setUser(data.user);
                setFormData({
                    username: data.user.username,
                    password: '', // Don't populate password
                });

                if (data.user.avatar) {
                    setAvatarPreview(data.user.avatar);
                }

                setIsLoading(false);
            } catch (err) {
                setError('Failed to load user data');
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [router, isAdmin]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Validate form
            if (!formData.username) {
                throw new Error('Username is required');
            }

            if (!user) {
                throw new Error('User not found');
            }

            // Create form data for submission
            const submitData = new FormData();
            submitData.append('username', formData.username);

            // Only include password if it was changed
            if (formData.password) {
                submitData.append('password', formData.password);
            }

            // Only include avatar if a new one was selected
            if (avatar) {
                submitData.append('avatar', avatar);
            }

            // Submit the form
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PUT',
                body: submitData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update profile');
            }

            // Update the user data
            const updatedUser = await response.json();
            setUser(updatedUser);

            // Show success message
            setSuccessMessage('Profile updated successfully');

            // Clear password field
            setFormData(prev => ({ ...prev, password: '' }));

            // Refresh the page to update the UI
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password (leave blank to keep current password)
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="New password (optional)"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
                        Avatar
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="avatar"
                        type="file"
                        name="avatar"
                        onChange={handleAvatarChange}
                        accept="image/*"
                    />

                    {avatarPreview && (
                        <div className="mt-2">
                            <Image
                                src={avatarPreview}
                                alt="Avatar preview"
                                width={80}
                                height={80}
                                className="rounded-full object-cover"
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
