import { readdirSync, readFileSync, writeFileSync } from "fs";
import mt from 'media-thumbnail'
const messages = JSON.parse(readFileSync("./missing.json", "utf-8"));


let total = 0;
messages.forEach(async (msg) => {
    const path = `./bnuuys/${msg.name}`
    const dest = `./thumbnails/${msg.name.split('.')[0]}.png`
    try {
        if (msg.type === 'video') {
            await mt.forVideo(path, dest, { width: 200, height: 200 })
            total++;
            console.log(`total: ${total}`)
        } else if (msg.type === 'image') {
            await mt.forVideo(path, dest, { width: 200, height: 200, preserveAspectRatio: true })
            total++;
            console.log(`total: ${total}`)
        }
    } catch (error) {
        console.log(`${error} | total: ${total}`);
    }
})

function getMissing() {
    const allMessages = JSON.parse(readFileSync("./data.json", "utf-8"));
    const downloaded = readdirSync("./thumbnails/");
    downloaded.forEach(filename => {
        const index = allMessages.findIndex(msg => msg.name.split(".")[0] === filename.split(".")[0]);
        if (index != -1) allMessages.splice(index, 1)
    })
    writeFileSync("./missing.json", JSON.stringify(allMessages), "utf-8")
}
