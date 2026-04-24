"use client";

import { ChangeEvent, useState } from "react";
import { getMessage, getUploadURL, getVideos, insertData, Message } from "./actions";

const AMOUNT = 10;

export default function AdminUpload() {
  const [pins, setPins] = useState<Message[]>([]);
  const [failedPins, setFailedPins] = useState<Message[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [messageId, setMessageId] = useState("");

  const getPins = async () => {
    const list = await getVideos();
    if ('error' in list) return;
    const pinlist = list.filter(m => m.name != null && m.url.startsWith("https://cdn.discordapp.com")).toReversed()
    setPins(pinlist);
    console.log(pinlist);
    const pinlistFailed = list.filter(m => m.name == null || !m.url.startsWith("https://cdn.discordapp.com")).toReversed()
    setFailedPins(pinlistFailed);
  };

  const handleUpload = async () => {
    pins.filter(m => uploadProgress[m.name] == undefined).slice(0, AMOUNT).forEach(async msg => {
      try {
        const proxiedUrl = `/auth/media-proxy?url=${encodeURIComponent(msg.url)}`;
        const res = await fetch(proxiedUrl);

        const contentType = res.headers.get("Content-Type") || "";
        const buffer = await res.arrayBuffer();

        uploadMedia(msg, buffer, contentType);
      } catch (error) {
        console.log(error);
        setFailedPins([...failedPins, msg]);
        setPins(pins.filter(m => m.name != msg.name));
      }
    })
  };

  async function generateTN(buffer: ArrayBuffer, type: string): Promise<Blob | null> {
    if (type.startsWith('audio/')) return null;

    return new Promise((resolve, reject) => {
      const isVideo = type.startsWith('video/');
      const blob = new Blob([buffer], { type });
      const url = URL.createObjectURL(blob);

      const el = document.createElement(isVideo ? 'video' : 'img');
      const process = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("No canvas context");
        const sourceWidth = isVideo ? (el as HTMLVideoElement).videoWidth : (el as HTMLImageElement).width;
        const sourceHeight = isVideo ? (el as HTMLVideoElement).videoHeight : (el as HTMLImageElement).height;

        ctx.drawImage(el, 0, 0, sourceWidth, sourceHeight, 0, 0, 200, 200);

        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      };

      if (isVideo) {
        const video = el as HTMLVideoElement;
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;
        video.src = url;
        video.addEventListener('loadeddata', process);
      } else {
        const img = el as HTMLImageElement;
        img.src = url;
        img.onload = process;
      }

      el.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
    });
  }

  async function uploadMedia(msg: Message, buffer: ArrayBuffer, type: string) {
    const thumbnailBlob = await generateTN(buffer, type);
    const mediaBlob = new Blob([buffer], { type });
    const WORKER_URL = await getUploadURL();

    const formData = new FormData();
    formData.append('name', msg.name);
    formData.append('file', mediaBlob, msg.name); // Using generic 'file' key

    if (thumbnailBlob) {
      formData.append('thumbnail', thumbnailBlob, `${msg.name.split('.')[0]}_thumb.png`);
    }

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', WORKER_URL);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setUploadProgress((prev) => ({ ...prev, [msg.name]: percent }));
        }
      };
      xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve(null) : reject();
      xhr.onerror = () => reject();
      xhr.send(formData);
    });

    insertData(msg);
  }

  async function handleManualUpload(event: ChangeEvent<HTMLInputElement>, msg: Message) {
    const file = event.target.files?.[0];

    if (file) {
      msg.name = file.name;
      const buffer = await file.arrayBuffer();
      uploadMedia(msg, buffer, file.type);
    }
  }

  const changeMID = (word: string) => setMessageId(word);

  const fetchMessageInfo = async (MID: string) => {
    const info = await getMessage(MID);
    setFailedPins([...failedPins, info]);
  }

  return (
    <div className="p-4 mx-30 my-5">
      <div className="flex md:flex-row flex-col gap-5 justify-between w-full">
        <button onClick={getPins} className="px-2 py-1 text-lg text-background-dark bg-text rounded hover:bg-white transition">
          Fetch Videos
        </button>

        <button onClick={handleUpload} className=" px-2 py-1 text-lg text-background-dark bg-text rounded hover:bg-white transition">
          Upload First {AMOUNT}
        </button>
      </div>


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
                  accept="video/*,image/*,audio/*"
                  className="hidden"
                  onChange={(e) => handleManualUpload(e, msg)}
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

      <div className="text-text flex flex-wrap gap-2 my-5">
        <div className={"border-2 p-2 rounded-md w-60 flex flex-col gap-1"}>
          <p className="truncate">Add Bnuuy</p>
          <input
            type='text'
            value={messageId}
            placeholder='Message Id'
            onInput={(e: any) => changeMID(e.target.value)}
            onKeyDown={e => { if (e.key == 'Enter') { fetchMessageInfo(messageId) } }}
            className='border border-foreground p-1 outline-none m-2'
          />
        </div>
      </div>
    </div>
  );
}
