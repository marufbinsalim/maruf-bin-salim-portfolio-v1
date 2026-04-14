import { CursorCircularTrail, CursorTrailArea } from 'cursor-trail-react';
import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <div className="w-full mx-auto min-h-[80svh] flex items-center py-20 px-6 md:px-[8vw]">
            {/* Main card container */}
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center">

                {/* LEFT COLUMN - Content */}
                <div className="flex flex-col space-y-6 flex-2/3">
                    {/* HELLO! badge */}
                    <CursorTrailArea.div data-cursor="active" trail={<CursorCircularTrail color="black" backgroundColor="white" blendMode='difference' />}
                        className="px-4 py-1.5 w-fit border-4 border-black hover:bg-black hover:text-white transition-all duration-300"
                    >
                        <span className="font-bol text-sm">HELLO!</span>
                    </CursorTrailArea.div>

                    {/* Name & Title */}
                    <div>
                        <h1 className="text-black text-4xl sm:text-5xl md:text-6xl font-extrabold flex flex-wrap gap-2 items-end">
                            I
                            <span className='text-base sm:text-lg font-semibold text-black'>
                                am 
                            </span>
                            <span className='text-base sm:text-lg font-semibold'>
                                Md.
                            </span>
                            <span>
                                Maruf
                            </span>
                            <span className='text-base sm:text-lg font-semibold'>
                                Bin
                            </span>
                            <span className='text-base sm:text-lg font-semibold'>
                                Salim
                            </span>
                            <span className='text-base sm:text-lg font-semibold'>
                                Bhuiyan
                            </span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                            Senior Software Engineer
                        </div>
                    </div>

                    {/* Bio / Description - tailored for Maruf as a generalist & React expert */}
                    <div className="space-y-4 text-black leading-relaxed">
                        <p className="text-base sm:text-lg">
                            I'm a <span className="font-bold text-black">fullstack generalist</span> who thrives at the intersection of
                            <span className="font-bold text-black"> scalable architecture, UI craftsmanship, and team impact</span>.
                            With deep expertise in React ecosystems and backend integration, I bridge design and engineering
                            to ship products users love.
                        </p>
                        <p className="text-base sm:text-lg">
                            I'm equally comfortable leading technical discovery, refactoring legacy codebases,
                            mentoring juniors, or diving deep into <span className="font-mono bg-slate-100 px-1 rounded">React Suspense</span>,
                            <span className="font-mono bg-slate-100 px-1 rounded"> Next.js</span>, and modern fullstack patterns.
                            When I'm not coding, you'll find me trail running, exploring open-source, or brewing
                            pour-over coffee.
                        </p>
                    </div>



                    {/* Optional CTA / fun fact line (like original's travel/yoga) */}
                    <CursorTrailArea.div trail={<CursorCircularTrail color="transparent" backgroundColor="#00000000" />}
                        className="pt-2 text-sm text-black border-t border-slate-200 flex items-center gap-3"
                    >
                        <span className="flex items-center gap-1">Email</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="flex items-center gap-1">Linked In</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="flex items-center gap-1">Github</span>
                    </CursorTrailArea.div>
                </div>

                {/* RIGHT COLUMN - Visual / React focused showcase */}
                <div className="flex items-center relative w-full md:w-max ml-auto flex-1/3">
                    <img
                        src="/assets/potrait.png"
                        alt="React Logo"
                        className="w-full md:max-w-[20vw] rounded-[30px]  border-2 border-black/10 aspect-1 bg-black/30 backdrop-blur-sm scale-x-[-1]"
                    />
                </div>

            </div>
        </div>
    );
};

export default HeroSection;