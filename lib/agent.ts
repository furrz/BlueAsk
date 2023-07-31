'use server';
import {cookies} from "next/headers";
import {AtpAgent, AtpSessionData} from "@atproto/api";
import {JwtPayload, sign, verify} from "jsonwebtoken";
import {decodeFromBase64} from "next/dist/build/webpack/loaders/utils";

/// Validates a session directly on our servers, with no external request.
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

export async function createUnvalidatedAgentInstance() {
    return new AtpAgent({
        service: 'https://bsky.social',
        persistSession: (_, data) => {
            try {
                if (!data) cookies().set('ask-session', '', { maxAge: 0 });

                cookies().set('ask-session', sign({
                    aud: data!.did,
                    sessionData: data!,
                    exp: decodeFromBase64<{ exp: any }>(data?.accessJwt.split(".")[1]!)["exp"]
                }, process.env.JWT_SECRET!, {
                    algorithm: "HS256"
                }));
            } catch (e) {
                console.error('Error while saving session cookie: ', e, ' - if you are seeing this during page render, that is okay.');
            }
        }
    });
}

/// Validates and refreshes a session directly with the BlueSky server.
export async function getAgent() {
    const session = await getVerifiedSession();
    const agent = await createUnvalidatedAgentInstance();

    try {
        await agent.resumeSession(session);
    } catch (e) {
        return null;
    }

    return agent;
}