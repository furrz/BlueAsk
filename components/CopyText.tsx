'use client';

import {useRef} from "react";

export default function CopyText({ text }: { text: string }) {
    const ref = useRef<HTMLDivElement>(null);
    return <>
        <input type="text" readOnly value={text} className="bg-gray-900 p-5 sm:rounded text-center" onClick={() =>
        navigator.clipboard.writeText(text).then(() => {
            if (document.activeElement instanceof HTMLElement) document.activeElement?.blur();
            if (window.getSelection) {
                if (window.getSelection()?.empty) {
                    window.getSelection()?.empty();
                } else if (window.getSelection()?.removeAllRanges) {
                    window.getSelection()?.removeAllRanges();
                }
            }

            if (ref.current) ref.current.dataset["visible"] = "true";

            setTimeout(() => {
                if (ref.current) delete ref.current.dataset["visible"];
            }, 4000);
        }).catch(e => console.error(e))
    }/>
        <div className="fixed -bottom-40 left-0 right-0 w-screen flex justify-center transition-all data-[visible=true]:bottom-5" ref={ref}>
            <div className="bg-gray-800 px-5 py-3 rounded">URL Copied!</div>
        </div>
    </>

}