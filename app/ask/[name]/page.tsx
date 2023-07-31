import {notFound} from "next/navigation";
import {Metadata} from "next";
import {prisma} from "@/lib/prisma";
import FlashErrorBoundary from "@/components/FlashErrorBoundary";

export async function generateMetadata(
    {params}: { params: { name: string } }): Promise<Metadata> {
    return {
        title: "Ask " + params.name + "!",
        description: "Ask " + params.name + " a question on BlueAsk!"
    }
}

export default async function AskUser({params}: { params: { name: string } }) {
    const user = await prisma.askUser.findUnique({
        where: {
            handle: params.name
        }
    })

    if (!user) throw notFound();

    async function sendMessage(data: FormData) {
        'use server';
        console.log(data);

        if (typeof data.get("message") !== "string") throw new Error("No message provided!");
        const message = (data.get("message") as string).trim();

        if (message.length < 1) throw new Error("Your question is too short!");
        if (message.length > 150) throw new Error("Your question is too long!");

        await prisma.question.create({
            data: {
                toDid: user!.did,
                text: message
            }
        });

        throw new Error("GOOD:Your question has been sent!")
    }

    return (
        <>
            <div className="flex items-center sm:gap-5 gap-3 mx-5 justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.avatar} alt='' className="w-12 h-12 rounded-full"/>
                <h1 className="text-3xl text-center">Ask <b>{user.displayName}</b></h1>
            </div>
            <FlashErrorBoundary>
                <form action={sendMessage} className="flex flex-col gap-5 mx-5">
                    <input type="hidden" name="name" value={params.name}/>
                    <textarea name="message" placeholder="Your Message" maxLength={500}
                              className="bg-gray-800 rounded px-5 py-3"></textarea>
                    <input type="submit" value="Ask!" className="bg-blue-700 py-3 px-5 rounded cursor-pointer"/>
                </form>
            </FlashErrorBoundary>
        </>
    )
}
