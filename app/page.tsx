"use client"
import { useEffect, useRef, useState } from "react";
import FileView from "./components/files";

export default function Home() {
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    const res = await fetch('/api/listfiles');
    const { files } = await res.json();
    setFiles(files);
  }

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
    
    fetchFiles();
  }

  async function download(filename: string) {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    <>
      <div>
        <button type="button" onClick={handleClick} className="bg-white text-black rounded px-4 py-2 m-4 ml-16 mt-8 border hover:bg-gray-100 transition duration-200 ease-in-out">
          Upload
        </button>
        <input ref={inputRef} type="file" onChange={upload} className="hidden" />
      </div>

      <button onClick={() => download(filename)} className="bg-white text-black rounded px-4 py-2 m-2 ml-16 border hover:bg-gray-100 transition duration-200 ease-in-out">
        download
      </button>

      <div className="m-5 ml-10 flex flex-col justify-center">
        {files.map((file, index) => (
          <FileView key={index} file={file} setSelectedFile={setFilename}></FileView>
        ))}
      </div>

      <p className="ml-16">
        Selected file: {filename}
      </p>
    </>
  );
}
