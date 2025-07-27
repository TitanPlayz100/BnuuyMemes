import crypto from 'crypto'
import { getMedia } from '@/db/getMedia';
import Back from '@/app/components/bnuuy_page/backButton';
import Download from '../../components/bnuuy_page/download';
import VideoPlayer from '../../components/bnuuy_page/video';
import AudioPlayer from '../../components/bnuuy_page/audio';
import ImageViewer from '../../components/bnuuy_page/image';
import Random from '../../components/bnuuy_page/randButton';

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

    const message = getMedia(paramName)
    const mediaURL = await fetchURL(message.name);
    const type = message.type
    const metatags = message.meta ?? [];
    const tags = message.tags ?? undefined;

    function MediaViewer() {
        if (metatags.includes("not_downloaded")) {
            return <p>File not available to download</p>
        } else if (type == 'video') {
            return <VideoPlayer url={mediaURL} />
        } else if (type == 'audio') {
            return <AudioPlayer url={mediaURL} />
        } else if (type == 'image' || type == 'gif') {
            return <ImageViewer url={mediaURL} />
        } else {
            return <p>File avaiable for download</p>
        }
    }

    return (
        <div className='md:ml-25 md:mr-25 mt-5 pb-10 text-text text-xl'>
            <Back />
            <Random />
            <div className='flex w-full justify-center mt-5'>
                <div className='max-w-[75vw] max-h-[75vh] flex justify-center'>
                    <MediaViewer key={slug} />
                </div>
            </div>
            <div className='m-5 flex flex-col md:flex-row items-center justify-center gap-10 mt-10 mb-10'>
                <Download url={mediaURL} name={message.name} />
                <a target='_blank' href={message.original} className='text-white hover:text-gray-400 bg-blue hover:bg-hoverblue p-3 w-4/5 md:w-1/5 text-center rounded-2xl transition'>Original Message</a>
            </div>
            <div className='flex gap-10 justify-center flex-col md:flex-row items-center text-center'>
                <p className='w-60 truncate md:text-right'>{message.name}</p>
                <p className='w-60 truncate md:text-left opacity-70'>By: {message.author}</p>
            </div>
            {tags && (
                <div className='mx-5 md:mx-40 mt-10 flex flex-wrap gap-3 justify-center md:flex-row items-center text-center'>
                    <p>Tags: </p>
                    {tags.map((tag, index) => {
                        return <div key={index} className='bg-foreground-second text-text p-1 px-3 rounded-4xl'>{tag}</div>
                    })}
                </div>
            )}

        </div>
    )
}
