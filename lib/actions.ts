'use server';

import {prisma} from "@/lib/prisma";
import {createUnvalidatedAgentInstance, getAgent, getVerifiedSession} from "@/lib/agent";
import {Prisma} from ".prisma/client";
import {cookies} from "next/headers";
import SortOrder = Prisma.SortOrder;

/** Update the application's cached profile information for the authenticated user.
 *  This may be slow to invoke. The /update-profile endpoint can be requested in the
 *  background via the UpdateProfileTrigger in order to call this. */
export async function updateProfile() {
    const agent = await getAgent();
    if (!agent) throw new Error('Not authorized.');

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
}

/** Fetch asks sent to the authenticated user.
 *  Use `after` to find new asks (after a given ask ID.) */
export async function getAsks(after?: number) {
    const session = await getVerifiedSession()
    return prisma.question.findMany({
        where: {
            toDid: session.did,
            id: after !== undefined ? {gt: after} : undefined
        },
        orderBy: {
            id: SortOrder.desc
        }
    })
}

/** Delete an ask sent to the authenticated user. Requires `id` form field. */
export async function deleteAsk(formData: FormData) {
    if (!formData.has('id')) throw new Error('No ask selected for deletion');
    const session = await getVerifiedSession();

    await prisma.question.delete({
        where: {
            id: parseInt(formData.get('id') as string),
            toDid: session.did
        }
    })
}

/** Respond to an ask for the authenticated user, posting it to Bluesky.
 *  Requires `id`, `question`, and `response` form fields.
 *  Returns an {error:string} for feedback on input errors. */
export async function answerAsk(formData: FormData) {
    const agent = await getAgent();
    if (!agent) throw new Error('Not Authorized');
    if (!formData.has('id')) throw new Error('No ask selected for answering.');
    if (!formData.has('question')) throw new Error('Question text missing');
    if (!formData.has('response')) throw new Error('No response provided');

    const question = formData.get('question')!.toString().trim();
    const response = formData.get('response')!.toString().trim();
    if (response.length < 1) return {error: 'Response is too short.'};
    if (question.length + response.length + 1 > 300) return {error: 'Response is too long.'};

    await agent.com.atproto.repo.createRecord({
        collection: "app.bsky.feed.post",
        repo: agent.session!.did,
        record: {
            createdAt: new Date().toISOString(),
            langs: ["en"],
            text: question.toString() + "\n" + response.toString(),
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

    await prisma.question.delete({
        where: {
            id: parseInt(formData.get('id') as string),
            toDid: agent.session!.did
        }
    })
}

/** Submit a question to a user. Requires `did`, `message` form fields.
 *  Returns an {error:string} to provide feedback on input issues. */
export async function sendMessage(data: FormData) {
    if (typeof data.get("did") !== "string") throw new Error('No DID provided');
    if (typeof data.get("message") !== "string") throw new Error('No message provided');

    const message = (data.get("message") as string).trim();
    if (message.length < 1) return {error: "Your question is too short!"};
    if (message.length > 150) return {error: "Your question is too long!"};

    if (!await prisma.askUser.findUnique({where: {did: data.get("did") as string}}))
        throw new Error('Invalid DID');

    await prisma.question.create({
        data: {
            toDid: data.get("did") as string,
            text: message
        }
    });

    return {error: "GOOD:Your question has been sent!"}
}

/** Log into the service. Requires `username` and `password` form fields.
 *  Returns an {error:string} object to provide feedback on errors. */
export async function login(data: FormData) {
    if (!data.has('username') || !data.has('password'))
        throw new Error('Missing Username or Password');

    const agent = await createUnvalidatedAgentInstance();

    try {
        await agent.login({
            identifier: data.get('username')! as string,
            password: data.get('password')! as string
        })
    } catch (e) {
        return {error: "Incorrect username or password."}
    }
}

/** Log out of the service by clearing the session cookie. */
export async function logOut() {
    cookies().set('ask-session', '', {maxAge: 0, sameSite: "lax"});
}
