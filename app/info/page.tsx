import Markdown from "react-markdown";
import { promises as fs } from "fs";
import path from 'path';

export default async function InfoPage() {
  const filePath = path.join(process.cwd(), 'public', 'info.md');
  const md = await fs.readFile(filePath, 'utf8');

  return <div className="m-5 md:mx-65 text-text-second text-lg pb-20">
    <Markdown components={{
      h1: ({ node, ...props }) => <h1 className="text-text text-6xl font-bold pt-5" {...props} />,
      h2: ({ node, ...props }) => <h2 className="text-text text-4xl font-semibold py-2 pt-8" {...props} />,
      h3: ({ node, ...props }) => <h3 className="text-text text-2xl font-semibold py-2" {...props} />,
      h4: ({ node, ...props }) => <h4 className="text-text-second text-xl font-semibold pb-2" {...props} />,
      p: ({ node, ...props }) => <p className="leading-relaxed" {...props} />,
      li: ({ node, ...props }) => <li className="list-disc" {...props} />,
      a: ({ node, ...props }) => <a className="text-blue-400 underline" {...props} />,
    }}>{md}</Markdown>
  </div>
}
