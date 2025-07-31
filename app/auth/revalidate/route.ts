import { revalidateTag } from "next/cache";

export async function GET() {
    revalidateTag('media');
    revalidateTag('tags');
    return new Response("ok");
}