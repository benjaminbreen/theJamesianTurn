
import React, { useState, ReactNode, useEffect } from 'react';

interface Tab {
    id: string;
    label: string;
    content: ReactNode;
}

interface SidebarTabsProps {
    tabs: Tab[];
    side: 'left' | 'right';
    activeTabId?: string; // Optional controlled state
}

export const SidebarTabs = ({ tabs, side, activeTabId }: SidebarTabsProps) => {
    const [localActiveTab, setLocalActiveTab] = useState(tabs[0].id);

    useEffect(() => {
        if (activeTabId) {
            setLocalActiveTab(activeTabId);
        }
    }, [activeTabId]);

    return (
        <div className={`h-full w-full flex flex-col bg-paper-50 text-paper-900 border-${side === 'left' ? 'r' : 'l'} border-paper-200`}>
            {/* Tab Headers */}
            <div className="flex border-b border-paper-200 bg-paper-100">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setLocalActiveTab(tab.id)}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors font-sans ${
                            localActiveTab === tab.id 
                                ? 'bg-paper-50 text-victorian-red border-b-2 border-victorian-red' 
                                : 'text-paper-900/50 hover:bg-paper-200 hover:text-paper-900'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative">
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        className={`absolute inset-0 overflow-auto transition-opacity duration-300 ${
                            localActiveTab === tab.id ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};
