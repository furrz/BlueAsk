'use client';

import React from "react";

/** This is a special type of form that raises exceptions when its server action receives {error:string} objects.
 *  This allows for the display of server-side error messages on client-side error boundaries.
 *  Intended for use with FlashErrorBoundary. */
export default function ExceptionalForm({children, className, action}: React.PropsWithChildren<{
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