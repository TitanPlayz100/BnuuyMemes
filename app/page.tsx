import PageNav from './components/main/pageNav';
import Card from './components/main/cards';
import Search from './components/main/search';
import { getPagenatedData } from '@/db/getPagenatedData';

export interface RootParams {
  page?: string;
  search?: string;
  tags?: string;
};

export default async function Home({ searchParams }: { searchParams: Promise<RootParams> }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const searchTerm = params?.search ?? '';
  const tags = params?.tags?.split(',') ?? [];

  const { curPage, pagedData, maxPage } = getPagenatedData(Number(page), searchTerm, tags);

  return (
    <>
      <Search params={params} />
      <div className='w-screen flex flex-col items-center mb-5'>
        <PageNav params={params} curPage={curPage} maxPage={maxPage} />
        <div className='flex flex-wrap md:w-4/5 border-3 border-text shadow-main justify-center bg-background-dark pt-5 pb-5 m-6'>
          {pagedData.map((msg, index) => {
            return <Card key={index} msg={msg} />
          })}
        </div>
      </div>
    </>
  )
}
