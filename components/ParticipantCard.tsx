import React, { useState, useMemo, useEffect } from 'react';
import { Participant, ParticipantMode } from '../types';
import { NeomorphicContainer } from './NeomorphicContainer';
import { NeomorphicInput } from './NeomorphicInput';

interface ParticipantCardProps {
  participant: Participant;
  onAddScore: (participantId: number, score: number) => void;
  onSetMode: (mode: ParticipantMode) => void;
  onUpdateName: (newName: string) => void;
  isScreenshotting?: boolean;
  isFitMode?: boolean;
  chartFontFamily?: string;
}

const modeConfig: Record<ParticipantMode, { label: string; colorClass: string }> = {
    blue: { label: 'Голубой', colorClass: 'bg-sky-400' },
    brightBlue: { label: 'Синий', colorClass: 'bg-blue-500' },
    purple: { label: 'Пурпурный', colorClass: 'bg-purple-500' },
};

export const ParticipantCard: React.FC<ParticipantCardProps> = ({ participant, onAddScore, onSetMode, onUpdateName, isScreenshotting, isFitMode, chartFontFamily }) => {
  const [newScore, setNewScore] = useState('');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(participant.name);

  useEffect(() => {
    setName(participant.name);
  }, [participant.name]);

  const totalScore = useMemo(
    () => participant.scores.reduce((sum, s) => sum + s.value, 0),
    [participant.scores]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewScore(e.target.value);
  };

  const handleScoreKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const scoreValue = parseInt(newScore, 10);
      if (!isNaN(scoreValue)) {
        onAddScore(participant.id, scoreValue);
        setNewScore('');
      }
    }
  };
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isEditing) return;
    setContextMenu({ x: e.clientX, y: e.clientY });
  };
  
  const handleModeSelect = (mode: ParticipantMode) => {
    onSetMode(mode);
    setContextMenu(null);
  }

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            setContextMenu(null);
        }
    };

    if (contextMenu) {
      setTimeout(() => {
        window.addEventListener('click', handleClickOutside);
        window.addEventListener('contextmenu', handleClickOutside);
        window.addEventListener('keydown', handleEsc);
      }, 0);
    }
    
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('contextmenu', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [contextMenu]);

  const handleNameDoubleClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
  };

  const handleNameBlur = () => {
      if (name.trim()) {
        onUpdateName(name);
      } else {
        setName(participant.name); // Revert if empty
      }
      setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleNameBlur();
      } else if (e.key === 'Escape') {
          setName(participant.name); // Revert
          setIsEditing(false);
      }
  };


  return (
    <>
      <NeomorphicContainer className="w-full">
        <div className="flex items-center justify-between gap-2">
            <div 
                className="flex items-center gap-2 flex-1 min-w-0"
                onContextMenu={handleContextMenu}
                aria-label={`Нажмите правую кнопку мыши, чтобы установить режим для ${participant.name}`}
            >
              {isEditing ? (
                  <NeomorphicInput
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                    onKeyDown={handleNameKeyDown}
                    className="!p-0 !shadow-none bg-transparent h-6 focus:!ring-1 focus:!ring-cyan-500/50"
                    autoFocus
                    onFocus={(e) => e.target.select()}
                  />
              ) : (
                <span 
                    className="font-medium text-slate-200 truncate cursor-pointer"
                    onDoubleClick={handleNameDoubleClick}
                >
                    {participant.name}
                </span>
              )}
                {participant.mode && !isEditing && <div className={`w-2.5 h-2.5 rounded-full ${modeConfig[participant.mode].colorClass}`}></div>}
            </div>
            <span 
              className="text-lg w-20 text-center" 
              aria-label={`Текущий счёт ${participant.name}`}
              style={chartFontFamily ? { fontFamily: chartFontFamily } : {}}
            >
              {totalScore}
            </span>
            <div className={`w-28 ${(isScreenshotting || isFitMode) ? 'hide-on-screenshot' : ''}`}>
            <NeomorphicInput
                type="number"
                value={newScore}
                onChange={handleInputChange}
                onKeyDown={handleScoreKeyDown}
                placeholder="Очки..."
                aria-label={`Добавить очки для ${participant.name}`}
                className="text-center font-bold"
            />
            </div>
        </div>
      </NeomorphicContainer>

      {contextMenu && (
        <div 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[101] bg-panel-dark rounded-lg shadow-neo-out p-2 flex flex-col gap-1 border border-slate-700"
          onClick={e => e.stopPropagation()}
        >
          <div className="px-3 pb-1 mb-1 border-b border-slate-600 text-xs text-slate-400">Режим</div>
          {(Object.keys(modeConfig) as ParticipantMode[]).map((key) => (
            <button
                key={key}
                onClick={() => handleModeSelect(key)}
                className="flex items-center justify-between gap-3 text-left text-slate-300 hover:bg-slate-700/50 rounded px-3 py-1.5 transition-colors duration-150 w-full"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${modeConfig[key].colorClass}`}></div>
                    <span>{modeConfig[key].label}</span>
                </div>
                 {participant.mode === key && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
          ))}
        </div>
      )}
    </>
  );
};