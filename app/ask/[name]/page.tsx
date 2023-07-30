import { kv } from '@vercel/kv';
import {notFound} from "next/navigation";
import {cookies} from "next/headers";
import {NextResponse} from "next/server";
import CookieSetter from "@/app/CookieSetter";
import Head from "next/head";
import {Metadata, ResolvingMetadata} from "next";


export async function generateMetadata(
    { params }: { params: { name: string } }): Promise<Metadata> {
    return {
        title: "Ask " + params.name + "!",
        description: "Ask " + params.name + " a question on BlueAsk!"
    }
}
export default async function AskUser({ params }: { params: { name: string }}) {
    const cookiesList = cookies();
    const data = await kv.hget<{ displayName: string, avatar: string }>("ask_user_details", params.name);
    if (!data) throw notFound();

    let response = NextResponse.next();

    let flash = null;
    let flashGood = false;
    if (cookiesList.has('flash')) {
        flash = cookiesList.get('flash')!.value;
        if (cookiesList.has('flash-good')) {
            flashGood = true;
        }
    }

    return (
        <>
            <CookieSetter cookie="flash=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;"/>
            <CookieSetter cookie="flash-good=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"/>
            <div className="flex items-center sm:gap-5 gap-3 mx-5 justify-center">
                <img src={data.avatar} alt='' className="w-12 h-12 rounded-full"/>
                <h1 className="text-3xl text-center">Ask <b>{data.displayName}</b></h1>
            </div>
            {flash && <div className={"px-5 py-3 sm:rounded text-center " + (flashGood ? "bg-green-800" : "bg-red-800")}>{flash}</div>}
            <form action="/api/submit-ask" method="post" className="flex flex-col gap-5 mx-5">
                <input type="hidden" name="name" value={params.name}/>
                <textarea name="message" placeholder="Your Message" maxLength={500} className="bg-gray-800 rounded px-5 py-3"></textarea>
                <input type="submit" value="Ask!" className="bg-blue-700 py-3 px-5 rounded cursor-pointer"/>
            </form>
        </>
    )
}
