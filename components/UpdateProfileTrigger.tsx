'use client';

import {useEffect} from "react";

/** When first rendered, tells the server to update the authenticated
 *  user's profile info from bluesky's servers. */
export default function UpdateProfileTrigger() {
    useEffect(() => {
            fetch('/update-profile', {method: 'POST'})
                .then(() => console.log('Completed background action'))
                .catch((e: any) => console.error('Background action failed: ', e))
        },
        []);

    return null
}
