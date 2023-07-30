import {cookies} from 'next/headers'
import {AtpAgent} from '@atproto/api';
import { kv } from "@vercel/kv";
import {NextResponse} from "next/server";
import CopyText from "@/app/CopyText";
import {Fragment} from "react";
import Script from "next/script";
import CookieSetter from "@/app/CookieSetter";
import {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "BlueAsk - Anonymous Q&A for BlueSky."
};

export default async function MyAsks() {
    let response = NextResponse.next();

    const cookiesList = cookies();
    const agent = new AtpAgent({
        service: 'https://bsky.social'
    });

    let sess = cookiesList.get('ask-session');

    if (sess) {
        try {
            await agent.resumeSession(JSON.parse(sess.value))
        } catch (e) {
            console.log(e)
            sess = undefined;
        }
    }


    if (!sess) {
        let flash = null;
        if (cookiesList.has('flash')) {
            flash = cookiesList.get('flash')!.value;
        }

        return (
            <>
                <CookieSetter cookie="flash=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;"/>
                <div className="bg-blue-800 px-5 flex flex-col gap-5 py-5 sm:rounded">
                    <h1 className="text-4xl leading-tight text-center font-light tracking-tighter">Anonymous Q&A for BlueSky!</h1>
                </div>

                <h1 className="text-2xl text-center mx-5 mt-5 mb-5">Log in with Bluesky to start receiving asks!</h1>

                {flash && <div className="py-3 px-5 sm:rounded bg-red-700">{flash}</div>}

                <form className="flex flex-col px-5 max-w-sm mx-auto gap-2" action="/login" method="post">
                    <input type="text" name="username" id="username" className="p-2 rounded bg-gray-800" aria-label="email or handle" placeholder="myname.bsky.social"/>
                    <input type="password" name="password" id="password" className="p-2 rounded bg-gray-800" aria-label="app password" placeholder="app password"/>
                    <input type="submit" className="px-5 py-2 bg-blue-600 font-medium rounded cursor-pointer hover:border-y-4  transition-all h-12 active:bg-blue-700 border-t border-t-blue-500 border-b border-b-blue-700 active:border-t-blue-800 active:border-b-blue-600" value="Log In with Bluesky"/>
                </form>
                <p className="text-gray-400 mx-5 max-w-prose mt-5">
                    <b className="font-medium">Privacy: </b>
                    BlueAsk will not store your password.
                    A cookie on your device is used to store your Bluesky authentication data.
                    Your account is only ever accessed when you log in (to verify it is you), load a page
                    (to keep you logged in), or choose to post a response to an ask.
                </p>
                <p className="text-gray-400 mx-5 max-w-prose">
                    Made by <a href="https://bsky.app/profile/zyntaks.ca" className="font-medium hover:underline underline-offset-8">@zyntaks.ca</a>. <a href="https://github.com/furrz/BlueAsk">Open Source.</a>
                </p>
            </>
        )
    }

    const profile = await agent.api.app.bsky.actor.getProfile({ actor: agent.session!.did });
    await kv.hset<string>('ask_user_details', {[agent.session!.handle]: JSON.stringify({ displayName: profile.data.displayName, avatar: profile.data.avatar })});

    const asks = await kv.lrange('asks-for:' + agent.session!.handle, 0, -1);

    const filteredAsks = asks.map((e, i) => ({ e, i })).filter(e => e.e);
    return (
        <>
            <Script src="https://unpkg.com/@phosphor-icons/web"/>
            <h1 className="text-lg font-light mx-5 text-gray-400"><b className="font-bold text-gray-50">Share My Ask Page!</b> Tap to copy your link.</h1>
            <CopyText text={"https://ask.zyntaks.ca/ask/" + agent.session?.handle}/>
            <h1 className="text-lg font-bold mx-5 mt-5">My Asks</h1>
            {filteredAsks.length===0 && <p className="mx-5 text-gray-400">No asks yet! Share your link around, and check back later.</p>}
            {filteredAsks.map(({ e, i }) => (<div key={i}>
                <div className="bg-gray-800 px-5 py-3 rounded-t min-h-[3rem] mx-5">
                    {e}
                    <form action="/delete" method="post" className="float-right">
                        <input type="hidden" name="index" value={i}/>
                        <input type="hidden" name="value" value={e}/>
                        <label htmlFor={"discard-" + i} className="ph-fill ph-trash cursor-pointer text-red-100" title="Delete Post"></label>
                        <input type="submit" id={"discard-" + i} className="hidden" title="Delete Post" value="Delete Post"/>
                    </form>
                </div>

                <form action="/answer" method="post" className="flex mx-5">
                    <input type="hidden" name="index" value={i}/>
                    <input type="hidden" name="value" value={e}/>
                    <input name="response" type="text" aria-label="Type your response here" placeholder="Respond to this Ask" className="w-full bg-gray-900 rounded-bl p-2 px-5 h-12"/>
                    <input type="submit" value="Post" className="cursor-pointer py-2 px-5 bg-blue-950 h-12 rounded-br font-medium text-blue-400"/>
                </form>
            </div>))}
            <Link href="/logout" className="text-gray-400 mx-5 underline underline-offset-4">Log Out</Link>
            <p className="text-gray-400 mx-5 max-w-prose">
                Made by <a href="https://bsky.app/profile/zyntaks.ca" className="font-medium hover:underline underline-offset-8">@zyntaks.ca</a>. <a href="https://github.com/furrz/BlueAsk">Open Source.</a>
            </p>
        </>
    )
}
