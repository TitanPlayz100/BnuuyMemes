"use server"

import { getCount } from "@/db/media/getMediaCount";
import { getPaginatedData } from "@/db/media/getPagenatedData";
import { revalidateTag } from "next/cache";

export async function revalidateEverything() {
    revalidateTag('media');
    revalidateTag('tags');
    const { maxPage } = await getPaginatedData({});
    getCount();
    for (let i = 0; i < (maxPage ?? 0); i++) {
        getPaginatedData({ page: i.toString() });
    }
}