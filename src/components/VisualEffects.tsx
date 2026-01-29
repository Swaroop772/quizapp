import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type VFXType = 'DAMAGE' | 'CRITICAL' | 'MISS' | 'NANI' | 'HEAL' | 'CUT_IN';

export interface VFXEvent {
    id: string;
    type: VFXType;
    value?: string | number;
    x?: number;
    y?: number;
}

interface VisualEffectsProps {
    queue: VFXEvent[];
    onComplete: (id: string) => void;
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({ queue, onComplete }) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {queue.map((effect) => (
                    <EffectItem key={effect.id} effect={effect} onComplete={onComplete} />
                ))}
            </AnimatePresence>
        </div>
    );
};

const EffectItem: React.FC<{ effect: VFXEvent; onComplete: (id: string) => void }> = ({ effect, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => onComplete(effect.id), 2000);
        return () => clearTimeout(timer);
    }, [onComplete, effect.id]);

    switch (effect.type) {
        case 'DAMAGE':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: effect.y || '40%', x: effect.x || '50%' }}
                    animate={{ opacity: 1, scale: 1.5, y: typeof effect.y === 'number' ? effect.y - 100 : '30%' }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute text-5xl font-black text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] font-display italic z-50"
                    style={{ left: 0, top: 0, width: '100%', textAlign: 'center' }}
                >
                    -{effect.value}
                </motion.div>
            );
        case 'CRITICAL':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -20, x: 0, y: 0 }}
                    animate={{ opacity: 1, scale: 2, rotate: 0, x: 0, y: 0 }}
                    exit={{ opacity: 0, scale: 3 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                >
                    <div className="text-8xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(255,165,0,1)] font-display tracking-tighter skew-x-12 border-4 border-black p-4 bg-black/50 backdrop-blur-sm rounded-xl">
                        CRITICAL HIT!!
                    </div>
                </motion.div>
            );
        case 'NANI':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 2 }}
                    animate={{ opacity: 1, scale: 1, x: [0, -10, 10, -10, 10, 0] }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
                >
                    <div className="text-[10rem] font-black text-white font-display uppercase tracking-widest drop-shadow-[10px_10px_0_#ff0000]">
                        NANI?!
                    </div>
                </motion.div>
            );
        case 'CUT_IN':
            return (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: '-100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-1/3 left-0 w-full h-64 bg-brand-600/90 border-y-8 border-yellow-400 z-50 flex items-center justify-center overflow-hidden"
                >
                    <div className="flex items-center gap-8 skew-x-[-20deg]">
                        <span className="text-9xl font-black text-white italic drop-shadow-lg font-display">SUPER MOOOOVE!!</span>
                    </div>
                </motion.div>
            );
        default:
            return null;
    }
};
