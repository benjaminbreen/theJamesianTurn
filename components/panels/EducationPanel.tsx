
import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { searchWikipedia } from '../../lib/wikipedia';

export const EducationPanel = () => {
    const { factCheckState, checkVeracity, gameLog } = useGame();
    const [isChecking, setIsChecking] = useState(false);

    const lastImportantLog = gameLog.slice().reverse().find(l => l.source === 'EVENT' || l.source === 'NARRATOR')?.text;

    const handleCheck = () => {
        if (!lastImportantLog) return;
        setIsChecking(true);
        checkVeracity(lastImportantLog);
        setTimeout(() => setIsChecking(false), 3000); // Min loader time
    };

    return (
        <div className="h-full flex flex-col bg-[#f7f3e8] p-4 font-serif text-[#2b2520]">
            <div className="border-b-2 border-[#8b0000] pb-2 mb-4">
                <h2 className="text-xl font-bold text-[#8b0000]">Historical Assessment</h2>
                <p className="text-xs italic opacity-70">The Veracity Engine</p>
            </div>

            {/* Current Context */}
            <div className="mb-6 bg-white p-3 border border-[#5c4033]/20 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Last Notable Event</h3>
                <p className="text-sm italic">"{lastImportantLog || "Waiting for history to unfold..."}"</p>
                
                <button 
                    onClick={handleCheck}
                    disabled={isChecking || !lastImportantLog}
                    className="mt-3 w-full py-2 bg-[#2f4f4f] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1a2f2f] disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                    {isChecking ? <span className="animate-spin">⟳</span> : 'Verify Authenticity'}
                </button>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto space-y-4">
                {factCheckState.isLoading ? (
                     <div className="animate-pulse space-y-2 opacity-50">
                         <div className="h-4 bg-[#5c4033] rounded w-3/4"></div>
                         <div className="h-20 bg-[#5c4033] rounded"></div>
                     </div>
                ) : factCheckState.analysis ? (
                    <div className="animate-in fade-in slide-in-from-bottom duration-500">
                        {/* Score Dial */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative w-16 h-16 flex items-center justify-center bg-white rounded-full border-4 border-[#5c4033] shadow-inner">
                                <span className="text-xl font-bold">{factCheckState.veracityScore}%</span>
                            </div>
                            <div className="flex-1">
                                <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${factCheckState.veracityScore! > 80 ? 'bg-green-600' : factCheckState.veracityScore! > 50 ? 'bg-yellow-600' : 'bg-red-600'}`} 
                                        style={{ width: `${factCheckState.veracityScore}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold uppercase mt-1 block">
                                    {factCheckState.veracityScore! > 80 ? 'Historically Accurate' : 'Dubious / Fictional'}
                                </span>
                            </div>
                        </div>

                        {/* Analysis */}
                        <div className="bg-[#fffdf5] p-3 border-l-4 border-[#8b0000] mb-4 shadow-sm">
                            <h4 className="text-xs font-bold uppercase mb-1 text-[#8b0000]">Critique</h4>
                            <p className="text-sm">{factCheckState.analysis}</p>
                        </div>

                        {/* Wikipedia Source */}
                        {factCheckState.wikiData && (
                             <div className="bg-white p-3 border border-[#5c4033]/20 shadow-sm">
                                 <div className="flex justify-between items-center mb-2">
                                     <h4 className="text-xs font-bold uppercase flex items-center gap-1">
                                         <img src="https://upload.wikimedia.org/wikipedia/commons/6/63/Wikipedia-logo.png" className="w-4 h-4 opacity-70" alt="Wiki" />
                                         Reference: {factCheckState.wikiData.title}
                                     </h4>
                                     <a href={factCheckState.wikiData.url} target="_blank" rel="noreferrer" className="text-[10px] text-blue-800 hover:underline">Read Source ↗</a>
                                 </div>
                                 <p className="text-xs leading-relaxed opacity-80 line-clamp-4">
                                     {factCheckState.wikiData.extract}
                                 </p>
                             </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center opacity-40 text-sm italic mt-10">
                        Request a verification to consult the archives.
                    </div>
                )}
            </div>
        </div>
    );
};
