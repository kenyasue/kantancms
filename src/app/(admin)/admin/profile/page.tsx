'use client';

import ProfileEditor from '@/lib/components/ProfileEditor';

export default function AdminProfilePage() {
    return (
        <div className="max-w-2xl mx-auto">
            <ProfileEditor isAdmin={true} />
        </div>
    );
}
