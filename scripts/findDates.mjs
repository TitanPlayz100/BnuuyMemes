import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "fs";
import dotenv from "dotenv"
dotenv.config({ path: "../.env" });

const { SB_URL, SB_INSERT_KEY } = process.env;
const supabase = createClient(SB_URL, SB_INSERT_KEY);

const baseURL = "https://discord.com/api/v9"
const channelId = '917245246449016853'
const otherChannelId = '890616176001048657'

async function fetchData() {
  const { error, data } = await supabase.from('media').select("*").order("id")

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    writeFileSync("./data_current.json", JSON.stringify(data, null, 2))
  }
}

async function getDateOfMessage(messageId, isOtherChannel) {
  const channel = !isOtherChannel ? channelId : otherChannelId
  const res = await fetch(`${baseURL}/channels/${channel}/messages?around=${messageId}&limit=1`, {
    headers: {
      Authorization: process.env.DC_TOKEN
    }
  });
  const data = await res.json();
  if ('message' in data || data[0] === undefined) {
    console.log(data)
    await new Promise(r => setTimeout(r, 1000));
    return await getDateOfMessage(messageId);
  }
  return data[0].timestamp;
}

async function getDates(DBdata) {
  const dates = [];

  for (let message of DBdata) {
    // console.log(message.id);
    const messageId = message.original.split('/')[6]
    const otherThread = message.meta?.includes("other") ?? false;
    const date = await getDateOfMessage(messageId, otherThread)
    dates.push({ id: message.id, date_created: date });
  }

  return dates;
}

/**
 * 
 * @param { {id: number, date_created:string} } dates 
 */
async function insertIntoSupabase(dates) {
  const { error } = await supabase
    .from('media')
    .upsert(dates, {
      onConflict: 'id',
      ignoreDuplicates: false
    })

  if (error) console.error(error)
}

const dates = JSON.parse(readFileSync("dates.json", 'utf-8'));
await insertIntoSupabase(dates)