import Back from '@/app/components/backButton';
import data from '@/public/data.json';
import Image from 'next/image';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const message = data.find(msg => msg.name.split(".")[0] === slug);
    const hastn = !(message?.tags?.includes("no_thumbnail") ?? false) && message?.type != "audio"
    const tn = hastn ? `/thumbnails/${slug}.png` : "/placeholder.png";

    return (
        <div className='m-10'>
            <Back/>
            <p className='text-text'>Name: {slug}</p>
            <Image src={tn} alt="thumbnail" width={200} height={200} />
        </div>
    )
}