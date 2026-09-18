import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, googleProvider } from '../../utils/firebase'
import api from '../../utils/axios'
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import SideBar from '../components/SideBar';
import ChatArea from '../components/ChatArea';
import Artifact from '../components/Artifact';

function Home() {
    const { userData } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const handleLogin = async (token) => {
        try {
            const { data } = await api.post("/api/auth/login", { token })
            dispatch(setUserdata(data))
        } catch (error) {
            console.log(error)
        }
    }

    const googleLogin = async () => {
        const data = await signInWithPopup(auth, googleProvider)
        const token = await data.user.getIdToken()
        await handleLogin(token)
    }

    return (
        <div className='h-screen flex bg-white text-[#191A23] overflow-hidden'>
            <SideBar />
            <ChatArea />
            <Artifact />

            {!userData && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#191A23]/50'>
                    <div className='w-[380px] max-w-[92vw] bg-white border-2 border-[#191A23] rounded-2xl p-7 flex flex-col gap-6 shadow-[5px_5px_0px_#191A23]'>
                        <div className='flex flex-col gap-1'>
                            <span className='inline-block self-start font-display font-bold text-[11px] px-2.5 py-0.5 rounded-md bg-[#B9FF66] text-[#191A23] tracking-wide'>
                                MINDORA
                            </span>
                            <h2 className='font-display text-[22px] font-bold text-[#191A23] tracking-tight mt-2'>
                                Welcome back
                            </h2>
                            <p className='text-[13px] text-[#555770] leading-relaxed'>
                                Connect your account to access your conversations and assistants.
                            </p>
                        </div>

                        <button
                            className='w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-semibold text-[#191A23] bg-[#F3F3F3] border-2 border-[#191A23] hover:bg-[#B9FF66] transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_#191A23] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#191A23]'
                            onClick={googleLogin}
                        >
                            <FcGoogle size={18} />
                            Continue with Google
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home
