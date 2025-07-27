export default function Loading() {
    return (
        <div className='md:ml-25 md:mr-25 mt-5 pb-10 text-text text-xl'>
            <button className="p-3 m-1 ml-5 w-30 rounded-2xl bg-background-second hover:bg-hoverbg transition">BACK</button>
            <button className="p-3 m-1 ml-5 w-30 rounded-2xl bg-background-second hover:bg-hoverbg transition">RANDOM</button>
            <div className='flex w-full justify-center mt-5'>
                <div className='w-[50vw] h-[50vh] flex justify-center items-center animate-pulse'>
                    <p>Loading Media...</p>
                </div>
            </div>
            <div className='m-5 flex flex-col md:flex-row items-center justify-center gap-10 mt-10 mb-10'>
                <div className="flex flex-col justify-center w-4/5 md:w-1/5">
                    <button className='bg-background-second p-3 w-full text-center rounded-2xl hover:bg-hoverbg transition disabled:bg-background-second'>Download</button>
                </div>
                <div className='text-white hover:text-gray-400 bg-blue hover:bg-hoverblue p-3 w-4/5 md:w-1/5 text-center rounded-2xl transition'>Original Message</div>
            </div>
            <div className='flex gap-10 justify-center flex-col md:flex-row items-center text-center animate-pulse'>
                <p className='w-60 truncate md:text-right'>Loading...</p>
                <p className='w-60 truncate md:text-left opacity-70'>Loading...</p>
            </div>
        </div>
    )
}