import {cookies} from "next/headers";
import {AtpAgent} from "@atproto/api";
import { kv } from "@vercel/kv";

export async function POST(request: Request) {
    const cookiesList = cookies();
    const form = await request.formData();
    const index = form.get('index');
    const value = form.get('value');
    const response = form.get('response');

    if (typeof index !== 'string' || typeof value !== 'string' || typeof response !== 'string') throw new Error('Invalid request');

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
    const rurl = new URL(request.url);


    if (await kv.lindex('asks-for:' + agent.session!.handle, parseInt(index)) !== value) return Response.redirect(rurl.protocol + "//" + rurl.host + "/");

    try {
        const res = await agent.com.atproto.repo.createRecord({
            collection: "app.bsky.feed.post",
            repo: agent.session!.did,
            record: {
                createdAt: new Date().toISOString(),
                langs: ["en"],
                text: value.toString() + "\n" + response.toString(),
                embed: {
                    $type: "app.bsky.embed.external",
                    external: {
                        title: "Ask " + agent.session?.handle + "!",
                        description: "Ask " + agent.session?.handle + " a question on BlueAsk!",
                        uri: "https://ask.zyntaks.ca/ask/" + agent.session?.handle
                    }
                }
            }
        });
        console.log("Res = ", res);
    } catch (e) {
        console.error(e);
    }

    await kv.lset('asks-for:' + agent.session!.handle, parseInt(index), '');

    return Response.redirect(rurl.protocol + "//" + rurl.host + "/");
}