import React from 'react'
import {PricingTable} from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className='relative py-24 bg-slate-50 overflow-hidden'>
        {/* Soft background elements */}
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] max-w-4xl opacity-40 mix-blend-multiply filter blur-3xl pointer-events-none -z-10'>
            <div className='absolute top-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-70 animate-[pulse_6s_ease-in-out_infinite]'></div>
            <div className='absolute -bottom-8 left-1/4 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-70 animate-[pulse_6s_ease-in-out_infinite_2s]'></div>
        </div>

        <div className='max-w-[1400px] mx-auto z-20 px-4 sm:px-8 relative'>
            <div className='text-center mb-16'>
                <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-sm font-semibold text-purple-600 mb-6 shadow-sm'>
                    ⭐ Flexible Pricing
                </div>
                <h2 className='text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6'>
                    Choose Your <span className='bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>Perfect Plan</span>
                </h2>
                <p className='text-lg text-gray-500 max-w-2xl mx-auto'>
                    Start for free and scale up as you grow. Designed for creators of all levels.
                </p>
            </div>
            
            <div className='mt-10 pricing-wrapper relative'>
                {/* Glow effect positioned behind the center card (Premium) */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full'></div>
                <PricingTable />
            </div>
        </div>
    </div>
  )
}

export default Plan