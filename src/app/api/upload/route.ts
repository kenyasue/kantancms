'use server';

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

// Ensure uploads directory exists
const ensureUploadsDir = () => {
    const uploadsDir = path.join(process.cwd(), 'public/uploads');
    if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
};

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Get file extension
        const fileExt = file.name.split('.').pop() || '';

        // Create a unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const filename = `${timestamp}-${randomId}.${fileExt}`;

        // Ensure uploads directory exists
        const uploadsDir = ensureUploadsDir();
        const filepath = path.join(uploadsDir, filename);

        // Convert file to buffer and save it
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await writeFile(filepath, buffer);

        // Return the URL to the uploaded file
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({
            success: 1,
            file: {
                url: fileUrl,
                // You can add more metadata if needed
                name: file.name,
                size: file.size,
                type: file.type
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
