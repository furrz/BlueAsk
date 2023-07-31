import {cookies} from "next/headers";
import FlashErrorBoundary from "@/components/FlashErrorBoundary";
import {AtpAgent} from "@atproto/api";
import {sign} from "jsonwebtoken";
import {decodeFromBase64} from "next/dist/build/webpack/loaders/utils";
import {createUnvalidatedAgentInstance} from "@/lib/agent";

export default function Landing() {

    async function login(data: FormData) {
        'use server';

        if (!data.has('username') || !data.has('password'))
            throw new Error('Must provide a username and password!');

        const agent = await createUnvalidatedAgentInstance();

        try {
            await agent.login({
                identifier: data.get('username')! as string,
                password: data.get('password')! as string
            })
        } catch (e) {
            throw new Error('Incorrect username or password.');
        }
    }

    return (
        <>
            <div className="bg-blue-800 px-5 flex flex-col gap-5 py-5 sm:rounded">
                <h1 className="text-4xl leading-tight text-center font-light tracking-tighter">Anonymous Q&A for BlueSky!</h1>
            </div>

            <h1 className="text-2xl text-center mx-5 mt-5 mb-5">Log in with Bluesky to start receiving asks!</h1>

            <FlashErrorBoundary>
                <form className="flex flex-col px-5 max-w-sm mx-auto gap-2" action={login}>
                    <input type="text" name="username" id="username" className="p-2 rounded bg-gray-800" aria-label="email or handle" placeholder="myname.bsky.social"/>
                    <input type="password" name="password" id="password" className="p-2 rounded bg-gray-800" aria-label="app password" placeholder="app password"/>
                    <input type="submit" className="px-5 py-2 bg-blue-600 font-medium rounded cursor-pointer hover:border-y-4 transition-all h-12 active:bg-blue-700 border-t border-t-blue-500 border-b border-b-blue-700 active:border-t-blue-800 active:border-b-blue-600" value="Log In with Bluesky"/>
                </form>
            </FlashErrorBoundary>
            <p className="text-gray-400 mx-5 max-w-prose mt-5">
                <b className="font-medium">Privacy: </b>
                BlueAsk will not store your password.
                A cookie on your device is used to store your Bluesky authentication data.
                Your account is only ever accessed when you log in (to verify it is you), load a page
                (to keep you logged in), or choose to post a response to an ask.
            </p>
        </>
    )
}