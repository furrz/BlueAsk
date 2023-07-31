'use client';

import {
    experimental_useOptimistic as useOptimistic,
    useCallback,
    useEffect,
    useRef,
    useState,
    useTransition
} from 'react'
import {Question} from "@prisma/client";
import {answerAsk, deleteAsk, getAsks} from "@/app/actions";
import FlashErrorBoundary from "@/components/FlashErrorBoundary";

export default function AskList() {
    const [isPending, startTransition] = useTransition()
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        startTransition(async () => {
            const asks = await getAsks();
            setQuestions(asks);
        })
    }, []);

    if (isPending)
        return <p className="mx-5 text-gray-400">...Loading asks...</p>;

    if (questions.length === 0)
        return <p className="mx-5 text-gray-400">No asks yet! Share your link around, and check back later.</p>;

    return questions.map(ask => (<div key={ask.id}>
        <div className="bg-gray-800 px-5 py-3 rounded-t min-h-[3rem] mx-5">
            {ask.text}
            <form action={async (formData) => {
                setTimeout(() => {
                    setQuestions(questions.filter(i => i.id !== ask.id))
                }, 0);
                await deleteAsk(formData);
            }} className="float-right">
                <input type="hidden" name="id" value={ask.id}/>
                <label htmlFor={"discard-" + ask.id} className="ph-fill ph-trash cursor-pointer text-red-100"
                       title="Delete Post"></label>
                <input type="submit" id={"discard-" + ask.id} className="hidden" title="Delete Post"
                       value="Delete Post"/>
            </form>
        </div>

        <FlashErrorBoundary noRounded>
            <form action={async (formData) => {
                const res = await answerAsk(formData);
                if (res && res.error) throw new Error(res.error);
                setQuestions(questions.filter(i => i.id !== ask.id))
            }} method="post" className="flex mx-5">
                <input type="hidden" name="id" value={ask.id}/>
                <input type="hidden" name="question" value={ask.text}/>
                <input name="response" type="text" aria-label="Type your response here"
                       placeholder="Respond to this Ask" className="w-full bg-gray-900 rounded-bl p-2 px-5 h-12"/>
                <input type="submit" value="Post"
                       className="cursor-pointer py-2 px-5 bg-blue-950 h-12 rounded-br font-medium text-blue-400"/>
            </form>
        </FlashErrorBoundary>
    </div>));
}