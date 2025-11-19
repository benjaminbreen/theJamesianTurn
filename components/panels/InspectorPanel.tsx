
import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { AsciiPortrait } from '../visuals/AsciiPortrait';

// --- Sub-Component: The Inspector (Entity View) ---
export const EntityInspector = () => {
    const { playerStats } = useGame();
    return (
      <div className="p-6 space-y-6">
         <div className="flex flex-col items-center p-6 bg-paper-100 border border-paper-200 shadow-inner">
            <div className="w-32 h-32 mb-4 flex items-center justify-center bg-paper-200 rounded-full overflow-hidden border-4 border-white shadow-md">
               <AsciiPortrait id="HENRY_JAMES" className="scale-125 text-paper-900" />
            </div>
            <h3 className="text-xl font-serif font-bold text-victorian-red">Henry James</h3>
            <p className="text-xs font-sans uppercase tracking-widest opacity-60 mt-1">Man of Letters</p>
         </div>

         <div className="space-y-4">
           <h4 className="text-xs font-sans font-bold uppercase border-b border-paper-200 pb-1">Constitution</h4>
           
           <div className="space-y-1">
             <div className="flex justify-between text-xs font-sans">
               <span>Composure</span>
               <span>{playerStats.composure}/{playerStats.maxComposure}</span>
             </div>
             <div className="h-1.5 w-full bg-paper-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-victorian-green transition-all duration-500"
                  style={{ width: `${(playerStats.composure / playerStats.maxComposure) * 100}%` }}
                ></div>
             </div>
           </div>

           <div className="space-y-1">
             <div className="flex justify-between text-xs font-sans">
               <span>Reputation</span>
               <span>{playerStats.reputation}</span>
             </div>
             <div className="h-1.5 w-full bg-paper-200 rounded-full overflow-hidden">
                <div className="h-full bg-victorian-gold" style={{ width: '40%' }}></div>
             </div>
           </div>
         </div>
      </div>
    );
};

// --- Sub-Component: The Narrator (Chat) ---
export const NarratorChat = () => {
    const { narratorHistory, sendNarratorMessage, isNarratorTyping } = useGame();
    const [chatInput, setChatInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [narratorHistory]);

    const handleChatSubmit = () => {
        if (!chatInput.trim()) return;
        sendNarratorMessage(chatInput);
        setChatInput('');
    };

    return (
        <div className="flex flex-col h-full bg-paper-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-gradient">
                {narratorHistory.map((msg, i) => (
                    <div key={i} className={`${msg.role === 'user' ? 'ml-8' : 'mr-8'}`}>
                        <div className={`p-4 text-sm shadow-sm leading-relaxed ${
                            msg.role === 'user'
                            ? 'bg-white text-paper-900 italic border border-paper-200'
                            : 'bg-paper-200 text-paper-900 font-serif first-letter:text-2xl first-letter:font-bold first-letter:text-victorian-red first-letter:mr-1 first-letter:float-left'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isNarratorTyping && <div className="text-xs text-center italic opacity-50">The narrator is thinking...</div>}
                <div ref={chatEndRef} />
            </div>
            <div className="p-2 bg-white border-t border-paper-200 flex gap-2">
                 <input 
                  className="flex-1 px-3 py-2 text-sm bg-paper-50 border border-paper-200 outline-none focus:border-victorian-gold transition-colors font-serif"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                  placeholder="Ask the Narrator..."
              />
              <button 
                  onClick={handleChatSubmit}
                  className="px-3 py-2 text-xs font-bold uppercase bg-victorian-green text-white shadow-sm hover:bg-opacity-90"
              >
                  Send
              </button>
            </div>
        </div>
    );
};
