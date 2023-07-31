import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Not Found - BlueAsk."
};

export default function NotFound() {
    return <div className="p-5 bg-gray-900 rounded flex flex-col gap-3">
        <h1 className="text-4xl">Page Not Found</h1>
        <p className="text-lg">Not sure what you were looking for. This isn&apos;t it.</p>
    </div>
}
