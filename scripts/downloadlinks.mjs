import { readFileSync, createWriteStream } from 'fs';
import { Downloader } from 'nodejs-file-downloader'
import { YtDlp } from 'ytdlp-nodejs';
import readline from 'readline'

const ytdlp = new YtDlp();
const messages = JSON.parse(readFileSync("./out2.json", "utf-8"));
const total = messages.length;

// loop each parsed message
messages.forEach(message => download(message.link));

function download(url) {
    if (url == null) return;
    if (url.includes("youtube.com")) {
        downloadYT(url);
    } else {
        downloadNormal(url)
    }
}

async function downloadNormal(url) {
    try {
        // async normal downloader
        const downloader = new Downloader({ url, directory: "./bnuuys" });
        await downloader.download();
        printCount();
    } catch (error) {
        if (error.responseBody) {
            console.log(error.responseBody)
        }
    }
}

async function downloadYT(url) {
    try {
        // use ytdlp to download
        const title = await ytdlp.getTitleAsync(url);
        const fileStream = createWriteStream(`./bnuuys/${title.trim()}.mp4`);
        const stream = ytdlp.stream(url);
        stream.pipe(fileStream);
        printCount();
    } catch (error) {
        console.error('YT Error:', error);
    }
}

// updating counter in cli
let downloadCount = 0;
function printCount() {
    downloadCount++;
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${downloadCount}/${total}`);
}

