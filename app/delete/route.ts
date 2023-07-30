import {cookies} from "next/headers";
import {AtpAgent} from "@atproto/api";
import { kv } from "@vercel/kv";

export async function POST(request: Request) {
    const cookiesList = cookies();
    const form = await request.formData();
    const index = form.get('index');
    const value = form.get('value');

    if (typeof index !== 'string' || typeof value !== 'string') throw new Error('Invalid request');

    const agent = new AtpAgent({
        service: 'https://bsky.social', persistSession: (_ev, data) => {
            cookiesList.set('ask-session', JSON.stringify(data));
        }
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

    if (!sess) throw new Error('Not Authorized');

    await kv.lset('asks-for:' + agent.session!.handle, parseInt(index), '');

    const rurl = new URL(request.url);
    return Response.redirect(rurl.protocol + "//" + rurl.host + "/");
}