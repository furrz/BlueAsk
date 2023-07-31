import CopyText from "@/components/CopyText";
import Landing from "@/components/Landing";
import {getVerifiedSession} from "@/lib/agent";
import AskList from "@/components/AskList";
import "@/components/PhosphorScript";
import {AtpSessionData} from "@atproto/api";
import {logOut} from "@/lib/actions";
import UpdateProfileTrigger from "@/components/UpdateProfileTrigger";

export default async function MyAsks() {

    let session: AtpSessionData | null = null;
    try {
        session = await getVerifiedSession();
    } catch (e) {
        return <Landing/>;
    }

    return <>
        <h1 className="text-lg font-light mx-5 text-gray-400">
            <b className="font-bold text-gray-50">Share My Ask Page!</b>
            {" "}Tap to copy your link.
        </h1>
        <CopyText text={"https://ask.zyntaks.ca/ask/" + session.handle}/>
        <h1 className="text-lg font-bold mx-5 mt-5">My Asks</h1>
        <AskList/>
        <form>
            <button formAction={logOut} className="text-gray-400 mx-5 underline underline-offset-4">Log Out</button>
        </form>
        <UpdateProfileTrigger/>
    </>
}
