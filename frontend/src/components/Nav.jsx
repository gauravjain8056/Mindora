import { MessageSquare } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'

function Nav() {
  const { selectedConversation } = useSelector(state => state.conversation)
  const { messages } = useSelector(state => state.message)

  return (
    <>
      {selectedConversation && (
        <div className='h-14 flex items-center gap-3 px-5 border-b border-[#191A23]/15 bg-white shrink-0'>
          <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-[#B9FF66] border border-[#191A23] shadow-[1.5px_1.5px_0px_#191A23]'>
            <MessageSquare size={13} className="text-[#191A23]" />
          </div>
          <div className='text-[14px] font-bold font-display text-[#191A23] tracking-tight truncate'>
            {selectedConversation?.title || "New Chat"}
          </div>
          <div className='text-[11px] font-semibold text-[#191A23] bg-[#F3F3F3] border border-[#191A23]/20 px-2.5 py-0.5 rounded-md'>
            {messages?.length || 0} {messages?.length === 1 ? 'Message' : 'Messages'}
          </div>
        </div>
      )}
    </>
  )
}

export default Nav
