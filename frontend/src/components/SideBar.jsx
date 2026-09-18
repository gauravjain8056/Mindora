import React from 'react'
import { Coins, LogOut, Menu, MessageSquare, PanelLeftIcon, PanelRight, PenSquare, Plus, User, X } from "lucide-react"
import { useState } from 'react'
import { useEffect } from 'react'
import { getConversations } from '../features/getConversations'
import { useDispatch, useSelector } from 'react-redux'
import { addConversation, setConversations, setSelectedConversation } from '../redux/conversationSlice'
import { createConversation } from '../features/createConversation'
import logOut from '../features/logOut'
import { setUserdata } from '../redux/userSlice'
import BillingDrawer from './BillingDrawer'

function SideBar() {
    const [collapsed, setCollapsed] = useState(false)
    const dispatch = useDispatch()
    const [imageError, setImageError] = useState(false)
    const { conversations, selectedConversation } = useSelector(state => state.conversation)
    const { userData } = useSelector(state => state.user)
    const [showBilling, setShowBilling] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const getConv = async () => {
            const data = await getConversations()
            dispatch(setConversations(data))
        }
        getConv()
    }, [userData?._id])

    const handleCreateConversation = async () => {
        const data = await createConversation()
        dispatch(addConversation(data))
    }

    if (collapsed) {
        return (
            <div className='hidden lg:flex flex-col items-center w-[60px] h-screen bg-[#F3F3F3] border-r border-[#191A23]/15 py-4 gap-2 shrink-0'>
                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-[#191A23] hover:bg-white hover:border border-[#191A23]/20 transition-all duration-150 bg-transparent border-transparent cursor-pointer'
                    onClick={() => setCollapsed(false)}
                    title="Expand sidebar"
                >
                    <PanelRight size={18} />
                </button>

                <button
                    className='flex items-center justify-center w-9 h-9 rounded-xl text-white bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] border border-[#191A23] transition-all duration-150 cursor-pointer shadow-[2px_2px_0px_#191A23]'
                    onClick={() => dispatch(setSelectedConversation(null))}
                    title="New Chat"
                >
                    <Plus size={18} strokeWidth={2.5} />
                </button>

                <div className='flex-1 overflow-y-auto px-1.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-4 space-y-1.5'>
                    {conversations.map((conv) => {
                        const isActive = selectedConversation?._id === conv?._id
                        return (
                            <div
                                key={conv?._id}
                                onClick={() => dispatch(setSelectedConversation(conv))}
                                title={conv?.title || "Chat"}
                                className={`flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer transition-all duration-150 border ${
                                    isActive
                                        ? "bg-[#B9FF66] border-[#191A23] text-[#191A23] shadow-[2px_2px_0px_#191A23]"
                                        : "bg-transparent border-transparent text-[#191A23]/70 hover:bg-white hover:text-[#191A23]"
                                }`}
                            >
                                <MessageSquare size={14} />
                            </div>
                        )
                    })}
                </div>

                <div className='relative shrink-0 pt-2'>
                    {userData?.avatar && !imageError ? (
                        <img
                            className='w-9 h-9 rounded-xl object-cover border-2 border-[#191A23]'
                            src={userData?.avatar}
                            alt="avatar"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className='w-9 h-9 rounded-xl bg-white border border-[#191A23]/30 flex items-center justify-center text-[#191A23]'>
                            <User size={16} />
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <>
            <button
                className='lg:hidden fixed top-3.5 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] shadow-[2px_2px_0px_#191A23] cursor-pointer'
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={16} />
            </button>

            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className='lg:hidden fixed inset-0 z-40 bg-[#191A23]/40'
                />
            )}

            <div
                className={`fixed lg:static inset-y-0 left-0 z-50
                w-[280px] h-screen shrink-0
                bg-[#F3F3F3] border-r border-[#191A23]/15
                transition-transform duration-200
                ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className='flex flex-col h-full'>
                    {/* Header */}
                    <div className='flex items-center gap-2.5 px-4 py-4 border-b border-[#191A23]/15 bg-white/50'>
                        <button
                            className='hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-[#191A23] hover:bg-black/5 transition-colors duration-150 cursor-pointer border-none bg-transparent'
                            onClick={() => setCollapsed(true)}
                            title="Collapse sidebar"
                        >
                            <PanelLeftIcon size={16} />
                        </button>

                        <button
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg text-[#191A23] hover:bg-black/5 transition-colors duration-150 cursor-pointer border-none bg-transparent"
                        >
                            <X size={16} />
                        </button>

                        <div className='flex items-center gap-2 flex-1 min-w-0'>
                            <span className='font-display text-[17px] font-bold text-[#191A23] tracking-tight'>
                                Mindora
                            </span>
                            <span className='text-[10px] font-bold text-[#191A23] bg-[#B9FF66] border border-[#191A23] px-2 py-0.5 rounded-md uppercase tracking-wider'>
                                {userData?.plan || "free"}
                            </span>
                        </div>

                        <button
                            className='flex items-center justify-center w-7 h-7 rounded-lg text-[#191A23] hover:bg-black/5 transition-colors duration-150 cursor-pointer border-none bg-transparent'
                            onClick={() => dispatch(setSelectedConversation(null))}
                            title="New Chat"
                        >
                            <PenSquare size={15} />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <div className='px-4 pt-4 pb-2'>
                        <button
                            className='w-full flex items-center justify-center gap-2 text-sm font-bold font-display text-white bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] rounded-xl py-2.5 transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_#191A23] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#191A23]'
                            onClick={() => dispatch(setSelectedConversation(null))}
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            New Chat
                        </button>
                    </div>

                    {/* Section title */}
                    <div className='px-5 pt-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#767676]'>
                        {conversations.length === 0 ? "No Conversations" : "Recent Chats"}
                    </div>

                    {/* Conversation List */}
                    <div className='flex-1 overflow-y-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-1'>
                        {conversations?.map((conv) => {
                            const isActive = selectedConversation?._id === conv?._id
                            return (
                                <div
                                    key={conv?._id}
                                    onClick={() => dispatch(setSelectedConversation(conv))}
                                    className={`flex items-center gap-2.5 cursor-pointer px-3 py-2.5 rounded-xl border transition-all duration-150 ${
                                        isActive
                                            ? "bg-[#B9FF66] border-[#191A23] text-[#191A23] shadow-[2px_2px_0px_#191A23] font-semibold"
                                            : "bg-transparent border-transparent text-[#191A23]/80 hover:bg-white hover:text-[#191A23] hover:border-[#191A23]/15 font-medium"
                                    }`}
                                >
                                    <div
                                        className={`flex items-center justify-center shrink-0 w-6 h-6 rounded-lg transition-colors ${
                                            isActive
                                                ? "bg-[#191A23] text-white"
                                                : "bg-black/5 text-[#191A23]"
                                        }`}
                                    >
                                        <MessageSquare size={13} />
                                    </div>
                                    <span className='text-[13px] truncate flex-1'>
                                        {conv?.title || "New Chat"}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    <div className='mx-3 h-px bg-[#191A23]/15' />

                    {/* User Profile Footer */}
                    <div className='p-3.5'>
                        {userData ? (
                            <div className='flex items-center gap-2.5 rounded-xl p-2.5 bg-white border border-[#191A23]/15 shadow-[2px_2px_0px_rgba(25,26,35,0.08)]'>
                                <div className='relative shrink-0'>
                                    {userData?.avatar && !imageError ? (
                                        <img
                                            className='w-9 h-9 rounded-lg object-cover border border-[#191A23]'
                                            src={userData?.avatar}
                                            alt="avatar"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className='w-9 h-9 rounded-lg bg-[#F3F3F3] border border-[#191A23]/20 flex items-center justify-center text-[#191A23]'>
                                            <User size={15} />
                                        </div>
                                    )}
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='text-[13px] font-bold text-[#191A23] truncate leading-tight'>
                                        {userData?.name || "User"}
                                    </p>
                                    <p className='text-[11px] text-[#767676] capitalize mt-0.5'>
                                        {userData?.plan || "free"} plan
                                    </p>
                                </div>
                                <div className='flex gap-1'>
                                    <button
                                        onClick={() => setShowBilling(true)}
                                        title="Billing & Plans"
                                        className='flex items-center justify-center w-7 h-7 rounded-lg border border-[#191A23]/20 bg-[#F3F3F3] hover:bg-[#B9FF66] text-[#191A23] cursor-pointer transition-colors duration-150'
                                    >
                                        <Coins size={14} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            logOut()
                                            dispatch(setUserdata(null))
                                        }}
                                        title="Logout"
                                        className='flex items-center justify-center w-7 h-7 rounded-lg border border-[#191A23]/20 bg-[#F3F3F3] hover:bg-[#191A23] hover:text-white text-[#191A23] cursor-pointer transition-colors duration-150'
                                    >
                                        <LogOut size={14} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                className='w-full flex items-center justify-center gap-2 text-sm font-bold text-[#191A23] bg-white border-2 border-[#191A23] rounded-xl py-2.5 cursor-pointer hover:bg-[#B9FF66] transition-colors duration-150 shadow-[2px_2px_0px_#191A23]'
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <BillingDrawer
                open={showBilling}
                onClose={() => setShowBilling(false)}
            />
        </>
    )
}

export default SideBar
