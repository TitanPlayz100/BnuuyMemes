"use server";

import { createClient } from "@/db/dbServer";
import { PostgrestError } from "@supabase/supabase-js";

export interface Message {
  author: string,
  original: string,
  type: string
  name: string,
  url: string,
  thumbnail?: string,
  date_created: string
}

const baseURL = "https://discord.com/api/v10"
const token: string = process.env.DC_TOKEN ?? "";

export async function getVideos(): Promise<Message[] | { error: PostgrestError }> {
  const res = await fetch(`${baseURL}/channels/917245246449016853/messages/pins`, { headers: { Authorization: token } });
  const data = await res.json();

  const parsed: Message[] = data.items.map((msg: any) => {
    let media = msg.message.attachments[0];
    if (msg.message.message_snapshots) {
      media = msg.message.message_snapshots[0].message.attachments[0];
    } else if (msg.message.attachments.length == 0 && msg.message.embeds.length != 0) {
      media = msg.message.embeds[0]
      media.content_type = media.type;
      media.filename = media.title;
    }

    return {
      author: msg.message.author.username,
      original: `https://discord.com/channels/673303546107658242/917245246449016853/${msg.message.id}`,
      type: media?.content_type.split('/')[0] ?? null,
      name: media?.filename ?? null,
      url: media?.url ?? null,
      date_created: msg.message.timestamp
    }
  })

  const supabase = await createClient();
  const { data: dbdata, error } = await supabase.from('media').select('name, original');
  if (error) return { error }
  const newParsed = parsed.filter(msg => !dbdata.some(db => db.original === msg.original))
  return newParsed;
}

export async function getMessage(messageId: string): Promise<any> {
  const res = await fetch(`${baseURL}/channels/917245246449016853/messages?around=${messageId}&limit=1`, { headers: { Authorization: token } });
  const data = await res.json();
  return {
    author: data[0].author.username,
    original: `https://discord.com/channels/673303546107658242/917245246449016853/${messageId}`,
    date_created: data[0].timestamp,
    type: null,
    name: null,
    url: null
  }
}

export async function insertData(msg: Message) {
  const supabase = await createClient();

  const newmsg = { name: msg.name, author: msg.author, original: msg.original, type: msg.type, date_created: msg.date_created }
  const { error } = await supabase.from("media").insert(newmsg);

  if (error) {
    console.log(`Error inserting data for ${msg.name}. ${error.message}`);
  }
}

export async function getUploadURL() {
  return process.env.UPLOADER_URL ?? ""
}