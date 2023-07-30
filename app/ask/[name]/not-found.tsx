export default function NotFound() {
    return <>
        <div className="p-5 bg-gray-900 rounded flex flex-col gap-3">
            <h1 className="text-4xl">User Not Found</h1>
            <p className="text-lg">A user with that name isn&apos;t registered with BlueAsk yet.</p>
        </div>
    </>
}