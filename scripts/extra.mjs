import { readFileSync, readdirSync, writeFileSync } from 'fs';

// ### Random scripts to finetune parsed data and maxisime valid bnuuys retrieved

// Compares file names from messages to already downloaded files and outputs which are missing
function getFailed() {
    const messagesTotal = JSON.parse(readFileSync("./out2.json", "utf-8"));
    const downloaded = readdirSync("./bnuuys/");
    const failed = messagesTotal.filter(msg => !downloaded.some(file => msg.link != null && msg.link.includes(file)));
    writeFileSync("./failed.json", JSON.stringify(failed));
}

// properly formats a public json file which will contain all metadata
// may consider moving this to a database maybe
function createPublicJson() {
    const allMessages = JSON.parse(readFileSync("./out2.json", "utf-8"));
    const parsed = allMessages.map(msg => {
        let author = msg.author.replace('＠', '').trim();
        let original = msg.original_message.trim();
        let name = msg.link;
        let type = msg.type;

        if (name != null && name.includes("cdn.discordapp.com")) {
            name = name.split('/')[6].split('?')[0]; // parse filename
            const [filename, ext] = name.split('.');
            // correctly set type based on extension
            if (ext == 'mp3' || ext == 'ogg' || ext == 'wav') type = "audio";
            if (ext == 'mp4' || ext == 'mov') type = "video";
            if (ext == 'png') type = "image";
        }

        return { author, original, type, name }
    })
    writeFileSync("./data.json", JSON.stringify(parsed), "utf-8")
}

// Find messages where the name is duplicate, save the duped ones in array
function checkDuplicates() {
    const allMessages = JSON.parse(readFileSync("./data.json", "utf-8"));
    const seen = [];
    const duplicates = [];
    allMessages.forEach(msg => {
        if (seen.includes(msg.name)) {
            duplicates.push(msg);
        } else {
            seen.push(msg.name);
        }
    })
    writeFileSync("./duplicates.json", JSON.stringify(duplicates), "utf-8")
}

// Compares files downloaded with message json to see which files are not downloaded
function getMissing() {
    const allMessages = JSON.parse(readFileSync("./data.json", "utf-8"));
    const downloaded = readdirSync("./bnuuys/");
    downloaded.forEach(filename => {
        const index = allMessages.findIndex(msg => msg.name === filename);
        if (index != -1) allMessages.splice(index, 1)
    })
    writeFileSync("./missing.json", JSON.stringify(allMessages), "utf-8")

}

// TAGS:
// type is automatic tag that every message has (probably ignore type "other")
// probably dont show "corrected" tag either (mostly internal)

// The message that started it: https://discord.com/channels/673303546107658242/890616176001048657/895124774085341184
