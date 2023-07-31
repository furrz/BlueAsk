'use server';

import {prisma} from "@/lib/prisma";
import {getAgent, getVerifiedSession} from "@/lib/agent";
import {Prisma} from ".prisma/client";
import SortOrder = Prisma.SortOrder;

export async function getAsks(after?: number) {
    const session = await getVerifiedSession()
    return prisma.question.findMany({
        where: {
            toDid: session.did,
            id: after !== undefined ? { gt: after } : undefined
        },
        orderBy: {
            id: SortOrder.desc
        }
    })
}

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
