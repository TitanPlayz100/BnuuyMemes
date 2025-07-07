import { writeFileSync } from 'fs';
import { config } from "dotenv";
config({ path: "../.env" });

const baseURL = "https://discord.com/api/v10"
const guildID = process.env.GUILD_ID
const content = encodeURI("author original message")
const LIMIT = 99; // number of messages recieved from search (ceil to nearest 25)

async function searchMessages() {
    const messages = [];

    // retrieve all bnuuys (from keyword search)
    for (let i = 0; i < LIMIT; i += 25) { // each search returns 25 at a time
        const res = await fetch(`${baseURL}/guilds/${guildID}/messages/search?offset=${i}&content=${content}`, {
            headers: {
                Authorization: process.env.DC_TOKEN
            }
        });
        const data = await res.json();
        const results = data.messages.map(m => m[0]);
        messages.push(...results);
    }

    writeFileSync("./out.json", JSON.stringify(messages))

    const urlsToRefresh = [];

    const parsed = [];
    messages.forEach(message => {
        const content = message.content

        // get all embed links
        const links = message.embeds.map(embed => {
            const type = embed.type;
            if (type === "video") {
                // can get video format from embed.video.content_type
                return { link: embed.video.url, type };
            } else if (type === "image") {
                return { link: embed.thumbnail.url, type };
            } else {
                return { type: "other" }
            }
        })

        // parse message content
        const parts = content.split(/(?=Author: )/g);

        let linkIndex = 0;
        const parsedParts = parts.map((part) => {
            const [_, authorRest] = part.split("Author: ");
            const [author, messageRest] = authorRest.split(/Original Message: /i);
            const [original_message, contentsRaw] = messageRest.split(/Contents: /i);

            const linkExtracted = contentsRaw.match(/https:\/\/cdn\.discordapp\.com\/attachments\/\d+\/\d+\/[\w\-_.]+\.[a-z0-9]+/i);
            if (!linkExtracted) {
                if (!contentsRaw.includes("youtu")) { // youtu.be/... or other variants
                    return { author, original_message, link: null, type: "other" }
                }
            } else if (linkIndex >= links.length) {
                urlsToRefresh.push(linkExtracted[0]);
                return { author, original_message, link: linkExtracted[0], type: "other", status: "unrefreshed" };
            } else if (links[linkIndex].link.split("?")[0] != linkExtracted[0]) {
                urlsToRefresh.push(linkExtracted[0]);
                return { author, original_message, link: linkExtracted[0], type: "other", status: "unrefreshed" };
            }

            const type = links[linkIndex].type;
            const link = links[linkIndex].link ?? null;
            linkIndex++;
            return { author, original_message, link, type }
        });

        parsed.push(...parsedParts);
    })

    // split refreshed links into groups of 25 (endpoint limit)
    let refreshed = [];

    while (urlsToRefresh.length > 0) {
        const chunk = urlsToRefresh.splice(0, 25);
        const result = await refreshURL(chunk);
        refreshed.push(...result);
    }

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

searchMessages();
