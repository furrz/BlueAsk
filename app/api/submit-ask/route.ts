import { kv } from '@vercel/kv'
import {redirect} from "next/navigation";
import {RedirectType} from "next/dist/client/components/redirect";
import {cookies} from "next/headers";
import {AtpAgent} from "@atproto/api";

export async function POST(request: Request) {
    const data = await request.formData();
    const cookiesList = cookies();

    if (!data.has("name") || !data.has("message") || data.get("message")!.length > 500 || data.get("message")!.length < 1 || !await kv.hexists('ask_user_details', data.get("name")!.toString())) {
        cookiesList.set('flash', 'Oops! Something went wrong! Maybe your ask is too long?');
    } else {
        cookiesList.set('flash', 'Success! Your ask was posted!');
        cookiesList.set('flash-good', 'true');
        await kv.lpush('asks-for:' + data.get("name")!.toString(), data.get("message")!.toString());
    }

    const rurl = new URL(request.url);

    return Response.redirect(rurl.protocol + "//" + rurl.host + '/ask/' + data.get("name")!.toString())
}