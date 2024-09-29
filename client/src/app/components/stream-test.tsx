'use client'

import { useState, useEffect } from 'react'

export default function StreamTest() {
    const [response, setResponse] = useState('')

    useEffect(() => {
        const fetchStream = async () => {
            const payload = {
                data: {
                    sourceId: {
                        label: "Source ID",
                        value: "268930"
                    },
                    primaryMaker: {
                        label: "Primary Maker",
                        value: "Bull, Ron"
                    },
                    primaryMedia: {
                        value: "src: https://digitalarchive.tpl.ca/internal/media/dispatcher/1972200/full"
                    },
                    displayDate: {
                        label: "Date",
                        value: "11/26/1973"
                    },
                    id: {
                        label: "Id",
                        value: "4416914"
                    },
                    title: {
                        label: "Title",
                        value: "10 years after he walked off a public stage for the last time Glenn Gould remains very much a private man"
                    }
                }
            };

            const res = await fetch('/api/stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;
                setResponse(prev => prev + decoder.decode(value));
            }
        };

        fetchStream().catch(console.error);
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Streaming Response</h1>
            <pre className="bg-gray-100 p-4 rounded">{response}</pre>
        </div>
    )
}
