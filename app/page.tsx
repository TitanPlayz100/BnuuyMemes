import PageNav from './components/main/pageNav';
import Card from './components/main/cards';
import Search from './components/main/search';
import { getPaginatedData } from '@/db/media/getPagenatedData';
import ErrorBlock from './components/errorblock';
import { listTags } from '@/db/tags/list_tags';
import { getCount } from '@/db/media/getMediaCount';

export interface RootParams {
  page?: string,
  search?: string,
  tags?: string,
  sort?: string,
  type?: string
};

export const sortList = ['id', 'like_count', 'name', 'author']
export const typeList = ['all', 'video', 'audio', 'image', 'text', 'other']

export default async function Home({ searchParams }: { searchParams: Promise<RootParams> }) {
  const params = await searchParams;
  const page = Number(params.page ?? 1) || 1;
  const searchTerm = params.search ?? '';
  const tags = params.tags?.split(',') ?? [];
  let sort = params.sort ?? 'id';
  if (!sortList.includes(sort)) sort = 'id';
  let type = params.type ?? 'all';
  if (!typeList.includes(type)) type = 'all';

  const [data, count, tagList] = await Promise.all([
    getPaginatedData(page, searchTerm, tags, sort, type),
    getCount(),
    listTags()
  ])

  const mediaCount: number = 'error' in count ? 0 : count.total;
  const tagData: string[] = 'error' in tagList ? [] : tagList.tags;

  if ('error' in data && data.error) {
    return <>
      <div className='w-screen flex flex-col items-center mb-5'>
        <ErrorBlock error={data.error} />
      </div>
    </>
  }

  return (
    <>
      <Search params={params} tagList={tagData} mediaCount={mediaCount} />
      <div className='w-screen flex flex-col items-center mb-5'>
        <PageNav params={params} curPage={data.curPage} maxPage={data.maxPage} />
        <div className='flex flex-wrap md:w-4/5 border-3 border-text shadow-main justify-center bg-background-dark pt-5 pb-5 m-6'>
          {data.pagedData.map((msg, index) => {
            return <Card key={index} msg={msg} />
          })}
        </div>
      </div>
    </>
  )
}
