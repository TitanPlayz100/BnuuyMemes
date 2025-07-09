import { Dispatch, SetStateAction, useEffect, useState } from "react";
import FileView from "./files";

type props = { setFilename: Dispatch<SetStateAction<string>> }
export default function FileList({ setFilename }: props) {
    const [files, setFiles] = useState([]);

    async function fetchFiles() {
        const res = await fetch('/api/listfiles');
        const { files } = await res.json();
        setFiles(files);
    }

    useEffect(() => {
        fetchFiles()
    }, []);

    return (
        <div className="m-5 ml-10 flex flex-col justify-center">
            {files.map((file, index) => (
                <FileView key={index} file={file} setSelectedFile={setFilename}></FileView>
            ))}
        </div>
    )
}