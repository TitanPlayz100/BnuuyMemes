import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import dotenv from "dotenv"
dotenv.config({ path: "../.env" });

const { SB_URL, SB_INSERT_KEY } = process.env;
const supabase = createClient(SB_URL, SB_INSERT_KEY);
const jsonData = JSON.parse(readFileSync('data_tagged.json', 'utf-8'));
const { error } = await supabase.from('media').insert(jsonData);

if (error) {
    console.error('Error inserting data:', error);
} else {
    console.log('Data successfully inserted');
}