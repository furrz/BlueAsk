'use client';

import React from "react";
import {sendMessage} from "@/app/actions";

export default function ExceptionalForm({ children, className, action }: React.PropsWithChildren<{
    className?: string,
    action: (formData: FormData) => Promise<{ error: string } | any>
}>) {
    async function actionInvoke(formData: FormData) {
        return await action(formData);
    }

    return <form action={async (formData) => await actionInvoke(formData).then((e: any) => {
        if (e && e.error) throw new Error(e.error)
    })} className={className}>
        {children}
    </form>
}