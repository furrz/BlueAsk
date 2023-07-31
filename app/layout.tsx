import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import Link from "next/link";
import {Analytics} from '@vercel/analytics/react';
import {PropsWithChildren} from "react";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'BlueAsk - Anonymous Q&A for BlueSky.',
    description: 'Anonymous Q&A for BlueSky.',
}

export default function RootLayout({children}: PropsWithChildren) {
    return <html lang="en">
    <body className={inter.className + " bg-gray-950 text-gray-100"}>
    <nav className="flex justify-center my-5">
        <div className="max-w-xl flex-1 flex justify-between items-baseline">
            <Link className="text-xl font-light hover:underline underline-offset-8 ml-5" href="/">BlueAsk</Link>
            <div className="flex gap-2">
                <Link href="/"
                      className="text-blue-400 font-bold bg-gray-900 p-2 px-5 rounded hover:bg-blue-500 hover:text-black mr-5">
                    My Asks
                </Link>
            </div>
        </div>
    </nav>
    <div className="flex justify-center">
        <main className="max-w-xl flex-1 flex flex-col gap-5">
            {children}
            <p className="text-gray-400 mx-5 max-w-prose mb-5">
                Made by {" "}
                <a href="https://bsky.app/profile/zyntaks.ca"
                   className="font-medium hover:underline underline-offset-8">@zyntaks.ca</a>. {" "}
                <a href="https://github.com/furrz/BlueAsk">Open Source.</a>
            </p>
        </main>
    </div>
    <Analytics/>
    </body>
    </html>
}
