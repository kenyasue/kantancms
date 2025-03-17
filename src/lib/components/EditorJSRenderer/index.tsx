'use client';

import React from 'react';

interface Block {
    id?: string;
    type: string;
    data: any;
}

interface EditorJSData {
    time?: number;
    blocks: Block[];
    version?: string;
}

interface EditorJSRendererProps {
    data: string | EditorJSData;
    className?: string;
}

const EditorJSRenderer: React.FC<EditorJSRendererProps> = ({ data, className = '' }) => {
    // Parse data if it's a string
    const parsedData = typeof data === 'string' ? tryParseJSON(data) : data as EditorJSData;

    // If parsing failed or no blocks, render the content as plain text
    if (!parsedData || !parsedData.blocks || !Array.isArray(parsedData.blocks)) {
        return <div className={`prose max-w-none text-black ${className}`}>{typeof data === 'string' ? data : 'No content'}</div>;
    }

    return (
        <div className={`editorjs-renderer prose max-w-none text-black ${className}`}>
            {parsedData.blocks.map((block, index) => renderBlock(block, index))}
        </div>
    );
};

// Helper function to try parsing JSON
const tryParseJSON = (jsonString: string): EditorJSData | null => {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('Failed to parse EditorJS data:', e);
        return null;
    }
};

// Render individual blocks based on their type
const renderBlock = (block: Block, index: number) => {
    const { type, data } = block;

    switch (type) {
        case 'header':
            return renderHeader(data, index);
        case 'paragraph':
            return renderParagraph(data, index);
        case 'list':
            return renderList(data, index);
        case 'quote':
            return renderQuote(data, index);
        case 'code':
            return renderCode(data, index);
        case 'image':
            return renderImage(data, index);
        default:
            return <p key={index} className="text-gray-500">Unsupported block type: {type}</p>;
    }
};

// Render header block
const renderHeader = (data: any, index: number) => {
    const { text, level } = data;

    switch (level) {
        case 1:
            return <h1 key={index} className="text-3xl font-bold mt-6 mb-4" dangerouslySetInnerHTML={{ __html: text }} />;
        case 2:
            return <h2 key={index} className="text-2xl font-bold mt-6 mb-3" dangerouslySetInnerHTML={{ __html: text }} />;
        case 3:
            return <h3 key={index} className="text-xl font-bold mt-5 mb-2" dangerouslySetInnerHTML={{ __html: text }} />;
        case 4:
            return <h4 key={index} className="text-lg font-bold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: text }} />;
        case 5:
            return <h5 key={index} className="text-base font-bold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: text }} />;
        case 6:
            return <h6 key={index} className="text-sm font-bold mt-4 mb-2" dangerouslySetInnerHTML={{ __html: text }} />;
        default:
            return <h3 key={index} className="text-xl font-bold mt-5 mb-2" dangerouslySetInnerHTML={{ __html: text }} />;
    }
};

// Render paragraph block
const renderParagraph = (data: any, index: number) => {
    return <p key={index} className="my-3 text-black" dangerouslySetInnerHTML={{ __html: data.text }} />;
};

// Render list block
const renderList = (data: any, index: number) => {
    const { style, items } = data;

    if (style === 'ordered') {
        return (
            <ol key={index} className="list-decimal pl-6 my-4">
                {items.map((item: string, i: number) => (
                    <li key={i} className="my-1 text-black" dangerouslySetInnerHTML={{ __html: item }} />
                ))}
            </ol>
        );
    } else {
        return (
            <ul key={index} className="list-disc pl-6 my-4">
                {items.map((item: string, i: number) => (
                    <li key={i} className="my-1 text-black" dangerouslySetInnerHTML={{ __html: item }} />
                ))}
            </ul>
        );
    }
};

// Render quote block
const renderQuote = (data: any, index: number) => {
    const { text, caption } = data;

    return (
        <blockquote key={index} className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-black">
            <p className="text-black" dangerouslySetInnerHTML={{ __html: text }} />
            {caption && <cite className="block text-sm text-gray-600 mt-2">— {caption}</cite>}
        </blockquote>
    );
};

// Render code block
const renderCode = (data: any, index: number) => {
    const { code } = data;

    return (
        <pre key={index} className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4">
            <code className="text-black">{code}</code>
        </pre>
    );
};

// Render image block
const renderImage = (data: any, index: number) => {
    const { file, caption } = data;

    if (!file || !file.url) {
        return <p key={index} className="text-gray-500">Image not available</p>;
    }

    return (
        <figure key={index} className="my-4">
            <img
                src={file.url}
                alt={caption || 'Image'}
                className="max-w-full h-auto rounded-md"
            />
            {caption && (
                <figcaption className="text-sm text-gray-600 mt-2 text-center">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};

export default EditorJSRenderer;
