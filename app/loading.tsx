import styles from "./components/main/pagenav.module.css"

export default function Loading() {
  return (<>
    <div className="bg-background-second text-text p-5 pl-10 m-10 mb-5 flex flex-col md:flex-row gap-5 text-xl transition">
      {/* loading Search */}
      <div className='flex gap-5'>
        <input
          type='text'
          placeholder='Loading search'
          className='border border-foreground p-2 rounded-4xl min-w-1/3 outline-none pl-5 animate-pulse'
        />
        <img src='/icons/search.svg' className='w-9 scale-150 translate-y-2 cursor-pointer' />
      </div>
    </div>
    <div className='w-screen flex flex-col items-center mb-5'>
      {/* loading data */}
      <nav className="m-5 p-5 pl-10 pr-10 flex flex-wrap justify-center bg-background-second">
        <div className={styles.pageitem + ' animate-pulse'}>Loading pages...</div>
      </nav>
      <div className='flex flex-wrap md:w-4/5 border-3 border-text shadow-main justify-center bg-background-dark pt-5 pb-5 m-6'>
        <div className='m-1 md:m-3 bg-background-second hover:bg-hoverbg w-[150px] md:w-[200px] transition duration-350 hover:duration-50 p-2'>
          <h1 className='text-xl text-text-highlight m-2 truncate animate-pulse'>Fetching Memes...</h1>

        </div>
      </div>
    </div>
  </>)
}