import React from 'react'
import { Sparkles } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-gray-100 py-12 px-6 sm:px-20 xl:px-32 text-slate-600">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className='flex items-center gap-2 group cursor-pointer'>
                        <div className='bg-gradient-to-tr from-purple-600 to-blue-500 p-1.5 rounded-md group-hover:scale-110 transition-transform duration-300'>
                            <Sparkles className='w-4 h-4 text-white' />
                        </div>
                        <span className='font-bold text-slate-800 text-xl tracking-tight'>NeuroGen AI</span>
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs text-center md:text-left">
                        Empowering your creative journey with next-generation AI tools.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="flex items-center gap-8 text-sm font-medium">
                        <a href="#" className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-purple-600 after:transition-transform after:duration-300 hover:text-purple-600 hover:after:origin-bottom-left hover:after:scale-x-100 transition-colors">Home</a>
                        <a href="#" className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-purple-600 after:transition-transform after:duration-300 hover:text-purple-600 hover:after:origin-bottom-left hover:after:scale-x-100 transition-colors">Services</a>
                        <a href="#" className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-purple-600 after:transition-transform after:duration-300 hover:text-purple-600 hover:after:origin-bottom-left hover:after:scale-x-100 transition-colors">Pricing</a>
                        <a href="#" className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-purple-600 after:transition-transform after:duration-300 hover:text-purple-600 hover:after:origin-bottom-left hover:after:scale-x-100 transition-colors">Contact</a>
                    </div>
                </div>
                
                <div className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} NeuroGen AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
};