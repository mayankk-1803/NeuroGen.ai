import { assets } from "../assets/assets";

const Testimonial = () => {
    const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            handle: '@neilstellar',
            date: 'April 20, 2025'
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            handle: '@averywrites',
            date: 'May 10, 2025'
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            handle: '@jordantalks',
            date: 'June 5, 2025'
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Avery Johnson',
            handle: '@averywrites',
            date: 'May 10, 2025'
        },
    ];

    const CreateCard = ({ card }) => (
        <div className="p-6 rounded-[2rem] mx-4 bg-white/70 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-2 transition-all duration-300 w-[340px] shrink-0 relative overflow-hidden group">
            {/* Subtle card glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            
            <div className="flex gap-4 items-center mb-6">
                <img className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-white" src={card.image} alt="User Image" />
                <div className="flex flex-col">
                    <p className="font-bold text-slate-800 text-lg group-hover:text-purple-600 transition-colors">{card.name}</p>
                    <span className="text-sm font-medium text-purple-500">{card.handle}</span>
                </div>
            </div>
            <div className="flex items-center gap-1 mb-4">
                 {Array(5).fill(0).map((_, index)=>(<img key={index} src={assets.star_icon} className="w-4 h-4 brightness-110 contrast-125" alt="star" />))}
            </div>
            <p className="text-base leading-relaxed text-gray-600 italic mb-6">
                "Radiant made undercutting all of our competitors an absolute breeze."
            </p>
            <div className="flex items-center justify-between text-slate-400 text-sm font-medium pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <a href="https://x.com" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-sky-50 text-gray-400 hover:text-sky-500 transition-colors">
                        <svg width="12" height="11" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="m.027 0 4.247 5.516L0 10h.962l3.742-3.926L7.727 10H11L6.514 4.174 10.492 0H9.53L6.084 3.616 3.3 0zM1.44.688h1.504l6.64 8.624H8.082z" fill="currentColor" />
                        </svg>
                    </a>
                </div>
                <p>{card.date}</p>
            </div>
        </div>
    );

    return (
        <div className="py-24 bg-white relative">
            <div className="text-center mb-16 px-4">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                    Loved by <span className='bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>Creators</span> everywhere
                </h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">See what our community has to say about their experience.</p>
            </div>
            <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 35s linear infinite;
                will-change: transform;
                transform: translateZ(0);
            }
            .marquee-row:hover .marquee-inner {
                animation-play-state: paused;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>

            <div className="marquee-row w-full mx-auto max-w-[1400px] overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-32 md:w-64 z-10 pointer-events-none bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-4 pb-8">
                    {[...cardsData, ...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-32 md:w-64 z-10 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent"></div>
            </div>

            <div className="marquee-row w-full mx-auto max-w-[1400px] overflow-hidden relative mt-4">
                <div className="absolute left-0 top-0 h-full w-32 md:w-64 z-10 pointer-events-none bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-4 pb-12">
                    {[...cardsData, ...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-32 md:w-64 z-10 pointer-events-none bg-gradient-to-l from-white via-white/80 to-transparent"></div>
            </div>
        </div>
    )
}

export default Testimonial