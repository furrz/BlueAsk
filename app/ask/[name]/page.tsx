import {notFound} from "next/navigation";
import {Metadata} from "next";
import {prisma} from "@/lib/prisma";
import FlashErrorBoundary from "@/components/FlashErrorBoundary";
import {sendMessage} from "@/lib/actions";
import ExceptionalForm from "@/components/ExceptionalForm";

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

    return <>
        <div className="flex items-center sm:gap-5 gap-3 mx-5 justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={user.avatar} alt='' className="w-12 h-12 rounded-full"/>
            <h1 className="text-3xl text-center">Ask <b>{user.displayName}</b></h1>
        </div>
        <FlashErrorBoundary>
            <ExceptionalForm action={sendMessage} className="flex flex-col gap-5 mx-5">
                <input type="hidden" name="name" value={params.name}/>
                <input type="hidden" name="did" value={user.did}/>
                <textarea name="message" placeholder="Your Message" maxLength={500}
                          className="bg-gray-800 rounded px-5 py-3"></textarea>
                <input type="submit" value="Ask!" className="bg-blue-700 py-3 px-5 rounded cursor-pointer"/>
            </ExceptionalForm>
        </FlashErrorBoundary>
    </>
}
