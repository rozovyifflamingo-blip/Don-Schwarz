import React, { useState } from 'react';
import { NeomorphicButton } from './NeomorphicButton';

interface FloatingMenuProps {
  onSave: () => void;
  onLoad: () => void;
  onFontChange: () => void;
  onChartFontChange: () => void;
  onBackgroundChange: () => void;
  onShowHistory: () => void;
  onScreenshot: () => void;
  onResetAll: () => void;
}

const CogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const FontIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M18 3H2v2h7v10h2V5h7V3z" />
    </svg>
);

const ChartFontIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6 3h8v2H6z" />
        <path d="M9 5h2v10H9z" />
        <path d="M13 15h1v-3h-1z" />
        <path d="M15 15h1v-5h-1z" />
        <path d="M17 15h1v-7h-1z" />
    </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ onSave, onLoad, onFontChange, onChartFontChange, onBackgroundChange, onShowHistory, onScreenshot, onResetAll }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      id="floating-menu"
      className="fixed top-4 left-4 z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col items-start gap-3">
        <NeomorphicButton className="p-3 rounded-full">
          <CogIcon />
        </NeomorphicButton>

        <div className={`flex flex-col items-start gap-3 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <NeomorphicButton onClick={onSave} className="p-3 rounded-full" aria-label="Скачать прогресс">
                <DownloadIcon />
            </NeomorphicButton>
            <NeomorphicButton onClick={onLoad} className="p-3 rounded-full" aria-label="Загрузить прогресс">
                <UploadIcon />
            </NeomorphicButton>
            <NeomorphicButton onClick={onFontChange} className="p-3 rounded-full" aria-label="Сменить шрифт">
                <FontIcon />
            </NeomorphicButton>
            <NeomorphicButton onClick={onChartFontChange} className="p-3 rounded-full" aria-label="Сменить шрифт графика">
                <ChartFontIcon />
            </NeomorphicButton>
            <NeomorphicButton onClick={onBackgroundChange} className="p-3 rounded-full" aria-label="Сменить фон">
                <ImageIcon />
            </NeomorphicButton>
            <NeomorphicButton onClick={onShowHistory} className="p-3 rounded-full" aria-label="История очков">
                <HistoryIcon />
            </NeomorphicButton>
             <NeomorphicButton onClick={onScreenshot} className="p-3 rounded-full" aria-label="Сделать скриншот">
                <CameraIcon />
            </NeomorphicButton>
            <NeomorphicButton onClick={onResetAll} className="p-3 rounded-full text-red-400 hover:text-red-300" aria-label="Стереть всё">
                <TrashIcon />
            </NeomorphicButton>
        </div>
      </div>
    </div>
  );
};