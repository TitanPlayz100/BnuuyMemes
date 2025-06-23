

export default function FileView({ file }: { file: { contentType: string, fileName: string } }) {
    return (
        <div className="border border-white-50 p-2 m-4">
            {file.fileName}
            <br />
            Type: {file.contentType.split("/")[0]}
        </div>
    )
}