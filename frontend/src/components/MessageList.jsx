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
            className='flex-1 overflow-y-auto px-6 py-6 space-y-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        >
            {isFetchingOlder && (
                <div className='flex justify-center py-2'>
                    <div className='w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin' />
                </div>
            )}

            {messages.length == 0 || !selectedConversation ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <div className='flex flex-col gap-1.5'>
                        <h1 className='text-[20px] font-semibold text-slate-200 tracking-tight'>Mindora AI</h1>
                        <p className='text-[15px] font-semibold text-slate-400 tracking-tight'>How can I help you?</p>
                        <p className='text-[13px] text-slate-600 max-w-[260px] leading-relaxed'>Ask me anything — code, ideas, explanations, or just a quick question.</p>
                    </div>
                    <div className='flex flex-wrap justify-center gap-2 mt-1'>
                        {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map((s) => (
                            <button key={s} className='text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3.5 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer'>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className='space-y-5'>
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
