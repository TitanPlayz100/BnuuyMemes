import { writeFileSync } from 'fs';
import { config } from "dotenv";
config({ path: "../.env" });

const baseURL = "https://discord.com/api/v10" // Discord API url
const guildID = '673303546107658242'
const content = encodeURI("author original message") // search keywords
const LIMIT = 99; // number of messages recieved from search (ceil to nearest 25)

searchAndParse();

async function searchAndParse() {
    const messages = [];
    const urlsToRefresh = [];
    const parsed = [];

    // retrieve all bnuuys (from keyword search)
    // each search returns 25 at a time
    for (let i = 0; i < LIMIT; i += 25) {
        const results = await searchRequest(i);
        messages.push(...results);
    }
    
    messages.reverse();

    messages.forEach(message => {
        const content = message.content
        const links = message.embeds.map(parseEmbed)

        // parse message content
        const parts = content.split(/(?=Author: )/g);

        let linkIndex = 0; // track embed index
        const parsedParts = parts.map((part) => {
            const { author, original_message, contentsRaw } = splitMessagePart(part);
            const linkExtracted = extractURL(contentsRaw);

            if (!linkExtracted) {
                // link is not from discord cdn
                if (!contentsRaw.includes("youtu")) {
                    // link is not from youtube
                    return { author, original_message, link: null, type: "other" }
                }
            } else if (linkIndex >= links.length) {
                // more parts than embeds (as messages can only have max 5 embeds)
                // will refresh link later
                urlsToRefresh.push(linkExtracted[0]);
                return { author, original_message, link: linkExtracted[0], type: "other", status: "unrefreshed" };
            } else if (links[linkIndex].link.split("?")[0] != linkExtracted[0]) {
                // link not same as embed link
                // will refresh link later
                urlsToRefresh.push(linkExtracted[0]);
                return { author, original_message, link: linkExtracted[0], type: "other", status: "unrefreshed" };
            }

            const type = links[linkIndex].type;
            const link = links[linkIndex].link ?? null;
            linkIndex++; // saved valid embed, go to next embed
            return { author, original_message, link, type }
        });

        parsed.push(...parsedParts);
    })

    // batch refresh links to minimise api calls

    // split refreshed links into groups of 25 (endpoint limit)
    let refreshed = [];
    while (urlsToRefresh.length > 0) {
        const chunk = urlsToRefresh.splice(0, 25);
        const result = await refreshURL(chunk);
        refreshed.push(...result);
    }

    // put refreshed urls back into messages
    const parsedRefreshed = parsed.map(obj => {
        if (obj.status == "unrefreshed") {
            obj.link = refreshed[0];
            delete obj.status;
            refreshed.splice(0, 1);
        }
        return obj;
    })

    writeFileSync("./out2.json", JSON.stringify(parsedRefreshed))
}


async function searchRequest(offset) {
    const res = await fetch(`${baseURL}/guilds/${guildID}/messages/search?offset=${offset}&content=${content}`, {
        headers: {
            Authorization: process.env.DC_TOKEN
        }
    });
    const data = await res.json();
    return data.messages.map(m => m[0]);
}

function parseEmbed(embed) {
    const type = embed.type;
    if (type === "video") {
        // can get video format from embed.video.content_type
        return { link: embed.video.url, type };
    } else if (type === "image") {
        return { link: embed.thumbnail.url, type };
    } else {
        return { type: "other" }
    }
}

function splitMessagePart(part) {
    const [_, authorRest] = part.split("Author: ");
    const [author, messageRest] = authorRest.split(/Original Message: /i);
    const [original_message, contentsRaw] = messageRest.split(/Contents: /i);
    return { author, original_message, contentsRaw }
}

function extractURL(str) {
    return str.match(/https:\/\/cdn\.discordapp\.com\/attachments\/\d+\/\d+\/[\w\-_.]+\.[a-z0-9]+/i);
}

async function refreshURL(urls) {
    const res = await fetch(`${baseURL}/attachments/refresh-urls`, {
        method: "POST",
        headers: {
            Authorization: process.env.DC_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attachment_urls: urls })
    });

    const data = await res.json();
    return data.refreshed_urls.map(url => url.refreshed);
}