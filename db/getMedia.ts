import data from '@/public/data.json';
import { Data } from './getPagenatedData';

export function getMedia(name: string): Data {
    return data
        .find(msg => msg.name.split(".")[0] === name)
        ?? { name: "", type: "", original: "", author: "" };
}
