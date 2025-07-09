import { Dispatch, SetStateAction, useRef } from "react";

type props = { setFilename: Dispatch<SetStateAction<string>> }

export default function UploadButton({ setFilename }: props) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    async function upload(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files?.[0];
        if (selectedFile == null) return;
        setFilename(selectedFile.name);

        const res = await fetch('/api/upload');
        const { uploadUrl, uploadAuthToken } = await res.json();

        const uploadRes = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                Authorization: uploadAuthToken,
                'X-Bz-File-Name': encodeURIComponent(selectedFile.name),
                'Content-Type': selectedFile.type || 'b2/x-auto',
                'X-Bz-Content-Sha1': 'do_not_verify',
            },
            body: selectedFile,
        });

        await uploadRes.json();
    }

    return (
        <div>
            <button type="button" onClick={handleClick} className="bg-white text-black rounded px-4 py-2 m-4 ml-16 mt-8 border hover:bg-gray-100 transition duration-200 ease-in-out">
                Upload
            </button>
            <input ref={inputRef} type="file" onChange={upload} className="hidden" />
        </div>
    )
}

function UploadMultipleButton() {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    async function uploadFilesFromJson(event: React.ChangeEvent<HTMLInputElement>) {
        const jsonFile = event.target.files?.[0];
        if (!jsonFile) return;

        const content = await jsonFile.text();
        const messages: { name: string, file: string, link: string }[] = JSON.parse(content);


        messages.forEach(async ({ name, file, link }) => {
            const res = await fetch('/api/upload');
            const { uploadUrl, uploadAuthToken } = await res.json();

            const fileres = await fetch(link);
            const fileBlob = await fileres.blob();

            const video = new File([fileBlob], file, { type: fileBlob.type || 'b2/x-auto' });

            const uploadres = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    Authorization: uploadAuthToken,
                    'X-Bz-File-Name': encodeURIComponent(file),
                    'Content-Type': 'b2/x-auto',
                    'X-Bz-Content-Sha1': 'do_not_verify',
                },
                body: video,
            });

            const upload = await uploadres.json();
            console.log("upload complete", upload)
        })
    }

    return (
        <div>
            <button type="button" onClick={handleClick} className="bg-white text-black rounded px-4 py-2 m-2 ml-16 border hover:bg-gray-100 transition duration-200 ease-in-out">
                Upload Messages Json
            </button>
            <input ref={inputRef} type="file" onChange={uploadFilesFromJson} className="hidden" />
        </div>
    )
}