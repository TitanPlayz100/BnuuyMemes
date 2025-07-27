"use client"

import { useState } from "react";

export default function Download({ url, name }: { url: string, name: string }) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    async function download() {
        try {
            setIsDownloading(true);
            setProgress(0);

            const res = await fetch(url);
            // if (!res.ok) throw new Error("Download failed");

            const total = Number(res.headers.get('Content-Length'));
            const reader = res.body?.getReader();
            const chunks: Uint8Array[] = [];
            let received = 0;


            while (true && reader) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) {
                    chunks.push(value);
                    received += value.length;
                    if (total) setProgress((received / total) * 100);
                }
            }

            const blob = new Blob(chunks);
            const blobUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = name;
            a.click();
            URL.revokeObjectURL(blobUrl);

            setIsDownloading(false);
            setProgress(0);
        } catch (error: any) {
            console.error('Download error:', error.message || error);
            alert('Failed to download file.');
        } finally {
            setIsDownloading(false);
            setProgress(0);
        }
    }

    return (
        <div className="flex flex-col justify-center w-4/5 md:w-1/5">
            <button onClick={download} disabled={isDownloading} className='bg-background-second p-3 w-full text-center rounded-2xl hover:bg-hoverbg transition disabled:bg-background-second'>Download</button>

            {isDownloading && (
                <div className="h-1 bg-background-second rounded-2xl mt-1 overflow-hidden">
                    <div className="h-full bg-foreground transition" style={{ width: `${progress}%` }} />
                </div>
            )}
        </div>
    )
}