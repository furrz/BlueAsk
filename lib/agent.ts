'use server';
import {cookies} from "next/headers";
import {AtpAgent, AtpSessionData} from "@atproto/api";
import {JwtPayload, sign, verify} from "jsonwebtoken";
import {decodeFromBase64} from "next/dist/build/webpack/loaders/utils";

/** Creates a new At Protocol agent with automatic session cookie saving. */
export async function createUnvalidatedAgentInstance() {
    return new AtpAgent({
        service: 'https://bsky.social',
        persistSession: (_, data) => {
            try {
                if (!data) cookies().set('ask-session', '', {maxAge: 0, sameSite: "lax"});

                cookies().set('ask-session', sign({
                    aud: data!.did,
                    sessionData: data!,
                    exp: decodeFromBase64<{ exp: any }>(data?.accessJwt.split(".")[1]!)["exp"]
                }, process.env.JWT_SECRET!, {
                    algorithm: "HS256"
                }), {
                    sameSite: "lax"
                });
            } catch (e) {
                console.error('Error while saving session cookie: ', e);
            }
        }
    });
}

/** Validates session with Bluesky's servers.
 *  Returns null when not authorized. */
export async function getAgent() {
    try {
        const session = await getVerifiedSession();
        const agent = await createUnvalidatedAgentInstance();
        await agent.resumeSession(session);
        return agent;
    } catch (e) {
        return null;
    }
}

/** Validates a session directly on our servers, with no external request.
 *  Raises an exception when not authorized. */
export async function getVerifiedSession() {
    const session = cookies().get('ask-session');
    if (!session) throw new Error('Not Authorized');

    const decoded = verify(session.value, process.env.JWT_SECRET!, {
        algorithms: ["HS256"],
        audience: /did:(plc:[A-Za-z0-7]+)|(web:.+)/,
        complete: false,
    }) as JwtPayload;


    if (decoded.aud != decoded.sessionData.did)
        throw new Error('Audience Mismatch');

    return decoded.sessionData as AtpSessionData
}
