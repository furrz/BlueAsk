import CopyText from "@/components/CopyText";
import Landing from "@/components/Landing";
import {getAgent, getVerifiedSession} from "@/lib/agent";
import {prisma} from "@/lib/prisma";
import {cookies, draftMode} from "next/headers";
import AskList from "@/components/AskList";
import "@/components/PhosphorScript";
import {AtpSessionData} from "@atproto/api";

export default async function MyAsks() {
    async function logOut() {
        'use server';
        cookies().set('ask-session', '', {maxAge: 0});
    }

    let session: AtpSessionData | null = null;
    try {
        session = await getVerifiedSession();
    } catch (e) {
        console.error(e);
        return <Landing/>;
    }

    // Update some data in the background - no need to block on this.
    getAgent().then(async agent => {
        if (!agent) throw new Error('Session verified but agent could not be retrieved.');

        const profile = await agent.api.app.bsky.actor.getProfile({actor: agent.session!.did});
        prisma.askUser.upsert({
            create: {
                did: agent.session!.did,
                handle: agent.session!.handle,
                avatar: profile.data.avatar ?? "",
                displayName: profile.data.displayName ?? profile.data.handle
            },
            where: {
                did: agent.session!.did
            },
            update: {
                handle: agent.session!.handle,
                avatar: profile.data.avatar ?? "",
                displayName: profile.data.displayName ?? profile.data.handle
            }
        });
    });

    return (
        <>
            <h1 className="text-lg font-light mx-5 text-gray-400">
                <b className="font-bold text-gray-50">Share My Ask Page!</b>
                {" "}Tap to copy your link.
            </h1>
            <CopyText text={"https://ask.zyntaks.ca/ask/" + session.handle}/>
            <h1 className="text-lg font-bold mx-5 mt-5">My Asks</h1>
            <AskList/>
            <form>
                <button formAction={logOut} className="text-gray-400 mx-5 underline underline-offset-4">Log Out</button>
            </form>
        </>
    )
}
