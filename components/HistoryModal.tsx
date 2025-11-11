import React, { useMemo } from 'react';
import { Team, TeamId } from '../types';
import { NeomorphicContainer } from './NeomorphicContainer';
import { NeomorphicButton } from './NeomorphicButton';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: Record<TeamId, Team>;
  onDeleteScore: (teamId: TeamId, participantId: number, scoreId: number) => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, teams, onDeleteScore }) => {
  const allScores = useMemo(() => {
    const scores: (any & { teamId: TeamId, teamName: string, participantId: number, participantName: string })[] = [];
    // FIX: Explicitly type `team` as `Team` to resolve type inference issue.
    Object.values(teams).forEach((team: Team) => {
      team.participants.forEach(participant => {
        participant.scores.forEach(score => {
          scores.push({
            ...score,
            teamId: team.id,
            teamName: team.name,
            participantId: participant.id,
            participantName: participant.name,
          });
        });
      });
    });
    return scores.sort((a, b) => b.timestamp - a.timestamp);
  }, [teams]);

  if (!isOpen) return null;

  return (
    <div 
      id="history-modal"
      className="fixed inset-0 bg-base-dark bg-opacity-75 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <NeomorphicContainer 
        className="w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4 p-2 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-slate-200">История очков</h2>
          <NeomorphicButton onClick={onClose} className="p-2 rounded-full">
            <CloseIcon />
          </NeomorphicButton>
        </header>
        
        <div className="overflow-y-auto pr-2">
            {allScores.length === 0 ? (
                <p className="text-center text-slate-400 py-8">История очков пуста.</p>
            ) : (
                <ul className="space-y-3">
                    {allScores.map(score => (
                        <li key={score.id}>
                            <NeomorphicContainer className="w-full p-3 !shadow-neo-in">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-100">
                                            {score.participantName} ({score.teamName})
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {new Date(score.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                    <p className={`font-mono text-xl ${score.value >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                                        {score.value > 0 ? '+' : ''}{score.value}
                                    </p>
                                    <NeomorphicButton
                                        onClick={() => onDeleteScore(score.teamId, score.participantId, score.id)}
                                        className="p-2 text-red-400 hover:text-red-300"
                                        aria-label={`Удалить запись очков ${score.value} для ${score.participantName}`}
                                    >
                                        <TrashIcon />
                                    </NeomorphicButton>
                                </div>
                            </NeomorphicContainer>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </NeomorphicContainer>
    </div>
  );
};