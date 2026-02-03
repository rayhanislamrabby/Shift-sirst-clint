import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiLockClosed, HiShieldExclamation } from 'react-icons/hi';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-[#080808] text-slate-200 overflow-hidden">
            
            {/* --- background design elements --- */}
            {/* dynamic glow spheres */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full animate-pulse"></div>
            
            {/* subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`}}>
            </div>

            {/* --- main glass card --- */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-black/50 text-center">
                    
                    {/* css animated icon section */}
                    <div className="relative flex justify-center mb-10">
                        {/* outer ripple effect */}
                        <div className="absolute inset-0 bg-red-500/20 rounded-full scale-150 animate-ping opacity-25"></div>
                        
                        <div className="relative w-24 h-24 bg-gradient-to-tr from-red-600 to-rose-400 rounded-3xl shadow-lg flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500">
                            <HiLockClosed className="text-white text-5xl drop-shadow-md" />
                            
                            {/* status badge */}
                            <div className="absolute -top-2 -right-2 bg-black border-2 border-red-500 p-1.5 rounded-lg animate-bounce">
                                <HiShieldExclamation className="text-red-500 text-lg" />
                            </div>
                        </div>
                    </div>

                    {/* text content */}
                    <div className="space-y-4 mb-10">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white italic">
                            403<span className="text-red-600">.</span>
                        </h1>
                        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-red-500/90">
                            Access Forbidden
                        </h2>
                        <div className="h-1 w-12 bg-red-600/30 mx-auto rounded-full"></div>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            Your credentials are valid, but you do not have <span className="text-white underline decoration-red-600 underline-offset-4">clearance</span> for this sector.
                        </p>
                    </div>

                    {/* interactive buttons */}
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="group flex items-center justify-center gap-3 bg-white text-black py-4 px-6 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:bg-red-600 hover:text-white active:scale-95 shadow-xl shadow-white/5"
                        >
                            <HiArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform" />
                            Secure Exit
                        </button>
                        
                        <button 
                            onClick={() => window.history.back()}
                            className="py-2 text-slate-500 hover:text-white text-xs font-mono tracking-tighter transition-colors"
                        >
                            [ DISMISS AND RETURN ]
                        </button>
                    </div>
                </div>

                {/* footer technical info */}
                <div className="mt-10 text-center opacity-40">
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-white">
                        Node: SEC_GATE_04 // Auth_Denied
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;