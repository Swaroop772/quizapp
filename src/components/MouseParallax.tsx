import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const MouseParallax: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out mouse movements
    const springConfig = { damping: 25, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Calculate normalized mouse position (-0.5 to 0.5)
            const { innerWidth, innerHeight } = window;
            mouseX.set(e.clientX / innerWidth - 0.5);
            mouseY.set(e.clientY / innerHeight - 0.5);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Create multiple layers with different movement factors (parallax)
    const layer1X = useTransform(springX, value => value * -30);
    const layer1Y = useTransform(springY, value => value * -30);

    const layer2X = useTransform(springX, value => value * -60);
    const layer2Y = useTransform(springY, value => value * -60);

    const layer3X = useTransform(springX, value => value * 20);
    const layer3Y = useTransform(springY, value => value * 20);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-900">
            {/* Tech Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Layer 1: Deep Background Elements (Large Hexagons) */}
            <motion.div
                style={{ x: layer1X, y: layer1Y }}
                className="absolute inset-0 opacity-20"
            >
                <motion.div
                    animate={{
                        rotate: [0, 60, 120, 180],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: "linear"
                    }}
                    className="absolute top-[10%] left-[5%] w-64 h-64 border-2 border-brand-500/30 blur-sm"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                />

                <motion.div
                    animate={{
                        y: [0, 100, 0],
                        rotate: [0, -45, 0]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-[20%] right-[5%] w-80 h-80 bg-accent-500/5 blur-xl"
                    style={{ clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' }} // Parallelogram
                />
            </motion.div>

            {/* Layer 2: Mid-Range Tech Shapes */}
            <motion.div
                style={{ x: layer2X, y: layer2Y }}
                className="absolute inset-0 opacity-30"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [45, 90, 45],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[40%] left-[60%] w-32 h-32 border border-brand-400/40"
                    style={{ transform: 'rotate(45deg)' }} // Diamond
                />
                <motion.div
                    animate={{
                        x: [0, -50, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute top-[15%] right-[25%] w-48 h-48 border border-accent-400/20 rounded-xl"
                />
            </motion.div>

            {/* Layer 3: Foreground Floating Particles (Data/Code Fragments) */}
            <motion.div
                style={{ x: layer3X, y: layer3Y }}
                className="absolute inset-0"
            >
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        opacity: [0, 0.8, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut"
                    }}
                    className="absolute top-[20%] left-[20%] w-2 h-2 bg-brand-400 rounded-sm shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                />
                <motion.div
                    animate={{
                        y: [0, 60, 0],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: 1.5
                    }}
                    className="absolute bottom-[40%] right-[30%] w-3 h-3 bg-accent-400 rotate-45"
                />
                <motion.div
                    animate={{
                        x: [0, 30, 0],
                        opacity: [0.1, 0.5, 0.1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                    className="absolute top-[70%] left-[10%] w-16 h-1 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"
                />
            </motion.div>
        </div>
    );
};
