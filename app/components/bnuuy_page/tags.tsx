'use client'

import { removeTagFromMedia } from "@/db/tags/delete_tag";
import AddTag from "./addtag"

type tagsType = { tag: string, id: string }

const tagColours: Record<string, string> = {
  other_thread: "#41473d",
  unpinned: "#41473d",
  image: "#41473d",
  catbox: "#41473d",
  twitter: "#182578",
  bsky: "#182578",
  youtube: "#631313",
}

export default function TagList({ tags, id, userid }: { tags: tagsType[], id: number, userid: string | undefined }) {

  async function deleteTag(tag: string) {
    const data = await removeTagFromMedia(id, tag);
    if (data?.error) return; // todo handle error better
  }

  function Tag({ tag }: { tag: tagsType }) {
    const tagColour = tagColours[tag.tag] ?? "none"
    return (
      <div style={{backgroundColor: tagColour}} className='text-text p-1 px-3 rounded-4xl bg-foreground-second' >
        {tag.tag}
        {tag.id && userid == tag.id && (
          <button className="px-1 rounded-4xl cursor-pointer" onClick={() => deleteTag(tag.tag)}>-</button>
        )}
      </div>
    )
  }

  return (
    <div className='mx-5 md:mx-40 mt-10 flex flex-wrap gap-3 justify-center md:flex-row items-center text-center'>
      <p>Tags: </p>
      {tags.map((tag, index) => <Tag tag={tag} key={index} />)}
      <AddTag mediaId={id} signed_in={userid != undefined} />
    </div>
  )
}