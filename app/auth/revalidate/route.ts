import { revalidateTag } from "next/cache";

export async function GET() {
    revalidateTag('media');
    return new Response("ok");
}