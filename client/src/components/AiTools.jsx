import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const AiTools = () => {
  const navigate = useNavigate()
  const {user} = useUser()

  const cardVariants = {
      hidden: { opacity: 0, y: 30 },
      show: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
      })
  };

  return (
    <div className='py-24 px-4 sm:px-20 xl:px-32 bg-white relative'>
        {/* Soft decorative background top line */}
        <div className='absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent'></div>

        <div className='max-w-[1400px] mx-auto'>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className='text-center mb-20'
            >
                <h2 className='text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6'>
                    Unleash your creativity <br className="hidden sm:block" /> with <span className='bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>Powerful AI Tools</span>
                </h2>
                <p className='text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed'>
                    Everything you need to create, enhance, and optimize your content with cutting-edge AI technology.
                </p>
            </motion.div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {AiToolsData.map((tool, index)=>(
                  <motion.div 
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    key={index} 
                    className='group relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-400 cursor-pointer overflow-hidden z-10 hover:scale-[1.03] active:scale-95' 
                    onClick={()=> user && navigate(tool.path) }
                  >
                    {/* Hover Gradient Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400 -z-10'></div>
                    
                    <div className='relative z-10'>
                        <div 
                            className='inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 shadow-md shadow-black/5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-400' 
                            style={{background: `linear-gradient(135deg, ${tool.bg.from}, ${tool.bg.to})`}}
                        >
                            <tool.Icon className='w-8 h-8 text-white' />
                        </div>
                        <h3 className='text-2xl font-bold text-slate-800 mb-4 group-hover:text-purple-600 transition-colors'>{tool.title}</h3>
                        <p className='text-gray-500 text-base leading-relaxed mb-8'>{tool.description}</p>
                        
                        <div className='flex items-center text-sm font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0'>
                            Try it now <ArrowRight className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform' />
                        </div>
                    </div>
                  </motion.div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default AiTools