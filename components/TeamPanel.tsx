import React, { useMemo, useState, CSSProperties, useEffect } from 'react';
import { Team, TeamId, ParticipantMode } from '../types';
import { ScoreChart } from './ScoreChart';
import { ParticipantCard } from './ParticipantCard';
import { NeomorphicButton } from './NeomorphicButton';
import { NeomorphicInput } from './NeomorphicInput';
import { NeomorphicContainer } from './NeomorphicContainer';

interface TeamPanelProps {
  team: Team;
  onAddParticipant: (teamId: TeamId, name: string) => void;
  onAddScore: (teamId: TeamId, participantId: number, newScore: number) => void;
  onSetParticipantMode: (teamId: TeamId, participantId: number, mode: ParticipantMode) => void;
  onUpdateTeamName: (teamId: TeamId, newName: string) => void;
  onUpdateParticipantName: (teamId: TeamId, participantId: number, newName: string) => void;
  useTextShadow?: boolean;
  isScreenshotting?: boolean;
  chartFontFamily?: string;
  isFitMode?: boolean;
  totalScoreFontFamily?: string;
  onTotalScoreFontChange: () => void;
  onResetTotalScoreFont: () => void;
}

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


export const TeamPanel: React.FC<TeamPanelProps> = ({ 
    team, 
    onAddParticipant, 
    onAddScore, 
    onSetParticipantMode, 
    onUpdateTeamName,
    onUpdateParticipantName,
    useTextShadow,
    isScreenshotting,
    chartFontFamily,
    isFitMode,
    totalScoreFontFamily,
    onTotalScoreFontChange,
    onResetTotalScoreFont,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);
  const [teamName, setTeamName] = useState(team.name);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; } | null>(null);

  useEffect(() => {
    setTeamName(team.name);
  }, [team.name]);

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


  const totalScore = useMemo(
    () => team.participants.reduce((teamSum, p) =>
      teamSum + p.scores.reduce((playerSum, s) => playerSum + s.value, 0),
    0),
    [team.participants]
  );
  
  const yAxisMax = totalScore > 10000 ? 20000 : 10000;

  const chartData = useMemo(() => {
    const allScoreEntries = team.participants.flatMap(p => p.scores);
    allScoreEntries.sort((a, b) => a.timestamp - b.timestamp);

    let runningTotal = 0;
    const history = allScoreEntries.map((scoreEntry, index) => {
      runningTotal += scoreEntry.value;
      return { name: `${index + 1}`, score: runningTotal };
    });

    return [{ name: '0', score: 0 }, ...history];
  }, [team.participants]);

  const handleParticipantScoreAdd = (participantId: number, newScore: number) => {
    onAddScore(team.id, participantId, newScore);
  };
  
  const handleParticipantModeSet = (participantId: number, mode: ParticipantMode) => {
    onSetParticipantMode(team.id, participantId, mode);
  };

  const handleConfirmAdd = () => {
    if (newName.trim()) {
      onAddParticipant(team.id, newName.trim());
      setNewName('');
      setIsAdding(false);
    }
  };

  const handleCancelAdd = () => {
    setNewName('');
    setIsAdding(false);
  }

  const textShadowStyle: CSSProperties = {
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  };

  const totalScoreStyle: CSSProperties = {
    ...(useTextShadow ? textShadowStyle : {}),
    ...(totalScoreFontFamily ? { fontFamily: totalScoreFontFamily } : {}),
    cursor: 'context-menu',
  };

  const handleTeamNameDoubleClick = () => {
    setIsEditingTeamName(true);
  };

  const handleTeamNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTeamName(e.target.value);
  };

  const handleTeamNameBlur = () => {
      if (teamName.trim()) {
        onUpdateTeamName(team.id, teamName);
      } else {
        setTeamName(team.name); // Revert if empty
      }
      setIsEditingTeamName(false);
  };

  const handleTeamNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          handleTeamNameBlur();
      } else if (e.key === 'Escape') {
          setTeamName(team.name); // Revert
          setIsEditingTeamName(false);
      }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
    <div className="flex flex-col gap-6 w-full max-w-md">
      <header className="text-center">
        {isEditingTeamName ? (
            <NeomorphicInput
                type="text"
                value={teamName}
                onChange={handleTeamNameChange}
                onBlur={handleTeamNameBlur}
                onKeyDown={handleTeamNameKeyDown}
                className="text-3xl font-bold text-slate-200 text-center bg-transparent !shadow-none focus:!ring-2 focus:!ring-cyan-500 rounded-lg"
                autoFocus
                onFocus={(e) => e.target.select()}
            />
        ) : (
            <h2 
                className="text-3xl font-bold text-slate-200 cursor-pointer" 
                style={useTextShadow ? textShadowStyle : {}}
                onDoubleClick={handleTeamNameDoubleClick}
            >
                {team.name}
            </h2>
        )}
        <p 
          className="text-lg text-cyan-400" 
          style={totalScoreStyle}
          onContextMenu={handleContextMenu}
        >
            Общий счёт: {totalScore}
        </p>
      </header>
      
      <div
        className="flex flex-col gap-6"
      >
        <ScoreChart data={chartData} yAxisMax={yAxisMax} isReversed={team.id === 'right'} chartFontFamily={chartFontFamily} />
        
        <div>
            <div className="flex flex-col gap-4">
              {team.participants.map(participant => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  onAddScore={handleParticipantScoreAdd}
                  onSetMode={(mode) => handleParticipantModeSet(participant.id, mode)}
                  onUpdateName={(newName) => onUpdateParticipantName(team.id, participant.id, newName)}
                  isScreenshotting={isScreenshotting}
                  isFitMode={isFitMode}
                  chartFontFamily={chartFontFamily}
                />
              ))}
            </div>
            
            <div className={isScreenshotting ? 'hide-on-screenshot' : ''}>
              {isAdding ? (
                <NeomorphicContainer className="mt-4">
                  <div className="flex flex-col gap-4">
                    <NeomorphicInput
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Имя нового участника"
                      aria-label="Имя нового участника"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleConfirmAdd()}
                    />
                    <div className="flex justify-end gap-2">
                      <NeomorphicButton onClick={handleCancelAdd} className="px-3 py-1 text-sm">Отмена</NeomorphicButton>
                      <NeomorphicButton onClick={handleConfirmAdd} className="px-3 py-1 text-sm bg-cyan-700/50">Добавить</NeomorphicButton>
                    </div>
                  </div>
                </NeomorphicContainer>
              ) : (
                <NeomorphicButton onClick={() => setIsAdding(true)} className="mt-4 w-full flex items-center justify-center">
                  <PlusIcon />
                  Добавить участника
                </NeomorphicButton>
              )}
            </div>
        </div>
      </div>
    </div>
    {contextMenu && (
        <div 
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-[101] bg-panel-dark rounded-lg shadow-neo-out p-2 flex flex-col gap-1 border border-slate-700"
          onClick={e => e.stopPropagation()}
        >
            <button
                onClick={() => { onTotalScoreFontChange(); setContextMenu(null); }}
                className="text-left text-slate-300 hover:bg-slate-700/50 rounded px-3 py-1.5 transition-colors duration-150 w-full"
            >
                Сменить шрифт
            </button>
             <button
                onClick={() => { onResetTotalScoreFont(); setContextMenu(null); }}
                className="text-left text-slate-300 hover:bg-slate-700/50 rounded px-3 py-1.5 transition-colors duration-150 w-full"
            >
                Сбросить шрифт
            </button>
        </div>
      )}
    </>
  );
};