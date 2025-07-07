import { readFileSync, createWriteStream, readdirSync, writeFileSync } from 'fs';
import { Downloader } from 'nodejs-file-downloader'
import { YtDlp } from 'ytdlp-nodejs';
import readline from 'readline'

const ytdlp = new YtDlp();
const messages = JSON.parse(readFileSync("./out2.json", "utf-8"));
const total = messages.length;

let valid = 0;

async function download(url) {
    if (url == null) {
        printCount();
        return;
    }

    if (url.includes("youtube.com")) {
        await downloadYT(url);
        return;
    }

    const downloader = new Downloader({ url, directory: "./bnuuys" });

    try {
        await downloader.download();
        valid++;

        printCount();
    } catch (error) {
        if (error.responseBody) {
            console.log(error.responseBody)
        }
    }
}

async function downloadYT(url) {
    try {
        const title = await ytdlp.getTitleAsync(url);
        const fileStream = createWriteStream(`./bnuuys/${title.trim()}.mp4`);
        const stream = ytdlp.stream(url);
        stream.pipe(fileStream);
        valid++;

        printCount();
    } catch (error) {
        console.error('YT Error:', error);
    }
}

function printCount() {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${valid}/${total}`);
}

messages.forEach(message => download(message.link))

/*
function getFailed() {
    const messagesTotal = JSON.parse(readFileSync("./failed.json", "utf-8"));
    const downloaded = readdirSync("./bnuuys/");
    const totalfiles = messagesTotal.map(message => message.link);
    const failed = totalfiles.filter(link => !downloaded.some(file => link != null && link.includes(file)))
    writeFileSync("./failed.json", JSON.stringify(failed));
}
*/