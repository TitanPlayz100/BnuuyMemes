'use client'

import { addTagToMedia } from "@/db/tags/add_tag";
import { removeTagFromMedia } from "@/db/tags/delete_tag";
import { useState } from "react"
import { profanity } from '@2toad/profanity';

export function AddTag({ mediaId, signed_in }: { mediaId: number, signed_in: boolean }) {
    const [adding, setAdding] = useState(false);
    const [value, setValue] = useState('');
    const [undoValue, setUndoValue] = useState('');
    const [undo, showUndo] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!signed_in) return <></>;

    const add = async () => {
        setError(null)
        if (!/^[a-zA-Z0-9._/-@!?()#$%^&+{}\[\]]*$/.test(value)) {
            setError('Invalid Character');
            return;
        }

        const isProfane = profanity.exists(value);
        if (isProfane) {
            setError('Unholy');
            return;
        }

        const data = await addTagToMedia(mediaId, value);
        if (data?.error) {
            setError('Error');
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
            
            {undo &&
                <button onClick={() => undoTag()} className='bg-red-800 text-red-300 p-1 px-3 rounded-4xl cursor-pointer'>Undo</button>}

            {error &&
                <div className='bg-red-800 text-red-300 p-1 px-3 rounded-4xl cursor-pointer'>{error}</div>}
        </>
    )
}