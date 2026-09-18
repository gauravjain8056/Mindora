import React from 'react'
import { AnimatePresence, motion } from "motion/react"
import { Crown, X } from 'lucide-react'
import { useSelector } from 'react-redux'
import { createOrder } from '../features/createOrder'
import { verifyPayment } from '../features/verifyPayment'

function BillingDrawer({ open, onClose }) {
    const { userData } = useSelector(state => state.user)

    const handleUpgrade = async (plan) => {
        try {
            const data = await createOrder(plan)
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data?.order?.amount,
                currency: data?.order?.currency,
                name: "Mindora AI",
                description: `${data?.plan?.name || plan} Plan`,
                order_id: data?.order?.id,
                handler: async (response) => {
                    try {
                        const res = await verifyPayment(response)
                        console.log(res)
                    } catch (error) {
                        console.log(error)
                    }
                },
                theme: {
                    color: "#191A23"
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#191A23]/40 z-40"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="fixed right-0 top-0 z-50 h-screen w-full max-w-[400px] bg-white border-l-2 border-[#191A23] shadow-2xl flex flex-col"
                    >
                        {/* Drawer Header */}
                        <div className='flex items-center justify-between p-5 border-b border-[#191A23]/15 bg-[#F3F3F3]'>
                            <div>
                                <h2 className='text-[#191A23] text-xl font-bold font-display tracking-tight'>
                                    Billing & Plans
                                </h2>
                                <p className='text-[#767676] text-xs font-medium'>
                                    Manage your account credits & upgrades
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg bg-white border border-[#191A23]/20 hover:bg-[#B9FF66] hover:border-[#191A23] text-[#191A23] flex items-center justify-center cursor-pointer transition-colors duration-150"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Current Plan Card */}
                        <div className='p-5 border-b border-[#191A23]/10'>
                            <div className='rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] p-4 shadow-[3px_3px_0px_#191A23]'>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className='text-[#767676] text-xs font-bold uppercase tracking-wider'>
                                            Current Subscription
                                        </p>
                                        <h3 className='text-[#191A23] text-2xl font-bold font-display capitalize mt-0.5'>
                                            {userData?.plan || "free"} Plan
                                        </h3>
                                    </div>
                                    <div className='w-9 h-9 rounded-xl bg-[#B9FF66] border border-[#191A23] flex items-center justify-center text-[#191A23] shadow-[1.5px_1.5px_0px_#191A23]'>
                                        <Crown size={18} />
                                    </div>
                                </div>

                                <div className='mt-4'>
                                    <div className='flex justify-between text-xs font-semibold text-[#191A23] mb-1.5'>
                                        <span>Credits Balance</span>
                                        <span>{userData?.credits || 0} / {userData?.totalCredits || 100}</span>
                                    </div>

                                    <div className='h-3 rounded-full bg-white border border-[#191A23]/30 overflow-hidden p-0.5'>
                                        <div
                                            className="h-full bg-[#B9FF66] border border-[#191A23] rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.min(100, Math.max(0, (
                                                    (userData?.credits || 0) /
                                                    (userData?.totalCredits || 1)
                                                ) * 100))}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upgrade Cards */}
                        <div className='p-5 flex-1 overflow-auto space-y-4'>
                            <div className='rounded-2xl border-2 border-[#191A23] p-4 bg-[#F3F3F3] shadow-[3px_3px_0px_#191A23]'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <span className='inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#191A23] text-[#191A23] uppercase mb-1.5'>
                                            Popular
                                        </span>
                                        <h3 className='text-[#191A23] font-bold font-display text-lg'>Starter Plan</h3>
                                        <p className='text-[#767676] text-xs mt-0.5'>500 AI credits with priority compute</p>
                                    </div>
                                    <p className='text-[#191A23] text-2xl font-bold font-display'>₹199</p>
                                </div>
                                <button
                                    className='mt-4 w-full rounded-xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] py-2.5 text-white font-bold text-sm border-2 border-[#191A23] shadow-[2px_2px_0px_#191A23] cursor-pointer transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                                    onClick={() => handleUpgrade("starter")}
                                >
                                    Upgrade to Starter
                                </button>
                            </div>

                            <div className='rounded-2xl border-2 border-[#191A23] p-4 bg-white shadow-[3px_3px_0px_#191A23]'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <span className='inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-[#B9FF66] border border-[#191A23] text-[#191A23] uppercase mb-1.5'>
                                            Power User
                                        </span>
                                        <h3 className='text-[#191A23] font-bold font-display text-lg'>Pro Plan</h3>
                                        <p className='text-[#767676] text-xs mt-0.5'>1000 AI credits, unlimited artifacts & vision</p>
                                    </div>
                                    <p className='text-[#191A23] text-2xl font-bold font-display'>₹499</p>
                                </div>
                                <button
                                    className='mt-4 w-full rounded-xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] py-2.5 text-white font-bold text-sm border-2 border-[#191A23] shadow-[2px_2px_0px_#191A23] cursor-pointer transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                                    onClick={() => handleUpgrade("pro")}
                                >
                                    Upgrade to Pro
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default BillingDrawer
