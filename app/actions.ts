'use server';

import {prisma} from "@/lib/prisma";
import {getAgent, getVerifiedSession} from "@/lib/agent";

export async function getAsks() {
    const session = await getVerifiedSession()
    return prisma.question.findMany({ where: { toDid: session.did }})
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
    if (!formData.has('response')) throw new Error('No response provided');
    if (!formData.has('question')) throw new Error('Question text missing');

    const question = formData.get('question')!.toString().trim();
    const response = formData.get('response')!.toString().trim();
    if (response.length < 1) throw new Error('Response is too short.');
    if (question.length + response.length + 1 > 300) throw new Error('Response is too long.');

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