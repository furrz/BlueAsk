import {updateProfile} from "@/lib/actions";
import {NextResponse} from "next/server";

export async function POST() {
    await updateProfile();
    return NextResponse.json({ok: true}, {
        status: 200,
        headers: {
            'Cache-Control': 'no-store, max-age=0'
        }
    });
}