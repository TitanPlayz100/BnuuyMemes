"use client";

import { ChangeEvent, useState } from "react";
import { getUploadURL, getVideos, insertData, Message } from "./actions";

const AMOUNT = 10;

export default function AdminUpload() {
  const [pins, setPins] = useState<Message[]>([]);
  const [failedPins, setFailedPins] = useState<Message[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const getPins = async () => {
    const list = await getVideos();
    if ('error' in list) return;
    const pinlist = list.filter(m => m.name != null && m.url.startsWith("https://cdn.discordapp.com")).toReversed()
    setPins(pinlist);
    const pinlistFailed = list.filter(m => m.name == null || !m.url.startsWith("https://cdn.discordapp.com")).toReversed()
    setFailedPins(pinlistFailed);
  };

  const handleUpload = async () => {
    pins.filter(m => uploadProgress[m.name] == undefined).slice(0, AMOUNT).forEach(async msg => {
      try {
        const proxiedUrl = `/auth/media-proxy?url=${encodeURIComponent(msg.url)}`;
        const buffer = await (await fetch(proxiedUrl)).arrayBuffer();
        uploadVideo(msg, buffer)
      } catch (error) {
        console.log(error);
        setFailedPins([...failedPins, msg]);
        setPins(pins.filter(m => m.name != msg.name));
      }
    })
  };

  async function generateTN(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      const video = document.createElement('video');
      video.crossOrigin = "anonymous";
      video.src = url;

      video.addEventListener('loadeddata', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("No canvas context");

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 200, 200);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      });

      video.addEventListener('error', e => {
        URL.revokeObjectURL(url);
        reject(e);
      });
    });
  }

  async function uploadVideo(msg: Message, video: ArrayBuffer) {
    const thumbnailDataUrl = await generateTN(video);

    const thumbnailBlob = await fetch(thumbnailDataUrl).then(r => r.blob());
    const videoBlob = new Blob([video], { type: 'video/mp4' });

    const WORKER_URL = await getUploadURL()

    const formData = new FormData();
    formData.append('name', msg.name);
    formData.append('video', videoBlob, msg.name);
    formData.append('thumbnail', thumbnailBlob, `${msg.name.split('.')[0]}.png`);

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', WORKER_URL);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setUploadProgress((prev) => ({ ...prev, [msg.name]: percent }));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(null);
        else reject(new Error(xhr.statusText));
      };
      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(formData);
    })

    insertData(msg);
  }

  async function handleVideoUpload(event: ChangeEvent<HTMLInputElement>, msg: Message) {
    const file = event.target.files;
    if (!file) return;
    const buffer = await file[0].arrayBuffer();
    uploadVideo(msg, buffer)
  }

  return (
    <div className="p-4 mx-30 my-5">
      <button onClick={getPins} className="px-2 py-1 text-lg text-background-dark bg-text rounded hover:bg-white transition">
        Fetch Videos
      </button>

      <button onClick={handleUpload} className=" px-2 py-1 text-lg text-background-dark bg-text rounded hover:bg-white transition absolute right-40">
        Upload First {AMOUNT}
      </button>

      <div className="text-text flex flex-wrap gap-2 my-5">
        {pins.map((msg, i) => (
          <div key={i} className={"border-2 p-2 rounded-md w-60 flex flex-col " + ((i < AMOUNT) ? "border-green-500 " : "") + (((uploadProgress[msg.name] || 0) == 100) ? "bg-[#00ff0020]" : "")}>
            <p className="truncate">{msg.name}</p>
            <p className="italic text-text-second truncate">{msg.author}</p>
            <progress
              value={uploadProgress[msg.name] || 0}
              max={100}
              className="w-full h-1 bg-transparent hue-rotate-250"
            />
          </div>
        ))}
      </div>

      {/* Can't Automatially Upload */}
      {failedPins.length > 0 && <h1 className="text-text text-2xl">Inaccessible</h1>}

      <div className="text-text flex flex-wrap gap-2 my-5">
        {failedPins.map((msg, i) => (
          <div key={i} className={"border-2 p-2 rounded-md w-60 flex flex-col " + (((uploadProgress[msg.name] || 0) == 100) ? "bg-[#00ff0020]" : "")}>
            <p className="truncate">{msg.name}</p>
            <p className="italic text-text-second truncate">{msg.author}</p>
            <div className="flex flex-row justify-center">
              <a target='_blank' href={msg.original} className='m-1 px-2 py-1 text-lg text-background-dark bg-text rounded hover:bg-white w-fit '>Original</a>
              <label
                htmlFor="videoUpload"
                className="m-1 px-2 py-1 text-lg text-background-dark bg-text rounded hover:bg-white w-fit cursor-pointer"
              >
                Upload
                <input
                  id="videoUpload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleVideoUpload(e, msg)}
                />
              </label>
            </div>

            <progress
              value={uploadProgress[msg.name] || 0}
              max={100}
              className="w-full h-1 bg-transparent hue-rotate-250"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
