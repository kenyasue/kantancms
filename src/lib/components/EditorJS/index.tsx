'use client';

import { useEffect, useRef, useState } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Link from '@editorjs/link';
import Marker from '@editorjs/marker';
import InlineCode from '@editorjs/inline-code';

interface EditorProps {
    data?: any;
    onChange: (data: any) => void;
    placeholder?: string;
    readOnly?: boolean;
}

export default function Editor({ data, onChange, placeholder, readOnly = false }: EditorProps) {
    const editorRef = useRef<any | null>(null);
    const holderRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    // Initialize editor
    useEffect(() => {
        if (!holderRef.current) return;

        // Clean up previous instance
        if (editorRef.current) {
            try {
                // Some versions of EditorJS might not have destroy method directly accessible
                if (typeof editorRef.current.destroy === 'function') {
                    editorRef.current.destroy();
                }
            } catch (e) {
                console.error('Error destroying editor:', e);
            }
            editorRef.current = null;
        }

        const editor = new EditorJS({
            holder: holderRef.current,
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Enter a header',
                        levels: [2, 3, 4],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                },
                code: Code,
                link: {
                    class: Link,
                    config: {
                        endpoint: '/api/fetchUrl', // Optional endpoint for url data fetching
                    }
                },
                marker: {
                    class: Marker,
                    shortcut: 'CMD+SHIFT+M',
                },
                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+C',
                },
            },
            data: data && typeof data === 'string' ?
                // Try to parse JSON string, or create a simple paragraph if it's plain text
                tryParseJSON(data) || createSimpleParagraph(data) :
                // Use the data object directly if it's already an object
                data || {},
            placeholder: placeholder || 'Start writing your content...',
            readOnly,
            onChange: async () => {
                const savedData = await editor.save();
                onChange(savedData);
            },
        });

        editorRef.current = editor;

        editor.isReady
            .then(() => {
                setIsReady(true);
            })
            .catch((error: Error) => {
                console.error('Editor.js initialization failed:', error);
            });

        return () => {
            // Clean up editor instance
            if (editorRef.current) {
                try {
                    // Some versions of EditorJS might not have destroy method directly accessible
                    if (typeof editorRef.current.destroy === 'function') {
                        editorRef.current.destroy();
                    }
                } catch (e) {
                    console.error('Error destroying editor:', e);
                }
                editorRef.current = null;
            }
        };
    }, [readOnly]); // Only re-initialize when readOnly changes

    // Helper function to try parsing JSON
    const tryParseJSON = (jsonString: string) => {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return null;
        }
    };

    // Helper function to create a simple paragraph block from plain text
    const createSimpleParagraph = (text: string) => {
        return {
            time: new Date().getTime(),
            blocks: [
                {
                    type: 'paragraph',
                    data: {
                        text
                    }
                }
            ]
        };
    };

    return (
        <div className="editor-js-container">
            <div
                ref={holderRef}
                className="min-h-[300px] border border-gray-300 rounded-md p-4 bg-white"
            />
            {!isReady && (
                <div className="text-gray-500 text-sm mt-2">
                    Loading editor...
                </div>
            )}
        </div>
    );
}
