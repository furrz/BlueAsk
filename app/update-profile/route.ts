import {updateProfile} from "@/lib/actions";
import {NextResponse} from "next/server";

export async function POST() {
    await updateProfile();
    return NextResponse.json({ok: true});
}