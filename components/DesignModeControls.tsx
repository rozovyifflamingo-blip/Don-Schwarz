import React from 'react';
import { NeomorphicContainer } from './NeomorphicContainer';
import { NeomorphicButton } from './NeomorphicButton';

interface DesignModeControlsProps {
    gap: number;
    opacity: number;
    onGapChange: (value: number) => void;
    onOpacityChange: (value: number) => void;
    onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const DesignModeControls: React.FC<DesignModeControlsProps> = ({ gap, opacity, onGapChange, onOpacityChange, onClose }) => {
    return (
        <div id="design-controls" className="fixed top-4 right-4 z-[60]">
            <NeomorphicContainer className="w-64 p-4">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-slate-200">Дизайн-режим</h3>
                    <NeomorphicButton onClick={onClose} className="p-1.5 rounded-full text-sm">
                       <CloseIcon />
                    </NeomorphicButton>
                </div>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="gap-slider" className="block text-sm font-medium text-slate-400 mb-1">
                            Промежуток: {gap}px
                        </label>
                        <input
                            id="gap-slider"
                            type="range"
                            min="0"
                            max="200"
                            value={gap}
                            onChange={(e) => onGapChange(Number(e.target.value))}
                            className="w-full h-2 bg-dark-shadow rounded-lg appearance-none cursor-pointer neo-slider"
                            aria-label="Изменить промежуток между командами"
                        />
                    </div>
                    <div>
                        <label htmlFor="opacity-slider" className="block text-sm font-medium text-slate-400 mb-1">
                            Прозрачность: {Math.round(opacity * 100)}%
                        </label>
                        <input
                            id="opacity-slider"
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={opacity}
                            onChange={(e) => onOpacityChange(Number(e.target.value))}
                            className="w-full h-2 bg-dark-shadow rounded-lg appearance-none cursor-pointer neo-slider"
                            aria-label="Изменить прозрачность панелей"
                        />
                    </div>
                </div>
            </NeomorphicContainer>
        </div>
    );
};