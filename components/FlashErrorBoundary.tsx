'use client';

import React, {Component} from 'react';

/** This specialized error boundary shows errors as "flash"-style message boxes
 *  for form validation purposes. If a raised exception's message starts with GOOD:,
 *  the box will be given a positive style to indicate success and GOOD: will be trimmed
 *  from the displayed output. */
class FlashErrorBoundary<Props extends {
    children: React.ReactNode,
    noRounded?: boolean
}> extends Component<Props> {
    state = {error: null} as { error: Error | null };

    constructor(props: Props) {
        super(props);
    }

    static getDerivedStateFromError(error: Error) {
        return {error};
    }

    render() {
        return <>
            {this.state.error &&
                <div
                    className={"px-5 py-3 text-center sm:mx-5 " + (this.props.noRounded ? "" : "sm:rounded ") + (this.state.error.message.startsWith("GOOD:") ? "bg-green-800" : "bg-red-800")}>
                    {this.state.error.message.startsWith("GOOD:") ? this.state.error.message.substring(5) : this.state.error.message}
                </div>}
            {this.props.children}
        </>;
    }
}

export default FlashErrorBoundary;