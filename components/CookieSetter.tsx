'use client';
import {useEffect} from "react";

export default function CookieSetter({ cookie}: { cookie: string }) {
    useEffect(() => {
        document.cookie = cookie;
        console.log("Set Cookie");
    }, [cookie]);
    return null
}