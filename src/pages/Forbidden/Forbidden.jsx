import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiLockClosed } from 'react-icons/hi';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-error/20 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"></div>
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-20" 
                 style={{backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
            </div>

            <div className="relative z-10 max-w-lg w-full px-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center">
                    
                    {/* Lottie Icon */}
                    <div className="relative mx-auto w-48 h-48 mb-6">
                        <DotLottieReact
                            src="https://lottie.host/80516624-9b36-4709-b7b5-2442220f8628/V7C3gOqGPr.lottie" 
                            loop
                            autoplay
                        />
                        <div className="absolute bottom-4 right-4 bg-error p-3 rounded-2xl shadow-lg ring-4 ring-[#1a1a1a]">
                            <HiLockClosed className="text-white text-2xl" />
                        </div>
                    </div>

                    {/* Text Section */}
                    <h1 className="text-white text-4xl font-black tracking-tight mb-3">
                        RESTRICTED <span className="text-error">AREA</span>
                    </h1>
                    
                    <div className="w-16 h-1 bg-error/50 mx-auto mb-6 rounded-full"></div>

                    <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10">
                        Authentication successful, but you lack the <span className="text-white">clearance level</span> to view this resource.
                    </p>

                    {/* Actions */}
                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={() => navigate('/')}
                            className="btn btn-lg bg-white hover:bg-gray-200 text-black border-none rounded-2xl normal-case transition-all duration-300 transform hover:scale-105"
                        >
                            <HiArrowLeft className="text-xl" /> Back to Dashboard
                        </button>
                        
                        <button 
                            className="btn btn-ghost text-white hover:text-blue-800 normal-case"
                            onClick={() => window.history.back()}
                        >
                            Go Back
                        </button>
                    </div>
                </div>

                {/* System Status Footnote */}
                <p className="mt-8 text-center text-white text-sm font-mono tracking-widest uppercase">
                    Security ID: 403-ERR_AUTH_DENIED
                </p>
            </div>
        </div>
    );
};

export default Forbidden;