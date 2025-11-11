import React, { useState, useRef, CSSProperties, useEffect, useLayoutEffect } from 'react';
import { TeamPanel } from './components/TeamPanel';
import { Team, TeamId, Participant, ParticipantMode } from './types';
import { FloatingMenu } from './components/FloatingMenu';
import { HistoryModal } from './components/HistoryModal';
import { DesignModeControls } from './components/DesignModeControls';
import { NeomorphicInput } from './components/NeomorphicInput';

declare const html2canvas: any;

const defaultTeams: Record<TeamId, Team> = {
  left: { id: 'left', name: 'Левая команда', participants: [] },
  right: { id: 'right', name: 'Правая команда', participants: [] },
};

const App: React.FC = () => {
  const [teams, setTeams] = useState<Record<TeamId, Team>>(defaultTeams);
  const [fontFamily, setFontFamily] = useState('');
  const [fontDataUrl, setFontDataUrl] = useState<string | null>(null);
  const [chartFontFamily, setChartFontFamily] = useState('');
  const [chartFontDataUrl, setChartFontDataUrl] = useState<string | null>(null);
  const [totalScoreFontFamily, setTotalScoreFontFamily] = useState('');
  const [totalScoreFontDataUrl, setTotalScoreFontDataUrl] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [teamGap, setTeamGap] = useState(48); // Corresponds to md:gap-12 (3rem)
  const [panelOpacity, setPanelOpacity] = useState(1);
  const [isScreenshotting, setIsScreenshotting] = useState(false);
  const [isFitMode, setIsFitMode] = useState(false);
  const [fitScale, setFitScale] = useState(1);
  const [mainTitle, setMainTitle] = useState('Неоморфное табло');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editingTitleValue, setEditingTitleValue] = useState(mainTitle);

  const appContainerRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const unscaledDimensions = useRef({ width: 0, height: 0 });


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        event.preventDefault();
        setIsDesignMode(prevMode => !prevMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Effect for key presses to toggle fit mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyA' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
        const target = event.target as HTMLElement;
        const targetTagName = target.tagName.toLowerCase();
        if (targetTagName !== 'input' && targetTagName !== 'textarea') {
          event.preventDefault();
          setIsFitMode(true);
        }
      }
    };
    
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'KeyA') {
        setIsFitMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Layout effect to measure content when it's not scaled
  useLayoutEffect(() => {
    if (!isFitMode && contentWrapperRef.current) {
      unscaledDimensions.current = {
        width: contentWrapperRef.current.offsetWidth,
        height: contentWrapperRef.current.offsetHeight,
      };
    }
  }); // Runs after every render

  // Effect for calculating and applying scale
  useEffect(() => {
    const calculateScale = () => {
      const { width, height } = unscaledDimensions.current;
      if (width === 0 || height === 0) return;

      const { innerWidth, innerHeight } = window;
      const padding = 16; // A small visual padding
      
      const availableWidth = innerWidth - padding;
      const availableHeight = innerHeight - padding;

      const scaleX = availableWidth / width;
      const scaleY = availableHeight / height;
      
      const newScale = Math.min(scaleX, scaleY, 1);
      setFitScale(newScale);
    };

    if (isFitMode) {
      calculateScale();
      window.addEventListener('resize', calculateScale);
    } else {
      setFitScale(1);
    }
    
    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [isFitMode]);


  useEffect(() => {
    document.documentElement.style.setProperty('--dynamic-bg-opacity', panelOpacity.toString());
  }, [panelOpacity]);

  useEffect(() => {
    const styleId = 'custom-user-font-style';
    const existingStyleElement = document.getElementById(styleId);
    if (existingStyleElement) {
        existingStyleElement.remove();
    }

    if (fontDataUrl) {
        const fontName = 'CustomUserFont';
        const newStyleElement = document.createElement('style');
        newStyleElement.id = styleId;
        newStyleElement.textContent = `
            @font-face {
                font-family: '${fontName}';
                src: url('${fontDataUrl}');
            }
        `;
        document.head.appendChild(newStyleElement);
        setFontFamily(fontName);
    } else {
        setFontFamily('');
    }
}, [fontDataUrl]);

 useEffect(() => {
    const styleId = 'custom-chart-font-style';
    const existingStyleElement = document.getElementById(styleId);
    if (existingStyleElement) {
        existingStyleElement.remove();
    }

    if (chartFontDataUrl) {
        const fontName = 'CustomChartFont';
        const newStyleElement = document.createElement('style');
        newStyleElement.id = styleId;
        newStyleElement.textContent = `
            @font-face {
                font-family: '${fontName}';
                src: url('${chartFontDataUrl}');
            }
        `;
        document.head.appendChild(newStyleElement);
        setChartFontFamily(fontName);
    } else {
        setChartFontFamily('');
    }
}, [chartFontDataUrl]);

useEffect(() => {
  const styleId = 'custom-total-score-font-style';
  const existingStyleElement = document.getElementById(styleId);
  if (existingStyleElement) {
      existingStyleElement.remove();
  }

  if (totalScoreFontDataUrl) {
      const fontName = 'CustomTotalScoreFont';
      const newStyleElement = document.createElement('style');
      newStyleElement.id = styleId;
      newStyleElement.textContent = `
          @font-face {
              font-family: '${fontName}';
              src: url('${totalScoreFontDataUrl}');
          }
      `;
      document.head.appendChild(newStyleElement);
      setTotalScoreFontFamily(fontName);
  } else {
      setTotalScoreFontFamily('');
  }
}, [totalScoreFontDataUrl]);


  const handleAddParticipant = (teamId: TeamId, participantName: string) => {
    if (participantName && participantName.trim()) {
      const newParticipant: Participant = {
        id: Date.now(),
        name: participantName.trim(),
        scores: [],
      };
      setTeams(prevTeams => ({
        ...prevTeams,
        [teamId]: {
          ...prevTeams[teamId],
          participants: [...prevTeams[teamId].participants, newParticipant],
        },
      }));
    }
  };

  const handleAddScore = (teamId: TeamId, participantId: number, scoreToAdd: number) => {
    const now = Date.now();
    setTeams(prevTeams => {
        const team = prevTeams[teamId];
        const updatedParticipants = team.participants.map(p => {
            if (p.id === participantId) {
                let finalScore = scoreToAdd;
                switch (p.mode) {
                    case 'brightBlue':
                        finalScore *= 1.25;
                        break;
                    case 'purple':
                        finalScore *= 0.75;
                        break;
                    // No multiplier for 'blue' or undefined mode
                    default:
                        break;
                }
                const roundedFinalScore = Math.round(finalScore);
                return { 
                    ...p, 
                    scores: [...p.scores, { id: now, value: roundedFinalScore, timestamp: now }] 
                };
            }
            return p;
        });

        return {
            ...prevTeams,
            [teamId]: {
                ...team,
                participants: updatedParticipants,
            },
        };
    });
  };


  const handleDeleteScore = (teamId: TeamId, participantId: number, scoreId: number) => {
    setTeams(prevTeams => {
      const newTeams = { ...prevTeams };
      const team = { ...newTeams[teamId] };
      team.participants = team.participants.map(p => {
        if (p.id === participantId) {
          return {
            ...p,
            scores: p.scores.filter(s => s.id !== scoreId),
          };
        }
        return p;
      });
      newTeams[teamId] = team;
      return newTeams;
    });
  };

  const handleSetParticipantMode = (teamId: TeamId, participantId: number, mode: ParticipantMode) => {
    setTeams(prevTeams => ({
      ...prevTeams,
      [teamId]: {
        ...prevTeams[teamId],
        participants: prevTeams[teamId].participants.map(p =>
          p.id === participantId
            ? { ...p, mode: p.mode === mode ? undefined : mode } // Toggle mode off if same is selected
            : p
        ),
      },
    }));
  };

  const handleUpdateTeamName = (teamId: TeamId, newName: string) => {
    if (newName.trim()) {
        setTeams(prevTeams => ({
            ...prevTeams,
            [teamId]: {
                ...prevTeams[teamId],
                name: newName.trim(),
            },
        }));
    }
  };

  const handleUpdateParticipantName = (teamId: TeamId, participantId: number, newName: string) => {
      if (newName.trim()) {
          setTeams(prevTeams => ({
              ...prevTeams,
              [teamId]: {
                  ...prevTeams[teamId],
                  participants: prevTeams[teamId].participants.map(p =>
                      p.id === participantId
                          ? { ...p, name: newName.trim() }
                          : p
                  ),
              },
          }));
      }
  };
  
  const handleSaveProgress = () => {
    try {
      const stateToSave = {
        teams,
        design: {
          fontDataUrl,
          chartFontDataUrl,
          totalScoreFontDataUrl,
          backgroundImage,
          teamGap,
          panelOpacity,
          mainTitle,
        },
      };
      const dataStr = JSON.stringify(stateToSave, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scoreboard-session-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to save progress:", error);
      alert("Не удалось сохранить прогресс.");
    }
  };

  const handleLoadProgress = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const result = event.target?.result as string;
            const loadedState = JSON.parse(result);
            
            if (loadedState.teams && loadedState.design) {
              const teamsData = loadedState.teams as Record<TeamId, Team>;
              for (const teamId in teamsData) {
                  teamsData[teamId as TeamId].participants = teamsData[teamId as TeamId].participants.map(p => {
                      if ((p.mode as any) === 'turquoise') {
                          return { ...p, mode: 'brightBlue' };
                      }
                      return p;
                  });
              }
              setTeams(teamsData);
              setFontDataUrl(loadedState.design.fontDataUrl ?? null);
              setChartFontDataUrl(loadedState.design.chartFontDataUrl ?? null);
              setTotalScoreFontDataUrl(loadedState.design.totalScoreFontDataUrl ?? null);
              setBackgroundImage(loadedState.design.backgroundImage ?? null);
              setTeamGap(loadedState.design.teamGap ?? 48);
              setPanelOpacity(loadedState.design.panelOpacity ?? 1);
              setMainTitle(loadedState.design.mainTitle ?? 'Неоморфное табло');
            } 
            else if (loadedState.left && loadedState.right) {
              setTeams(loadedState);
              setFontDataUrl(null);
              setChartFontDataUrl(null);
              setTotalScoreFontDataUrl(null);
              setBackgroundImage(null);
              setTeamGap(48);
              setPanelOpacity(1);
              setMainTitle('Неоморфное табло');
            } else {
              throw new Error("Invalid file format");
            }
          } catch (error) {
            console.error("Failed to load progress:", error);
            alert("Не удалось загрузить прогресс. Убедитесь, что файл имеет правильный формат.");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleFontChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ttf,.otf,.woff,.woff2';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFontDataUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleChartFontChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ttf,.otf,.woff,.woff2';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setChartFontDataUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
  };

  const handleTotalScoreFontChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ttf,.otf,.woff,.woff2';
    input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setTotalScoreFontDataUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
  };

  const handleResetTotalScoreFont = () => {
    setTotalScoreFontDataUrl(null);
  };

  const handleBackgroundChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setBackgroundImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleScreenshot = async () => {
    if (!appContainerRef.current || typeof html2canvas === 'undefined') {
        alert('Ошибка: функция создания скриншотов недоступна.');
        return;
    }

    setIsScreenshotting(true);
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
        const canvas = await html2canvas(appContainerRef.current, {
            useCORS: true,
            logging: false,
            ignoreElements: (element) => {
                return element.id === 'floating-menu' || 
                       element.id === 'design-controls' || 
                       element.id === 'history-modal';
            }
        });
        canvas.toBlob(async (blob) => {
            if (blob && navigator.clipboard?.write) {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                alert('Скриншот скопирован в буфер обмена!');
            } else {
                throw new Error('Не удалось создать изображение или получить доступ к буферу обмена.');
            }
        }, 'image/png');
    } catch (error) {
        console.error('Ошибка при создании скриншота:', error);
        alert('Не удалось создать скриншот.');
    } finally {
        setIsScreenshotting(false);
    }
  };
  
  const handleResetAll = () => {
    if (window.confirm('Вы уверены, что хотите стереть все данные? Это действие необратимо.')) {
      setTeams(defaultTeams);
      setFontDataUrl(null);
      setChartFontDataUrl(null);
      setTotalScoreFontDataUrl(null);
      setBackgroundImage(null);
      setTeamGap(48);
      setPanelOpacity(1);
      setMainTitle('Неоморфное табло');
    }
  };

  const handleTitleDoubleClick = () => {
    setEditingTitleValue(mainTitle);
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingTitleValue(e.target.value);
  };

  const handleTitleBlur = () => {
    if (editingTitleValue.trim()) {
      setMainTitle(editingTitleValue.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };
  
  const wrapperStyle: CSSProperties = {
    ...(fontFamily ? { fontFamily } : {}),
  };

  if (backgroundImage) {
    wrapperStyle.backgroundImage = `url(${backgroundImage})`;
    wrapperStyle.backgroundSize = 'cover';
    wrapperStyle.backgroundPosition = 'center';
    wrapperStyle.backgroundAttachment = 'fixed';
  }

  if (isFitMode) {
    wrapperStyle.height = '100vh';
    wrapperStyle.overflow = 'hidden';
    wrapperStyle.backgroundAttachment = 'fixed';
  }

  const contentStyle: CSSProperties = {
    transition: 'transform 0.2s ease-in-out',
    transform: `scale(${fitScale})`,
    transformOrigin: 'center center',
    flexShrink: 0, // Prevent shrinking when centered in a flex container
    // Set explicit dimensions in fit mode to prevent container squishing before scaling
    width: isFitMode ? unscaledDimensions.current.width : 'auto',
    height: isFitMode ? unscaledDimensions.current.height : 'auto',
  };

  const textShadowStyle: CSSProperties = {
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
  };


  return (
    <>
      <FloatingMenu
        onSave={handleSaveProgress}
        onLoad={handleLoadProgress}
        onFontChange={handleFontChange}
        onChartFontChange={handleChartFontChange}
        onBackgroundChange={handleBackgroundChange}
        onShowHistory={() => setIsHistoryVisible(true)}
        onScreenshot={handleScreenshot}
        onResetAll={handleResetAll}
      />
      {isDesignMode && (
        <DesignModeControls
          gap={teamGap}
          opacity={panelOpacity}
          onGapChange={setTeamGap}
          onOpacityChange={setPanelOpacity}
          onClose={() => setIsDesignMode(false)}
        />
       )}
      <HistoryModal
        isOpen={isHistoryVisible}
        onClose={() => setIsHistoryVisible(false)}
        teams={teams}
        onDeleteScore={handleDeleteScore}
      />
      <div
        ref={appContainerRef}
        className={`min-h-screen ${!backgroundImage ? 'bg-base-dark' : ''} text-slate-300 font-sans p-4 sm:p-6 lg:p-8 transition-colors duration-500 ${isFitMode ? 'flex items-center justify-center' : ''}`}
        style={wrapperStyle}
      >
        <div ref={contentWrapperRef} style={isFitMode ? contentStyle : { transition: 'transform 0.2s ease-in-out' }}>
          <header className="text-center mb-8">
             {isEditingTitle ? (
               <input
                 type="text"
                 value={editingTitleValue}
                 onChange={handleTitleChange}
                 onBlur={handleTitleBlur}
                 onKeyDown={handleTitleKeyDown}
                 className="text-4xl md:text-5xl font-bold text-slate-100 tracking-wider bg-transparent text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg w-full"
                 style={backgroundImage ? textShadowStyle : {}}
                 autoFocus
                 onFocus={(e) => e.target.select()}
               />
             ) : (
                <h1
                  className="text-4xl md:text-5xl font-bold text-slate-100 tracking-wider cursor-pointer"
                  style={backgroundImage ? textShadowStyle : {}}
                  onDoubleClick={handleTitleDoubleClick}
                >
                  {mainTitle}
                </h1>
             )}
          </header>
          <main 
            className={`flex flex-col md:flex-row justify-center items-start`}
            style={{ gap: `${teamGap}px`}}
          >
            <TeamPanel
              team={teams.left}
              onAddParticipant={handleAddParticipant}
              onAddScore={handleAddScore}
              onSetParticipantMode={handleSetParticipantMode}
              onUpdateTeamName={handleUpdateTeamName}
              onUpdateParticipantName={handleUpdateParticipantName}
              useTextShadow={!!backgroundImage}
              isScreenshotting={isScreenshotting}
              chartFontFamily={chartFontFamily}
              isFitMode={isFitMode}
              totalScoreFontFamily={totalScoreFontFamily}
              onTotalScoreFontChange={handleTotalScoreFontChange}
              onResetTotalScoreFont={handleResetTotalScoreFont}
            />
            <TeamPanel
              team={teams.right}
              onAddParticipant={handleAddParticipant}
              onAddScore={handleAddScore}
              onSetParticipantMode={handleSetParticipantMode}
              onUpdateTeamName={handleUpdateTeamName}
              onUpdateParticipantName={handleUpdateParticipantName}
              useTextShadow={!!backgroundImage}
              isScreenshotting={isScreenshotting}
              chartFontFamily={chartFontFamily}
              isFitMode={isFitMode}
              totalScoreFontFamily={totalScoreFontFamily}
              onTotalScoreFontChange={handleTotalScoreFontChange}
              onResetTotalScoreFont={handleResetTotalScoreFont}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default App;