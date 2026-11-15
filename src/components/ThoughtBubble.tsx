import React from 'react';
import { ArrowLeft, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import { AstronautProfile, ThoughtOption, ThoughtSection } from '../data/scenarios';

interface ThoughtBubbleProps {
  sections: [ThoughtSection, ThoughtSection, ThoughtSection];
  astronauts: AstronautProfile[];
  selectedSectionId: string | null;
  shuffledOptions: ThoughtOption[];
  onSelectSection: (section: ThoughtSection) => void;
  onSelectOption: (option: ThoughtOption) => void;
  onCancelSelection: () => void;
  disabled?: boolean;
}

export const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({
  sections,
  astronauts,
  selectedSectionId,
  shuffledOptions,
  onSelectSection,
  onSelectOption,
  onCancelSelection,
  disabled = false,
}) => {
  const activeSection = sections.find((s) => s.id === selectedSectionId) || null;
  const isTwoCrew = astronauts.length > 1;

  const getAstronautById = (id: string) =>
    astronauts.find((a) => a.id === id) || astronauts[0];

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Main Ethereal Pop-Up Thought Bubble */}
      <div className="relative rounded-3xl border border-cyan-300/30 bg-[#0b1322]/85 backdrop-blur-xl shadow-[0_24px_64px_rgba(3,7,18,0.82),0_0_40px_rgba(56,189,248,0.12)] p-5 md:p-6 transition-all duration-200">
        {/* Subtle 4D Corner Brackets */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-2xl border border-cyan-200/10"
        />

        {!activeSection ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  4D Mind Scan · Select the flawed section in their reasoning
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono-tabular">
                Keys 1–3
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sections.map((section, idx) => {
                const speaker = getAstronautById(section.astronautId);
                return (
                  <button
                    key={section.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelectSection(section)}
                    className="group relative text-left rounded-2xl border border-slate-700/70 bg-slate-900/75 hover:bg-slate-800/85 hover:border-cyan-400/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 p-4 transition-all duration-150 flex flex-col justify-between min-h-[144px] cursor-pointer disabled:opacity-50"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-cyan-200/90">
                          {idx + 1}. {section.label}
                        </span>
                        <span
                          aria-hidden="true"
                          className="w-2 h-2 rounded-full transition-transform duration-150 group-hover:scale-125"
                          style={{ backgroundColor: speaker.suitTrim }}
                        />
                      </div>

                      <p className="text-sm leading-relaxed text-slate-100/95">
                        “{section.statement}”
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate">{speaker.name}</span>
                      <span className="text-cyan-300 opacity-80 group-hover:opacity-100 whitespace-nowrap ml-2">
                        Inspect →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* 4D Thought Reweave: 3 Replacement Options */
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <button
                type="button"
                onClick={onCancelSelection}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg px-2 py-1 -ml-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Scan another section (Esc)</span>
              </button>

              <span className="text-xs text-cyan-300 font-medium">
                Rewriting: {activeSection.label}
              </span>
            </div>

            {/* Selected Original Thought Echo */}
            <div className="mb-4 rounded-xl border border-slate-700/60 bg-slate-950/60 px-4 py-3">
              <p className="text-xs text-slate-400 mb-1">
                {getAstronautById(activeSection.astronautId).name} currently thinks:
              </p>
              <p className="text-sm text-slate-200 italic">
                “{activeSection.statement}”
              </p>
            </div>

            <p className="text-xs text-slate-300 mb-3">
              Choose one thought to weave into their mind (keys 1–3):
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {shuffledOptions.map((opt, idx) => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectOption(opt)}
                  className="group text-left rounded-xl border border-slate-700/75 bg-slate-900/80 hover:bg-cyan-950/45 hover:border-cyan-400/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 px-4 py-3.5 transition-all duration-150 flex items-start gap-3 cursor-pointer disabled:opacity-50"
                >
                  <span className="font-mono-tabular text-xs font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-400/30 rounded-md w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-snug text-slate-100 group-hover:text-white">
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Thought-Bubble Originating Orbs Connecting Bubble to Floating Astronaut(s) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none flex ${
          isTwoCrew ? 'justify-between px-16 md:px-28' : 'justify-center'
        } mt-1.5`}
      >
        <div className="flex flex-col items-center gap-1.5">
          <span
            className="w-4 h-4 rounded-full border border-cyan-300/45 bg-[#0b1322]/90 shadow-[0_0_12px_rgba(56,189,248,0.35)] animate-thought-orb"
            style={{ animationDelay: '0s' }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full border border-cyan-300/40 bg-[#0b1322]/90 animate-thought-orb"
            style={{ animationDelay: '0.35s' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-cyan-300/65 animate-thought-orb"
            style={{ animationDelay: '0.7s' }}
          />
        </div>

        {isTwoCrew && (
          <div className="flex flex-col items-center gap-1.5">
            <span
              className="w-4 h-4 rounded-full border border-teal-300/45 bg-[#0b1322]/90 shadow-[0_0_12px_rgba(45,212,191,0.35)] animate-thought-orb"
              style={{ animationDelay: '0.25s' }}
            />
            <span
              className="w-2.5 h-2.5 rounded-full border border-teal-300/40 bg-[#0b1322]/90 animate-thought-orb"
              style={{ animationDelay: '0.6s' }}
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-teal-300/65 animate-thought-orb"
              style={{ animationDelay: '0.95s' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface OutcomeBannerProps {
  isSuccess: boolean;
  wasSoundSectionCorrupted: boolean;
  isTimeout: boolean;
  headline: string;
  detail: string;
  scienceTakeaway: string;
  pointsEarned: number;
  isLastEvent: boolean;
  isGameOver: boolean;
  onContinue: () => void;
}

export const OutcomeBanner: React.FC<OutcomeBannerProps> = ({
  isSuccess,
  wasSoundSectionCorrupted,
  isTimeout,
  headline,
  detail,
  scienceTakeaway,
  pointsEarned,
  isLastEvent,
  isGameOver,
  onContinue,
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl border border-slate-700/80 bg-[#09101d]/92 backdrop-blur-xl shadow-[0_24px_64px_rgba(2,6,23,0.9)] p-6">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2.5">
          {isSuccess ? (
            <CheckCircle2 className="w-6 h-6 text-teal-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <div>
            <p className="text-xs font-medium text-slate-400">
              {isSuccess
                ? '4D Intervention Successful'
                : isTimeout
                ? 'Time Expired · Uncorrected Plan Executed'
                : wasSoundSectionCorrupted
                ? 'Sound Premise Altered · Reasoning Corrupted'
                : 'Misconception Injected · Station Damaged'}
            </p>
            <h3 className="text-xl font-semibold text-white">{headline}</h3>
          </div>
        </div>

        <span
          className={`font-mono-tabular text-sm font-semibold whitespace-nowrap ${
            isSuccess ? 'text-teal-300' : 'text-rose-300'
          }`}
        >
          {isSuccess ? `+${pointsEarned} pts` : '-35% Integrity'}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-200 mb-4">{detail}</p>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-950/25 px-4 py-3 mb-5">
        <p className="text-xs font-semibold text-cyan-300 mb-1">
          Space Science Principle
        </p>
        <p className="text-sm leading-relaxed text-slate-200">
          {scienceTakeaway}
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 whitespace-nowrap cursor-pointer"
        >
          {isGameOver
            ? 'View Mission Debrief'
            : isLastEvent
            ? 'Complete Shift'
            : 'Next Crisis Event →'}
        </button>
      </div>
    </div>
  );
};
