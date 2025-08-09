import { PutObjectCommand, S3Client, } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync } from "fs";
import dotenv from "dotenv"
dotenv.config({ path: "../.env" });

const { UPLOAD_URL, ACCESS_KEY, SECRET_ACCESS_KEY } = process.env
const BUCKET_NAME = 'thumbnails'
const S3 = new S3Client({
  region: "auto",
  endpoint: UPLOAD_URL,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

async function uploadAll() {
  const files = readdirSync('../public/thumbnails');
  for (const file of files) {
    const fileBuffer = readFileSync(`../public/thumbnails/${file}`);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: file,
      Body: fileBuffer,
      ContentType: 'image/PNG'
    });
    await S3.send(command);
  }
}

await uploadAll()
console.log("finished uploading.");