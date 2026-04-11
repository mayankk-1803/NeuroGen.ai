import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate()
    const { user } = useUser()
    const { openSignIn } = useClerk()
    const [scrolled, setScrolled] = useState(false)
    
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

  return (
    <div className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-4' : 'bg-transparent py-6'} px-6 sm:px-20 xl:px-32 flex justify-between items-center`}>
        <div onClick={()=> navigate('/')} className='flex items-center gap-2 cursor-pointer group'>
            <div className='bg-gradient-to-tr from-purple-600 to-blue-500 p-1.5 rounded-lg shadow-md group-hover:scale-105 transition-transform'>
                <Sparkles className='w-5 h-5 text-white' />
            </div>
            <span className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent tracking-tight'>
                NeuroGen AI
            </span>
        </div>

        {
            user ? <div className="scale-110 hover:scale-[1.15] transition-transform"><UserButton /></div> : (
                <button onClick={openSignIn} className='flex items-center gap-2 rounded-full text-sm font-semibold cursor-pointer bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-110' >
                    Get Started <ArrowRight className='w-4 h-4' />
                </button>
            )
        }
    </div>
  )
}

export default Navbar