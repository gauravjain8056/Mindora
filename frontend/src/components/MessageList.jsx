import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MessageBubble from './MessageBubble'
import LoadingAnimation from './LoadingAnimation'
import getMessages from '../features/getMessages'
import { prependMessages, setHasMore } from '../redux/messageSlice'

function MessageList() {
    const { selectedConversation } = useSelector(state => state.conversation)
    const { messages, isLoading, hasMore } = useSelector(state => state.message)
    const dispatch = useDispatch()
    const bottomRef = useRef(null)
    const scrollContainerRef = useRef(null)
    const [isFetchingOlder, setIsFetchingOlder] = useState(false)

    useEffect(() => {
        requestAnimationFrame(() => {
            bottomRef?.current?.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        })
    }, [messages?.length, isLoading])

    const loadOlderMessages = useCallback(async () => {
        if (!hasMore || isFetchingOlder || !selectedConversation) return
        const oldestId = messages[0]?._id
        if (!oldestId) return

        setIsFetchingOlder(true)
        const container = scrollContainerRef.current
        const prevScrollHeight = container?.scrollHeight ?? 0

        const result = await getMessages(selectedConversation._id, oldestId)
        dispatch(prependMessages(result.messages))
        dispatch(setHasMore(result.hasMore))

        requestAnimationFrame(() => {
            if (container) {
                container.scrollTop = container.scrollHeight - prevScrollHeight
            }
        })
        setIsFetchingOlder(false)
    }, [hasMore, isFetchingOlder, selectedConversation, messages, dispatch])

    const handleScroll = useCallback(() => {
        if (scrollContainerRef.current?.scrollTop === 0) {
            loadOlderMessages()
        }
    }, [loadOlderMessages])

    useEffect(() => {
        const container = scrollContainerRef.current
        if (!container) return
        container.addEventListener("scroll", handleScroll)
        return () => container.removeEventListener("scroll", handleScroll)
    }, [handleScroll])

    return (
        <div
            ref={scrollContainerRef}
            className='flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        >
            {isFetchingOlder && (
                <div className='flex justify-center py-2'>
                    <div className='w-5 h-5 rounded-full border-2 border-[#191A23] border-t-transparent animate-spin' />
                </div>
            )}

            {messages.length === 0 || !selectedConversation ? (
                <div className="h-full min-h-[320px] flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4">
                    <span className='font-display font-bold text-[11px] px-3 py-1 rounded-md bg-[#B9FF66] text-[#191A23] uppercase tracking-wider mb-4 border border-[#191A23] shadow-[1.5px_1.5px_0px_#191A23]'>
                        Mindora Workspace
                    </span>
                    <h1 className='font-display text-[28px] md:text-[34px] font-bold text-[#191A23] tracking-tight leading-snug'>
                        What would you like to build today?
                    </h1>
                    <p className='text-[14px] text-[#555770] max-w-[420px] leading-relaxed mt-2.5'>
                        Ask questions, write clean code, analyze documents, or brainstorm ideas with dedicated agents.
                    </p>
                    <div className='flex flex-wrap justify-center gap-2.5 mt-6'>
                        {[
                            "Build a modern SaaS landing page",
                            "Explain how Redis caching works",
                            "Generate a responsive dashboard in React",
                            "Review and optimize a SQL query"
                        ].map((prompt) => (
                            <button
                                key={prompt}
                                className='text-[12.5px] font-semibold text-[#191A23] bg-[#F3F3F3] border border-[#191A23] px-3.5 py-2 rounded-xl hover:bg-[#B9FF66] transition-all duration-150 cursor-pointer shadow-[2px_2px_0px_#191A23] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                                onClick={() => {
                                    const textarea = document.querySelector('textarea');
                                    if (textarea) {
                                        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
                                        nativeTextareaValueSetter.call(textarea, prompt);
                                        textarea.dispatchEvent(new Event('input', { bubbles: true }));
                                        textarea.focus();
                                    }
                                }}
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='max-w-4xl mx-auto space-y-6'>
                    {messages?.map((msg, i) => (
                        <div key={msg._id || i}>
                            <MessageBubble role={msg?.role} content={msg?.content} images={msg.images || []} />
                        </div>
                    ))}
                    {isLoading && <LoadingAnimation />}
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    )
}

export default MessageList
