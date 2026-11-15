import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AstronautSprite } from './components/AstronautSprite';
import { DecisionCutscene } from './components/DecisionCutscene';
import { StationAtmosphere } from './components/StationAtmosphere';
import { ThoughtBubble } from './components/ThoughtBubble';
import {
  SPACE_SCENARIOS,
  SpaceScenario,
  ThoughtOption,
  ThoughtSection,
} from './data/scenarios';
import { soundEngine } from './utils/sound';

type GameState =
  | 'TITLE_MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'ROUND_SUMMARY'
  | 'VICTORY'
  | 'GAME_OVER';

type ShiftMode = 'timed' | 'relaxed';

interface RoundOutcome {
  scenarioId: string;
  title: string;
  scienceTakeaway: string;
  isSuccess: boolean;
  wasSoundSectionCorrupted: boolean;
  isTimeout: boolean;
  headline: string;
  detail: string;
  pointsEarned: number;
  responseTimeSeconds: number;
}

function shuffleOptions(options: [ThoughtOption, ThoughtOption, ThoughtOption]): ThoughtOption[] {
  const copy = [...options];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [shiftMode, setShiftMode] = useState<ShiftMode>('timed');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [integrity, setIntegrity] = useState(100);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SPACE_SCENARIOS[0].timerSeconds);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<ThoughtOption[]>([]);
  const [latestOutcome, setLatestOutcome] = useState<RoundOutcome | null>(null);
  const [history, setHistory] = useState<RoundOutcome[]>([]);
  const [muted, setMuted] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(0);

  const currentScenario: SpaceScenario = SPACE_SCENARIOS[scenarioIndex];
  const roundStartRef = useRef<number>(Date.now());

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.muted = next;
  };

  const startMission = () => {
    setScenarioIndex(0);
    setIntegrity(100);
    setScore(0);
    setTimeLeft(SPACE_SCENARIOS[0].timerSeconds);
    setSelectedSectionId(null);
    setShuffledOptions([]);
    setLatestOutcome(null);
    setHistory([]);
    setShakeTrigger(0);
    roundStartRef.current = Date.now();
    setGameState('PLAYING');
    soundEngine.playBubbleAppear();
  };

  const handleTimeout = useCallback(() => {
    const scenario = SPACE_SCENARIOS[scenarioIndex];
    const nextIntegrity = Math.max(0, integrity - 35);
    setIntegrity(nextIntegrity);
    setShakeTrigger((prev) => prev + 1);
    soundEngine.playFailure();

    const outcome: RoundOutcome = {
      scenarioId: scenario.id,
      title: scenario.title,
      scienceTakeaway: scenario.scienceTakeaway,
      isSuccess: false,
      wasSoundSectionCorrupted: false,
      isTimeout: true,
      headline: scenario.timeoutHeadline,
      detail: scenario.timeoutDetail,
      pointsEarned: 0,
      responseTimeSeconds: scenario.timerSeconds,
    };

    setLatestOutcome(outcome);
    setHistory((prev) => [...prev, outcome]);
    setGameState('ROUND_SUMMARY');
  }, [integrity, scenarioIndex]);

  // Countdown Timer Loop
  useEffect(() => {
    if (gameState !== 'PLAYING' || shiftMode !== 'timed') return;

    const interval = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          window.clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return Math.max(0, Number((prev - 0.1).toFixed(1)));
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [gameState, shiftMode, handleTimeout]);

  const handleSelectSection = useCallback((section: ThoughtSection) => {
    soundEngine.playScan();
    setSelectedSectionId(section.id);
    setShuffledOptions(shuffleOptions(section.options));
  }, []);

  const handleCancelSelection = useCallback(() => {
    soundEngine.playScan();
    setSelectedSectionId(null);
    setShuffledOptions([]);
  }, []);

  const handleSelectOption = useCallback(
    (option: ThoughtOption) => {
      const scenario = SPACE_SCENARIOS[scenarioIndex];
      const activeSection = scenario.sections.find((s) => s.id === selectedSectionId);
      if (!activeSection) return;

      const elapsed =
        shiftMode === 'timed'
          ? Math.max(1, Number((scenario.timerSeconds - timeLeft).toFixed(1)))
          : Math.max(1, Number(((Date.now() - roundStartRef.current) / 1000).toFixed(1)));

      const isSuccess = activeSection.isFlawed && option.isCorrect;
      const wasSoundSectionCorrupted = !activeSection.isFlawed;

      if (isSuccess) {
        soundEngine.playSuccess();
        const speedBonus =
          shiftMode === 'timed' ? Math.round(timeLeft * 8) : 100;
        const pointsEarned = 250 + speedBonus;
        setScore((prev) => prev + pointsEarned);
        setIntegrity((prev) => Math.min(100, prev + 5));

        const outcome: RoundOutcome = {
          scenarioId: scenario.id,
          title: scenario.title,
          scienceTakeaway: scenario.scienceTakeaway,
          isSuccess: true,
          wasSoundSectionCorrupted: false,
          isTimeout: false,
          headline: option.outcomeHeadline,
          detail: option.outcomeDetail,
          pointsEarned,
          responseTimeSeconds: elapsed,
        };
        setLatestOutcome(outcome);
        setHistory((prev) => [...prev, outcome]);
      } else {
        soundEngine.playFailure();
        setShakeTrigger((prev) => prev + 1);
        setIntegrity((prev) => Math.max(0, prev - 35));

        const outcome: RoundOutcome = {
          scenarioId: scenario.id,
          title: scenario.title,
          scienceTakeaway: scenario.scienceTakeaway,
          isSuccess: false,
          wasSoundSectionCorrupted,
          isTimeout: false,
          headline: option.outcomeHeadline,
          detail: option.outcomeDetail,
          pointsEarned: 0,
          responseTimeSeconds: elapsed,
        };
        setLatestOutcome(outcome);
        setHistory((prev) => [...prev, outcome]);
      }

      setGameState('ROUND_SUMMARY');
    },
    [scenarioIndex, selectedSectionId, shiftMode, timeLeft]
  );

  const handleContinueAfterRound = useCallback(() => {
    if (integrity <= 0) {
      setGameState('GAME_OVER');
      return;
    }
    if (scenarioIndex >= SPACE_SCENARIOS.length - 1) {
      setGameState('VICTORY');
      return;
    }
    const nextIndex = scenarioIndex + 1;
    setScenarioIndex(nextIndex);
    setTimeLeft(SPACE_SCENARIOS[nextIndex].timerSeconds);
    setSelectedSectionId(null);
    setShuffledOptions([]);
    setLatestOutcome(null);
    roundStartRef.current = Date.now();
    setGameState('PLAYING');
    soundEngine.playBubbleAppear();
  }, [integrity, scenarioIndex]);

  // Keyboard Quick-Thinking Shortcuts (1, 2, 3, Escape, Space)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'PLAYING') {
        if (e.key === '1' || e.key === '2' || e.key === '3') {
          const idx = Number(e.key) - 1;
          if (!selectedSectionId) {
            const target = currentScenario.sections[idx];
            if (target) handleSelectSection(target);
          } else {
            const opt = shuffledOptions[idx];
            if (opt) handleSelectOption(opt);
          }
        } else if (e.key === 'Escape' && selectedSectionId) {
          handleCancelSelection();
        } else if (e.key === ' ' || e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setGameState('PAUSED');
        }
      } else if (gameState === 'PAUSED' && (e.key === ' ' || e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        setGameState('PLAYING');
      } else if (gameState === 'ROUND_SUMMARY' && e.key === 'Enter') {
        handleContinueAfterRound();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    currentScenario.sections,
    gameState,
    handleCancelSelection,
    handleContinueAfterRound,
    handleSelectOption,
    handleSelectSection,
    selectedSectionId,
    shuffledOptions,
  ]);

  const atmospherePhase = useMemo(() => {
    if (gameState === 'TITLE_MENU') return 'title';
    if (gameState === 'ROUND_SUMMARY') {
      return latestOutcome?.isSuccess ? 'resolved' : 'failed';
    }
    if (gameState === 'GAME_OVER') return 'failed';
    if (gameState === 'VICTORY') return 'resolved';
    return 'playing';
  }, [gameState, latestOutcome]);

  const astronautMood = useMemo(() => {
    if (gameState === 'ROUND_SUMMARY') {
      return latestOutcome?.isSuccess ? 'aha' : 'alarmed';
    }
    if (gameState === 'GAME_OVER') return 'alarmed';
    if (gameState === 'VICTORY') return 'aha';
    return 'thinking';
  }, [gameState, latestOutcome]);

  const integrityLabel =
    integrity >= 70 ? 'NOMINAL' : integrity >= 40 ? 'DAMAGED' : 'CRITICAL';
  const integrityColor =
    integrity >= 70
      ? 'text-teal-300'
      : integrity >= 40
      ? 'text-amber-300'
      : 'text-rose-400';

  const solvedCount = history.filter((h) => h.isSuccess).length;
  const avgResponse =
    history.length > 0
      ? (
          history.reduce((acc, h) => acc + h.responseTimeSeconds, 0) /
          history.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="min-h-screen flex flex-col bg-[#060911] text-slate-100">
      {/* Compact 3-Zone Top Bar */}
      <header className="relative z-30 flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3 border-b border-slate-800/80 bg-[#080d18]/90 backdrop-blur-md">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-4 min-w-0">
          <span className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            Orbital Fourth
          </span>
          {(gameState === 'PLAYING' ||
            gameState === 'PAUSED' ||
            gameState === 'ROUND_SUMMARY') && (
            <span className="hidden sm:inline text-xs text-slate-400 truncate">
              Event {scenarioIndex + 1} of {SPACE_SCENARIOS.length} ·{' '}
              <span className="text-slate-200">{currentScenario.title}</span>
            </span>
          )}
        </div>

        {/* Zone 2: Real-Time Station & Quick-Thinking Meters */}
        {(gameState === 'PLAYING' ||
          gameState === 'PAUSED' ||
          gameState === 'ROUND_SUMMARY') && (
          <div className="flex items-center gap-4 md:gap-6 text-xs">
            <div className="flex items-center gap-2 whitespace-nowrap">
              {integrity >= 70 ? (
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="text-slate-400 hidden md:inline">Integrity</span>
              <span className={`font-mono-tabular font-semibold ${integrityColor}`}>
                {integrity}% · {integrityLabel}
              </span>
            </div>

            {shiftMode === 'timed' && (
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Timer
                  className={`w-4 h-4 shrink-0 ${
                    timeLeft <= 10 ? 'text-rose-400' : 'text-cyan-300'
                  }`}
                />
                <span
                  className={`font-mono-tabular font-semibold ${
                    timeLeft <= 10 ? 'text-rose-300' : 'text-slate-100'
                  }`}
                >
                  {timeLeft.toFixed(1)}s
                </span>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-slate-400">Score</span>
              <span className="font-mono-tabular font-semibold text-cyan-200">
                {score} pts
              </span>
            </div>
          </div>
        )}

        {/* Zone 3: Audio & Pause Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-700/70 bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
            <button
              type="button"
              onClick={() =>
                setGameState((prev) => (prev === 'PLAYING' ? 'PAUSED' : 'PLAYING'))
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700/70 bg-slate-900/70 hover:bg-slate-800 text-xs font-medium text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap cursor-pointer"
            >
              {gameState === 'PAUSED' ? (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Interactive Space Station Stage */}
      <main className="relative flex-1 flex flex-col justify-between overflow-hidden min-h-[680px]">
        {/* Background Station Corridor & 4D Atmospheric Effects */}
        <div className="absolute inset-0 z-0">
          <StationAtmosphere
            crisisEffect={
              gameState === 'TITLE_MENU' ? null : currentScenario.crisisEffect
            }
            phase={atmospherePhase}
            shakeTrigger={shakeTrigger}
          />
        </div>

        {/* STATE 1: TITLE MENU */}
        {gameState === 'TITLE_MENU' && (
          <div className="relative z-20 flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 rounded-3xl border border-cyan-300/25 bg-[#080f1d]/85 backdrop-blur-xl shadow-[0_28px_72px_rgba(2,6,23,0.85)] p-7 md:p-9">
                <p className="text-xs font-medium text-cyan-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unseen 4D Perspective · Space Science & Quick Thinking</span>
                </p>

                <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 text-balance">
                  Guide the crew from the fourth dimension.
                </h1>

                <p className="text-sm md:text-base leading-relaxed text-slate-300 mb-6 max-w-2xl">
                  The astronauts aboard Station Aura cannot perceive you. Whenever an
                  orbital crisis hits, their plans appear as floating thought bubbles—each
                  containing one dangerous scientific misconception. Spot the flaw and
                  reshape their thinking before disaster strikes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-3.5">
                    <p className="text-xs font-semibold text-cyan-200 mb-1">
                      01. Read Their Minds
                    </p>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Each thought bubble splits into 3 reasoning sections rising from the
                      floating crew.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-3.5">
                    <p className="text-xs font-semibold text-cyan-200 mb-1">
                      02. Spot the Flaw
                    </p>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Click the section with faulty space physics. Picking a sound section
                      forces risky alterations!
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-900/65 p-3.5">
                    <p className="text-xs font-semibold text-cyan-200 mb-1">
                      03. Weave the Fix
                    </p>
                    <p className="text-xs leading-relaxed text-slate-300">
                      Choose 1 of 3 options to correct their plan—or accidentally make
                      matters worse.
                    </p>
                  </div>
                </div>

                {/* Shift Mode Selector + Primary CTA */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/90">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-700/70">
                    <button
                      type="button"
                      onClick={() => setShiftMode('timed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        shiftMode === 'timed'
                          ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Quick Thinking (45s)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShiftMode('relaxed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        shiftMode === 'relaxed'
                          ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/40'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Relaxed Study
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={startMission}
                    className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-colors shadow-[0_0_28px_rgba(56,189,248,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 whitespace-nowrap cursor-pointer"
                  >
                    Start Mission
                  </button>
                </div>
              </div>

              {/* Ambient Floating Astronaut Preview */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center">
                <AstronautSprite
                  astronaut={SPACE_SCENARIOS[0].astronauts[0]}
                  mood="thinking"
                  variant="a"
                  isHighlighted
                />
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: ACTIVE PLAY / PAUSED / ROUND SUMMARY */}
        {(gameState === 'PLAYING' ||
          gameState === 'PAUSED' ||
          gameState === 'ROUND_SUMMARY') && (
          <div className="relative z-20 flex-1 flex flex-col justify-between px-4 md:px-8 py-4 md:py-5 max-w-6xl w-full mx-auto">
            {/* Crisis Event Disaster Banner */}
            <div className="rounded-2xl border border-amber-400/55 bg-[#090e1b]/92 backdrop-blur-xl px-5 sm:px-6 py-4 shadow-[0_16px_48px_rgba(2,6,23,0.85),0_0_30px_rgba(245,158,11,0.14)]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">
                    {currentScenario.sector} · Crisis Active
                  </span>
                </div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-amber-200">
                  {currentScenario.title}
                </h2>
              </div>
              <p className="font-display text-base sm:text-lg md:text-[22px] font-bold text-white leading-snug tracking-tight">
                {currentScenario.eventSummary}
              </p>
            </div>

            {/* Middle Zone: Pop-Up Thought Bubble (or Round Result) */}
            <div className="my-auto py-3">
              {gameState === 'ROUND_SUMMARY' && latestOutcome ? (
                <DecisionCutscene
                  crisisEffect={currentScenario.crisisEffect}
                  isSuccess={latestOutcome.isSuccess}
                  wasSoundSectionCorrupted={latestOutcome.wasSoundSectionCorrupted}
                  isTimeout={latestOutcome.isTimeout}
                  headline={latestOutcome.headline}
                  detail={latestOutcome.detail}
                  scienceTakeaway={latestOutcome.scienceTakeaway}
                  pointsEarned={latestOutcome.pointsEarned}
                  isLastEvent={scenarioIndex >= SPACE_SCENARIOS.length - 1}
                  isGameOver={integrity <= 0}
                  onAdvance={handleContinueAfterRound}
                />
              ) : (
                <ThoughtBubble
                  sections={currentScenario.sections}
                  astronauts={currentScenario.astronauts}
                  selectedSectionId={selectedSectionId}
                  shuffledOptions={shuffledOptions}
                  onSelectSection={handleSelectSection}
                  onSelectOption={handleSelectOption}
                  onCancelSelection={handleCancelSelection}
                  disabled={gameState === 'PAUSED'}
                />
              )}
            </div>

            {/* Lower Deck: Animated Floating Astronaut(s) inside the Station */}
            <div
              className={`flex items-end pb-1 ${
                currentScenario.astronauts.length > 1
                  ? 'justify-around px-4 md:px-20'
                  : 'justify-center'
              }`}
            >
              {currentScenario.astronauts.map((astro, idx) => (
                <AstronautSprite
                  key={astro.id}
                  astronaut={astro}
                  mood={astronautMood}
                  variant={idx === 0 ? 'a' : 'b'}
                  isHighlighted={
                    selectedSectionId !== null &&
                    currentScenario.sections.find((s) => s.id === selectedSectionId)
                      ?.astronautId === astro.id
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* PAUSED OVERLAY */}
        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 z-30 bg-[#04070e]/75 backdrop-blur-md flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-700/80 bg-[#0b1322]/95 p-7 text-center shadow-2xl">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                4D Time Frozen
              </h2>
              <p className="text-sm text-slate-300 mb-6">
                The astronauts remain suspended in microgravity until you resume observation.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setGameState('PLAYING')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Resume
                </button>
                <button
                  type="button"
                  onClick={startMission}
                  className="px-5 py-2.5 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-200 font-medium text-sm transition-colors cursor-pointer"
                >
                  Restart Mission
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: VICTORY OR GAME OVER SUMMARY */}
        {(gameState === 'VICTORY' || gameState === 'GAME_OVER') && (
          <div className="relative z-20 flex-1 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-3xl rounded-3xl border border-slate-700/80 bg-[#080f1d]/90 backdrop-blur-xl shadow-[0_24px_64px_rgba(2,6,23,0.9)] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <p
                    className={`text-xs font-semibold mb-1 ${
                      gameState === 'VICTORY' ? 'text-teal-300' : 'text-rose-400'
                    }`}
                  >
                    {gameState === 'VICTORY'
                      ? 'Orbital Shift Complete · Crew Unaware of Your Aid'
                      : 'Station Integrity Lost · Emergency Evacuation'}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
                    {gameState === 'VICTORY'
                      ? 'Station Aura Stabilized'
                      : 'Critical Systems Compromised'}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={startMission}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>

              {/* Mission Performance Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-3.5">
                  <p className="text-xs text-slate-400">Final Score</p>
                  <p className="font-mono-tabular text-xl font-bold text-cyan-200 mt-0.5">
                    {score}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-3.5">
                  <p className="text-xs text-slate-400">Events Solved</p>
                  <p className="font-mono-tabular text-xl font-bold text-teal-300 mt-0.5">
                    {solvedCount} / {history.length}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-3.5">
                  <p className="text-xs text-slate-400">Hull Integrity</p>
                  <p className={`font-mono-tabular text-xl font-bold mt-0.5 ${integrityColor}`}>
                    {integrity}%
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/65 p-3.5">
                  <p className="text-xs text-slate-400">Avg Reaction</p>
                  <p className="font-mono-tabular text-xl font-bold text-slate-100 mt-0.5">
                    {avgResponse}s
                  </p>
                </div>
              </div>

              {/* Science Debrief Log */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item.scenarioId}
                    className="rounded-2xl border border-slate-800/90 bg-slate-950/60 px-4 py-3 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white">
                        {item.title}
                      </span>
                      <span
                        className={`text-xs font-medium whitespace-nowrap ${
                          item.isSuccess ? 'text-teal-300' : 'text-rose-300'
                        }`}
                      >
                        {item.isSuccess ? 'Corrected' : 'Compromised'} ·{' '}
                        <span className="font-mono-tabular">
                          {item.responseTimeSeconds.toFixed(1)}s
                        </span>
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">
                      {item.scienceTakeaway}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
