import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Sparkles, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

  return (
    <div className='relative pt-32 pb-20 sm:pt-40 sm:pb-24 px-4 sm:px-20 xl:px-32 w-full min-h-screen flex items-center justify-center overflow-hidden bg-slate-50'>
        {/* Soft background gradients */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-gradient-to-b from-purple-50/50 to-white'>
            <div className='absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-300/20 blur-[120px] transform-gpu'></div>
            <div className='absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-300/20 blur-[120px] transform-gpu'></div>
        </div>

        <div className={`max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition duration-1000 ease-out transform-gpu ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            
            {/* Left Content */}
            <motion.div 
                className='text-center lg:text-left z-10 flex flex-col items-center lg:items-start'
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "show" : "hidden"}
            >
                <motion.div variants={itemVariants} className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm shadow-purple-500/5 text-sm font-semibold text-gray-600 mb-8 w-max hover:shadow-md transition-shadow'>
                    <span className='bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>🚀 New</span>
                    <span className='w-px h-4 bg-gray-200'></span>
                    AI-powered content platform
                </motion.div>

                <motion.h1 variants={itemVariants} className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-6'>
                    Create amazing <br className="hidden lg:block" /> content with <br className="hidden lg:block" /> 
                    <span className='bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>AI tools</span>
                </motion.h1>
                
                <motion.p variants={itemVariants} className='text-lg sm:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed'>
                    Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow in seconds.
                </motion.p>

                <motion.div variants={itemVariants} className='flex flex-wrap items-center justify-center lg:justify-start gap-5'>
                    <button onClick={()=> navigate('/ai')} className='group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition hover:scale-105 active:scale-95 hover:brightness-110 transform-gpu'>
                        Start creating now
                        <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform transform-gpu' />
                    </button>
                </motion.div>
                
                <motion.div variants={itemVariants} className='flex items-center justify-center lg:justify-start gap-4 mt-12 text-sm font-medium text-gray-500'>
                    <div className='flex -space-x-3'>
                        <img src={assets.profile_img_1} alt="user" className='w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm' />
                        <div className='w-10 h-10 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-purple-600 font-bold shadow-sm'>+</div>
                    </div>
                    <span>Trusted by <span className='text-slate-800 font-bold'>10,000+</span> creators</span>
                </motion.div>
            </motion.div>

            {/* Right Visual (Mockup UI) */}
            <div className='relative z-10 w-full hidden lg:flex justify-center items-center'>
                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    className='relative w-[110%] aspect-square bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/60 p-2 transform-gpu rotate-1 hover:rotate-0 transition-transform duration-500'
                >
                    {/* Mockup Header */}
                    <div className='w-full h-14 bg-white/80 rounded-t-[2rem] border-b border-gray-100 flex items-center px-6 gap-2'>
                        <div className='flex gap-2 mr-4'>
                            <div className='w-3.5 h-3.5 rounded-full bg-red-400'></div>
                            <div className='w-3.5 h-3.5 rounded-full bg-amber-400'></div>
                            <div className='w-3.5 h-3.5 rounded-full bg-green-400'></div>
                        </div>
                        <div className='flex-1 h-8 bg-gray-50 rounded-md border border-gray-100 mx-4 flex items-center px-3 text-xs text-gray-400'>neurogen.ai/dashboard</div>
                    </div>
                    
                    {/* Mockup Body */}
                    <div className='p-8 h-[calc(100%-3.5rem)] bg-gradient-to-br from-gray-50/50 to-white/50 rounded-b-[2rem] flex flex-col gap-6 relative overflow-hidden'>
                        {/* Floating elements to look like a dashboard */}
                        <div className='w-4/5 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 transform-gpu animate-[pulse_4s_ease-in-out_infinite]'>
                             <div className='flex items-center gap-4'>
                                <div className='w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600'><Sparkles className='w-6 h-6' /></div>
                                <div className='flex flex-col gap-2 flex-1'>
                                    <div className='w-1/3 h-3 bg-gray-200 rounded-full'></div>
                                    <div className='w-1/4 h-2 bg-gray-100 rounded-full'></div>
                                </div>
                             </div>
                             <div className='w-full space-y-2 mt-2'>
                                <div className='w-full h-2 bg-gray-100 rounded-full'></div>
                                <div className='w-5/6 h-2 bg-gray-100 rounded-full'></div>
                             </div>
                        </div>

                        <div className='w-full flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-5 translate-x-8 transform-gpu'>
                            <div className='w-1/3 h-full bg-gradient-to-b from-purple-50 to-blue-50 rounded-xl border border-purple-100/50'></div>
                            <div className='w-2/3 flex flex-col gap-3'>
                                <div className='w-3/4 h-4 bg-gray-100 rounded-lg'></div>
                                <div className='w-1/2 h-4 bg-gray-100 rounded-lg'></div>
                                <div className='w-full h-full bg-gradient-to-r from-purple-100/30 to-blue-50/30 rounded-xl mt-4 border border-blue-50'></div>
                            </div>
                        </div>

                        <div className='absolute bottom-8 right-8 w-64 bg-white rounded-2xl shadow-xl shadow-purple-500/10 border border-purple-100 p-4 flex items-center justify-between z-20 hover:scale-105 transition-transform cursor-pointer transform-gpu'>
                            <div className='flex flex-col gap-2'>
                                <div className='text-sm font-bold text-slate-800'>Generation Complete</div>
                                <div className='text-xs text-gray-500 flex items-center gap-1'><span className='text-green-500'>●</span> Ready to download</div>
                            </div>
                            <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold'>✓</div>
                        </div>
                    </div>
                </motion.div>

                {/* Decorative blur elements for mockup */}
                <div className='absolute top-10 -right-10 w-40 h-40 bg-yellow-300/30 blur-[80px] rounded-full -z-10 transform-gpu pointer-events-none'></div>
                <div className='absolute -bottom-10 left-10 w-48 h-48 bg-purple-500/20 blur-[80px] rounded-full -z-10 transform-gpu pointer-events-none'></div>
            </div>
        </div>
    </div>
  )
}

export default Hero