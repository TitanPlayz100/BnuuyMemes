
export default function DownloadButton({ filename }: { filename: string }) {
    async function download(filename: string) {
        const res = await fetch('/api/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ filename }),
        });

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }

    return (
        <button onClick={() => download(filename)} className="bg-white text-black rounded px-4 py-2 m-2 ml-16 border hover:bg-gray-100 transition duration-200 ease-in-out">
            download
        </button>
    )
}