import Back from '@/app/bnuuys/[slug]/backButton';
import data from '@/public/data.json';
import Download from './download';
import VideoPlayer from './video';
import crypto from 'crypto'

const EXPIRY_SECONDS = 60;

async function fetchURL(name: string) {
    const { SECRET_KEY, BASE_URL }: any = process.env;
    const expires = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS
    const data = `${name}:${expires}`;
    const sig = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex')
    return `${BASE_URL}/${name}?expires=${expires}&sig=${sig}`
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const paramName = decodeURI(slug);

    const message = data.find(msg => msg.name.split(".")[0] === paramName) ?? { name: "", type: "", original: "", author: "" };
    const mediaURL = await fetchURL(message.name);
    const type = message.type

    return (
        <div className='ml-25 mr-25 mt-5 pb-10 text-text text-xl'>
            
            <Back />
            <div className='flex w-full justify-center mt-5'>
                {type == 'video'
                ? <VideoPlayer url={mediaURL} />
            : <p>Media is not video (other types coming soon)</p>
            }
            </div>
            <div className='m-5 flex justify-center gap-10 mt-10 mb-10'>
                <Download />
                <a target='_blank' href={message.original} className='text-white hover:text-gray-400 bg-blue hover:bg-hoverblue p-3 w-1/5 text-center rounded-2xl transition'>Original Message</a>
            </div>
            <div className='flex gap-10 justify-center'>
                <p className='w-60 truncate text-right'>{message.name}</p>
                <p className='w-60 truncate text-left opacity-70'>By: {message.author}</p>
            </div>
        </div>
    )
}
