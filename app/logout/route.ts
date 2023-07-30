import {cookies} from "next/headers";

export async function GET(request: Request) {
    const cookiesList = cookies();
    cookiesList.set('ask-session', '', { maxAge: 0 });

    const rurl = new URL(request.url);
    return Response.redirect(rurl.protocol + "//" + rurl.host + "/");
}