import { Dispatch, SetStateAction } from "react";


export default function FileView({ file, setSelectedFile }: { file: { contentType: string, fileName: string }, setSelectedFile: Dispatch<SetStateAction<string>> }) {
    return (
        <div className="border border-white-50 p-2 m-4 hover:border-green-500" onClick={() => setSelectedFile(file.fileName)}>
            {file.fileName}
            <br />
            Type: {file.contentType.split("/")[0]}
        </div>
    )
}