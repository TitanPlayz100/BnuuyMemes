import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, createReadStream, writeFileSync } from "fs";
import dotenv from "dotenv"
dotenv.config({ path: "../.env" });

const { UPLOAD_URL, ACCESS_KEY, SECRET_ACCESS_KEY } = process.env
const BUCKET_NAME = 'bnuuys'
const S3 = new S3Client({
  region: "auto",
  endpoint: UPLOAD_URL,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

async function upload(name) {
  const stream = createReadStream(`./bnuuys/${name}`);
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: name,
    Body: stream
  });
  await S3.send(command);
  console.log(`Uploaded: ${name}`);
}

const failed = [];

async function compare() {
  const messages = JSON.parse(readFileSync("./data.json"));
  const res = await S3.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME }));
  const uploaded = res.Contents.map(obj => obj.Key);

  messages.forEach(async (msg) => {
    const name = msg.name;
    const tags = msg.tags ?? [];
    if (tags.includes("not_downloaded") || tags.includes("dead")) return;

    if (!uploaded.includes(name)) {
      try {
        await upload(name);
      } catch (error) {
        console.error(`Failed to upload ${name}:`, error.message);
        failed.push(name);
        writeFileSync("./failed.json", JSON.stringify(failed))
      }
    }
  });

}

compare();