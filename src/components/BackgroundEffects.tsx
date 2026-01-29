import { useEffect, useState } from 'react';

// Simplified particle system for falling leaves + Running Ninja
export const BackgroundEffects = () => {
    const [leaves, setLeaves] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);

    useEffect(() => {
        // Generate leaves on mount
        const newLeaves = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: Math.random() * 100, // Random horizontal position
            delay: Math.random() * 5,  // Random start delay
            duration: 10 + Math.random() * 10, // Random fall duration (10-20s)
            size: 15 + Math.random() * 15 // Random size
        }));
        setLeaves(newLeaves);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Background Sky Gradient Overlay to darken the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Falling Leaves */}
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className="absolute -top-10 opacity-60 animate-falling-leaf"
                    style={{
                        left: `${leaf.left}%`,
                        width: `${leaf.size}px`,
                        height: `${leaf.size}px`,
                        animationDelay: `${leaf.delay}s`,
                        animationDuration: `${leaf.duration}s`,
                        background: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2C13 5 15 8 18 10C15 12 12 15 10 18C8 15 5 12 2 10C5 8 8 5 10 2C10.5 5 11.5 8 12 2Z' fill='%234ade80' fill-opacity='0.6' stroke='%2322c55e' stroke-width='1'/%3E%3C/svg%3E") no-repeat center/contain`
                    }}
                />
            ))}

            {/* Running Ninja Silhouette (Naruto) */}
            <div className="absolute bottom-10 left-0 w-full animate-ninja-run z-20">
                <div className="w-24 h-24 animate-ninja-bob relative">
                    {/* Simplified Naruto Run Silhouette (SVG) */}
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-lg">
                        <g opacity="0.9">
                            {/* Headband Ties */}
                            <path d="M75 15C85 15 95 10 95 10" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />
                            <path d="M75 15C85 20 90 25 90 25" stroke="#f97316" strokeWidth="4" strokeLinecap="round" />

                            {/* Body (Orange) - Leaning forward */}
                            <path d="M40 30 L70 35 L60 60 L30 55 Z" fill="#f97316" />

                            {/* Head */}
                            <circle cx="65" cy="20" r="12" fill="#fcd34d" />
                            <path d="M60 12 L75 12" stroke="#4b5563" strokeWidth="6" /> {/* Headplate */}

                            {/* Arms (Naruto Run - Arms back) */}
                            <path d="M40 30 L10 20" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
                            <path d="M40 30 L15 15" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />

                            {/* Legs (Running) */}
                            <path d="M30 55 L20 80 L35 85" stroke="#374151" strokeWidth="8" strokeLinejoin="round" fill="none" /> {/* Back Leg */}
                            <path d="M60 60 L80 70 L75 90" stroke="#374151" strokeWidth="8" strokeLinejoin="round" fill="none" /> {/* Front Leg */}
                        </g>
                    </svg>

                    {/* Dust Particles behind */}
                    <div className="absolute bottom-0 -left-10 w-20 h-10 flex gap-2 opacity-50">
                        <div className="w-4 h-4 bg-white/30 rounded-full animate-ping"></div>
                        <div className="w-6 h-6 bg-white/20 rounded-full animate-ping delay-75"></div>
                    </div>
                </div>
            </div>

            {/* Running Ninja Silhouette (Sasuke) - Chasing */}
            <div className="absolute bottom-24 left-0 w-full animate-ninja-run z-10" style={{ animationDelay: '0.5s' }}>
                <div className="w-20 h-20 animate-ninja-bob relative" style={{ animationDelay: '0.2s' }}>
                    {/* Simplified Sasuke Run Silhouette (SVG) */}
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full filter drop-shadow-lg">
                        <g opacity="0.9">
                            {/* Spiky Hair */}
                            <path d="M60 10 L50 0 L40 10 L30 5 L55 25" fill="#1e293b" />

                            {/* Rope Belt (Purple) */}
                            <path d="M40 50 L20 45" stroke="#a855f7" strokeWidth="6" strokeLinecap="round" />

                            {/* Body (Grey/Blue) - Leaning forward */}
                            <path d="M40 30 L70 35 L60 60 L30 55 Z" fill="#94a3b8" />
                            <path d="M40 30 L70 35 L60 60 L30 55 Z" stroke="#1e293b" strokeWidth="2" fill="none" />

                            {/* Head */}
                            <circle cx="65" cy="20" r="11" fill="#fcd34d" />

                            {/* Arms (Sword hand?) */}
                            <path d="M40 30 L10 25" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
                            {/* Sword (Kusanagi) */}
                            <path d="M10 25 L-20 15" stroke="#cbd5e1" strokeWidth="3" />
                            <path d="M10 25 L15 27" stroke="#000" strokeWidth="4" />

                            {/* Legs (Running) */}
                            <path d="M30 55 L20 80 L35 85" stroke="#1e293b" strokeWidth="7" strokeLinejoin="round" fill="none" /> {/* Back Leg */}
                            <path d="M60 60 L80 70 L75 90" stroke="#1e293b" strokeWidth="7" strokeLinejoin="round" fill="none" /> {/* Front Leg */}
                        </g>
                    </svg>
                    {/* Dust Particles behind */}
                    <div className="absolute bottom-0 -left-8 w-16 h-8 flex gap-2 opacity-40">
                        <div className="w-3 h-3 bg-purple-400/30 rounded-full animate-ping"></div>
                    </div>
                </div>
            </div>

            {/* Foreground Trees / Silhouette (Parallax) */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none">
                {/* CSS Pattern for trees */}
                <div className="w-[200%] h-full flex" style={{ animation: 'run-across 30s linear infinite reverse' }}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-32 h-full mx-10 bg-black/50" style={{
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            transform: `scaleY(${0.5 + Math.random() * 1})`
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
};
