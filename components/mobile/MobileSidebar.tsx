
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const MobileSidebar = ({ isOpen, onClose, title, children }: MobileSidebarProps) => {
    const { theme } = useTheme();
    const isChronoscope = theme === 'chronoscope';

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className={`absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-hidden flex flex-col ${
                        isChronoscope
                            ? 'bg-slate-900 border-t-2 border-cyan-500'
                            : 'bg-[#fdfbf7] border-t-4 border-[#5c4033]'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${
                        isChronoscope ? 'border-cyan-500/30 bg-slate-800' : 'border-[#5c4033]/20 bg-[#f3e5ab]'
                    }`}>
                        <h2 className={`text-lg font-bold uppercase tracking-wider ${
                            isChronoscope ? 'text-cyan-400' : 'text-[#5c4033]'
                        }`}>
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className={`w-8 h-8 flex items-center justify-center text-xl ${
                                isChronoscope ? 'text-cyan-400 hover:bg-cyan-500/20' : 'text-[#5c4033] hover:bg-[#5c4033]/10'
                            }`}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
