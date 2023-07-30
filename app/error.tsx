'use client';

export default function AskPageError({ error, reset }: { error: Error, reset: () => void }) {
    return (
        <div className="p-5 bg-gray-900 rounded flex flex-col gap-3">
            <h1 className="text-4xl">Error Loading Page</h1>
            <p className="text-lg">Something went wrong loading this page.</p>
        </div>
    )
}