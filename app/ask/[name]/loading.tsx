import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Ask Someone - BlueAsk."
};

export default function LoadingAskUser() {
    return (
        <>
            <div className="flex items-center sm:gap-5 gap-3 mx-5 justify-center">
                <div className="bg-gray-700 w-12 h-12 rounded-full"/>
                <h1 className="text-3xl text-center text-gray-700">Ask <b>...loading...</b></h1>
            </div>
            <div className="flex flex-col gap-5 mx-5">
                <textarea disabled className="bg-gray-700 rounded px-5 py-3 resize-none"></textarea>
                <input type="submit" value="" className="bg-gray-700 py-3 px-5 rounded"/>
            </div>
        </>
    )
}
