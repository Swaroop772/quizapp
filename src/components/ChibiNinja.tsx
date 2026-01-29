import { motion } from 'framer-motion';

interface ChibiNinjaProps {
    mood: 'happy' | 'sad' | 'normal' | 'thinking';
    className?: string;
}

export function ChibiNinja({ mood, className = '' }: ChibiNinjaProps) {
    // Map moods to images
    // For 'normal' and 'thinking', we'll default to 'happy' or 'sad' for now until we have more assets,
    // or use 'happy' as default.
    const getEmoji = () => {
        switch (mood) {
            case 'happy':
                return '🦊'; // Fox/Celebration
            case 'sad':
                return '😭'; // Crying
            case 'thinking':
                return '🤔'; // Thinking
            default:
                return '🥷'; // Ninja
        }
    };

    return (
        <motion.div
            className={`relative ${className} flex justify-center items-center`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
        >
            <motion.div
                key={mood}
                className="text-9xl filter drop-shadow-2xl cursor-pointer hover:scale-110 transition-transform"
                initial={{ y: 20, opacity: 0, rotate: -10 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {getEmoji()}
            </motion.div>
            {/* Speech Bubble */}
            <motion.div
                className="absolute -top-12 -right-12 bg-white text-black p-3 rounded-2xl rounded-bl-none shadow-lg border-2 border-black font-display text-sm whitespace-nowrap z-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                {mood === 'happy' && "Dattebayo! Correct!"}
                {mood === 'sad' && "Mou... Wrong!"}
                {mood === 'thinking' && "Hmm..."}
                {mood === 'normal' && "Ganbatte!"}
            </motion.div>
        </motion.div>
    );
}
