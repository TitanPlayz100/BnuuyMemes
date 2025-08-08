import crypto from 'crypto'
import { getMedia } from '@/db/media/getMedia';
import Back from '@/app/components/bnuuy_page/backButton';
import Download from '../../components/bnuuy_page/download';
import VideoPlayer from '../../components/bnuuy_page/video';
import AudioPlayer from '../../components/bnuuy_page/audio';
import ImageViewer from '../../components/bnuuy_page/image';
import Random from '../../components/randButton';
import ErrorBlock from '@/app/components/errorblock';
import { getMediaTags } from '@/db/tags/media_tags';
import { hasUserLikedMedia } from '@/db/likes/get_user_liked_media';
import { getCount } from '@/db/media/getMediaCount';
import Likes from '@/app/components/bnuuy_page/like';
import { createClient } from '@/db/dbServer';
import TagList from '@/app/components/bnuuy_page/tags';

const EXPIRY_SECONDS = 60;

function fetchURL(name: string) {
  const { SECRET_KEY, BASE_URL }: any = process.env;
  const expires = Math.floor(Date.now() / 1000) + EXPIRY_SECONDS
  const data = `${name}:${expires}`;
  const sig = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return `${BASE_URL}/${name}?expires=${expires}&sig=${sig}`
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const id = Number(slug);
  const supabase = await createClient();

  const [data, tag_data, userLiked, count, userData] = await Promise.all([
    getMedia(id),
    getMediaTags(id),
    hasUserLikedMedia(id),
    getCount(),
    supabase.auth.getUser()
  ])

  if ('error' in data) {
    return <div className='md:ml-25 md:mr-25 mt-5 pb-10 text-text text-xl'>
      <Back />
      <Random className="p-3 m-1 ml-5 w-30 rounded-2xl bg-background-second hover:bg-hoverbg transition" mediaCount={0} />
      <ErrorBlock error={data.error} />
    </div>
  }

  const mediaURL = fetchURL(data.name);
  const type = data.type
  const metatags = data.meta ?? [];
  const tags = 'error' in tag_data ? [] : tag_data.map(t => { return { tag: t.tags.tag, id: t.user_id } });
  const likes = data.like_count;
  const liked = typeof userLiked === 'boolean' ? userLiked : false;
  const mediaCount = 'error' in count ? 0 : count.total;

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
    <div className='md:ml-25 md:mr-25 mt-5 pb-10 text-text text-xl overflow-x-hidden'>
      <Back />
      <Random mediaCount={mediaCount} className="p-3 m-1 ml-5 w-30 rounded-2xl bg-background-second hover:bg-hoverbg transition" />
      <div className='flex w-full justify-center mt-5'>
        <div className='max-w-[75vw] max-h-[75vh] flex justify-center'>
          <MediaViewer key={slug} />
        </div>
      </div>
      <div className='m-5 flex flex-col md:flex-row items-center justify-center gap-10 mt-10 mb-10'>
        <Download url={mediaURL} name={data.name} />
        <a target='_blank' href={data.original} className='text-white hover:text-gray-400 bg-blue hover:bg-hoverblue p-3 w-4/5 md:w-1/5 text-center rounded-2xl transition'>Original Message</a>
      </div>
      <div className='flex gap-2 md:gap-10 justify-center flex-col md:flex-row items-center text-center'>
        <p className='w-100 md:text-right'>{data.name}</p>
        <p className='w-100 md:text-left opacity-70'>By: {data.author}</p>
      </div>
      <div className='w-full flex justify-center items-center gap-2 md:gap-10'>
        <Likes likes={likes} hasLiked={liked} id={id} signed_in={!userData.error} />
      </div>
      {tags && <TagList tags={tags} id={id} userid={userData.data?.user?.id} />}
    </div>
  )
}
