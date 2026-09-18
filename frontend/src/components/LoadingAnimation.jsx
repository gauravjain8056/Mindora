import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"

function LoadingAnimation() {
    const thinkingLabels = ["Thinking", "Analyzing", "Reasoning", "Writing"]
    const [labelIndex, setLabelIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setLabelIndex((prev) => (prev + 1) % thinkingLabels.length)
        }, 1800)
        return () => clearInterval(interval)
    }, [])

    const label = thinkingLabels[labelIndex]

    return (
        <div className='flex items-center gap-3 py-1'>
            <div className='inline-flex items-center gap-3 bg-[#F3F3F3] border border-[#191A23]/15 rounded-2xl rounded-tl-sm px-4 py-3 shadow-[2px_2px_0px_rgba(25,26,35,0.06)]'>
                {/* 3 Clean Bouncing Dots */}
                <div className='flex items-center gap-1.5'>
                    {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.span
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                                i === 1 ? 'bg-[#B9FF66] border border-[#191A23]' : 'bg-[#191A23]'
                            }`}
                            animate={{
                                y: [-2, 2, -2],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: delay,
                            }}
                        />
                    ))}
                </div>

                <div className='text-[13px] font-semibold text-[#191A23] font-display tracking-tight'>
                    {label}...
                </div>
            </div>
        </div>
    )
}

export default LoadingAnimation
