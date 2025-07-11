"use client"

export default function Download() {
    function download() {
        console.log("clicked download")
    }

    return (
        <button onClick={download} className='bg-background-second p-3 w-1/5 text-center rounded-2xl hover:bg-hoverbg transition'>Download (not implemented)</button>
    )
}