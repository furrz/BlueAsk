'use client';

import {useRef} from "react";

export default function CopyText({ text }: { text: string }) {
    const ref = useRef<HTMLDivElement>(null);
    return <>
        <input type="text" readOnly value={text} className="bg-gray-900 mx-5 p-5 rounded text-center" onClick={() =>
        navigator.clipboard.writeText(text).then(() => {
            if (document.activeElement instanceof HTMLElement) document.activeElement?.blur();
            if (window.getSelection) {
                if (window.getSelection()?.empty) {
                    window.getSelection()?.empty();
                } else if (window.getSelection()?.removeAllRanges) {
                    window.getSelection()?.removeAllRanges();
                }
            }
            ref.current?.classList.remove("-bottom-40");
            setTimeout(() => ref.current?.classList.add("-bottom-40"), 4000);
        }).catch(e => console.error(e))
    }/>
        <div className={"fixed bottom-5 -bottom-40 left-0 right-0 w-screen flex justify-center transition-all"} ref={ref}>
            <div className="bg-gray-800 px-5 py-3 rounded">URL Copied!</div>
        </div>
    </>

}