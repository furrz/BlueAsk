import {AtpAgent} from "@atproto/api";
import {cookies} from "next/headers";

export async function POST(request: Request) {
    const form = await request.formData();
    const cookiesList = cookies();

    const rurl = new URL(request.url);


    if (!form.has('username') || !form.has('password')) {
        cookiesList.set('flash', 'Must provide a username and password!');
        return Response.redirect(rurl.protocol + "//" + rurl.host + "/");
    }

    const agent = new AtpAgent({ service: 'https://bsky.social', persistSession: (_ev, data) => {
        cookiesList.set('ask-session', JSON.stringify(data));
    }});

    try {
        await agent.login({
            identifier: form.get('username')! as string,
            password: form.get('password')! as string
        })

    } catch (e) {
        cookiesList.set('flash', 'Wrong username or password.');
        return Response.redirect(rurl.protocol + "//" + rurl.host + "/");
    }

    return Response.redirect(rurl.protocol + "//" + rurl.host + "/");
}