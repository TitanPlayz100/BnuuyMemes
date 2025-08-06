'use client'

import { addTagToMedia } from "@/db/tags/add_tag";
import { removeTagFromMedia } from "@/db/tags/delete_tag";
import { useState } from "react"

export function AddTag({ mediaId, signed_in }: { mediaId: number, signed_in: boolean }) {
    const [adding, setAdding] = useState(false);
    const [value, setValue] = useState('');
    const [undoValue, setUndoValue] = useState('');
    const [undo, showUndo] = useState(false);
    const [error, setError] = useState(false);

    if (!signed_in) return <></>;

    const add = async () => {
        setError(false)
        const data = await addTagToMedia(mediaId, value);
        if (data?.error) {
            setError(true);
            return;
        }
        showUndo(true);
        setUndoValue(value);
        setValue('');
        setAdding(false);
    }

    const undoTag = async () => {
        const data = await removeTagFromMedia(mediaId, undoValue);
        if (data?.error) return; // todo handle error better
        showUndo(false);
        setUndoValue('');
    }

    return (
        <>
            {adding ?
                <div className='bg-foreground-second text-text p-1 px-3 rounded-4xl'>
                    <input
                        type='text'
                        value={value}
                        placeholder='name...'
                        onInput={(e: any) => setValue(e.target.value)}
                        onKeyDown={e => { if (e.key == 'Enter') { add() } }}
                        autoFocus
                        onBlur={() => setAdding(value !== '')}
                        maxLength={13}
                        size={12}
                        className='p-0 outline-none'
                    />
                    <button onClick={() => add()} className='p-0 cursor-pointer'>+</button>
                </div>
                :
                <button onClick={() => setAdding(true)} className='bg-foreground-second hover:bg-hoverbg transition p-1 px-3 rounded-4xl cursor-pointer'>+</button>
            }
            {undo && (
                <button onClick={() => undoTag()} className='bg-red-800 text-red-300 p-1 px-3 rounded-4xl cursor-pointer'>Undo</button>
            )}
            {error && (
                <div className='bg-red-800 text-red-300 p-1 px-3 rounded-4xl cursor-pointer'>Error</div>
            )}
        </>
    )
}