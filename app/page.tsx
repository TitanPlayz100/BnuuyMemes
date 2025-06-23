"use client"
import { useEffect, useState } from "react";
import FileView from "./components/files";

export default function Home() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const res = await fetch('/api/getfiles');
      const data = await res.json();
      console.log('fetched', data)
      setFiles(data);
    };

    fetchFiles();
  }, []);

  function upload() {
    
  }

  function download() {

  }

  return (
    <>
      <button onClick={upload} className="bg-white text-black rounded px-4 py-2 m-2 border hover:bg-gray-100 transition duration-200 ease-in-out">
        Upload
      </button>
      <button onClick={download} className="bg-white text-black rounded px-4 py-2 m-2 border hover:bg-gray-100 transition duration-200 ease-in-out">
        download
      </button>
      <div className="m-5 flex flex-col justify-center">
        {files.map((file, index) => (
          <FileView key={index} file={file}></FileView>
        ))}
      </div>
    </>
  );
}
