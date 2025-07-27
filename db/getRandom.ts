import data from '@/public/data.json';
import { Data } from './getPagenatedData';

export function getRandomMeme(): Data {
    const randomMeme = data[Math.floor(Math.random() * data.length)];
    return randomMeme;
}