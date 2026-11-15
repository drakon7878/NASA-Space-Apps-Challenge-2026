import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Pause, Play, XCircle } from 'lucide-react';
import { CrisisEffectType } from '../data/scenarios';
import hullBreachImg from '../assets/images/cutscene_hull_breach_1794639140124.jpg';
import zeroGFireImg from '../assets/images/cutscene_zerog_fire_1794639141737.jpg';
import orbitalDebrisImg from '../assets/images/cutscene_orbital_debris_1794639141009.jpg';
import solarStormImg from '../assets/images/cutscene_solar_storm_1794639142870.jpg';
import thermalRadiatorsImg from '../assets/images/cutscene_thermal_radiators_1794639142473.jpg';
import evaRescueImg from '../assets/images/cutscene_eva_rescue_1794639142804.jpg';

interface DecisionCutsceneProps {
  crisisEffect: CrisisEffectType;
  isSuccess: boolean;
  wasSoundSectionCorrupted: boolean;
  isTimeout: boolean;
  headline: string;
  detail: string;
  scienceTakeaway: string;
  pointsEarned: number;
  isLastEvent: boolean;
  isGameOver: boolean;
  onAdvance: () => void;
}

const CUTSCENE_DURATION_MS = 12500;
const STAMP_DELAY_MS = 1400;

const CUTSCENE_MEDIA: Record<
  CrisisEffectType,
  { src: string; alt: string }
> = {
  hull_leak: {
    src: hullBreachImg,
    alt: 'Astronaut inside orbital station corridor sealing a punctured bulkhead wall',
  },
  zero_g_fire: {
    src: zeroGFireImg,
    alt: 'Astronaut floating in microgravity operating a CO2 extinguisher near an avionics rack',
  },
  debris_alert: {
    src: orbitalDebrisImg,
    alt: 'Space station in low Earth orbit firing thrusters to evade streaking orbital debris',
  },
  solar_storm: {
    src: solarStormImg,
    alt: 'Astronaut sheltering inside a blue water-walled radiation core during a solar flare',
  },
  thermal_spike: {
    src: thermalRadiatorsImg,
    alt: 'Orbital space station radiator wings emitting infrared heat above curved Earth horizon',
  },
  eva_tether: {
    src: evaRescueImg,
    alt: 'Astronaut in EVA suit reaching toward station airlock handrail above Earth',
  },
};

interface CinemaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  hue: number;
}

export const DecisionCutscene: React.FC<DecisionCutsceneProps> = ({
  crisisEffect,
  isSuccess,
  wasSoundSectionCorrupted,
  isTimeout,
  headline,
  detail,
  scienceTakeaway,
  pointsEarned,
  isLastEvent,
  isGameOver,
  onAdvance,
}) => {
  const [showStamp, setShowStamp] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const advancedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const triggerAdvance = useCallback(() => {
    if (advancedRef.current) return;
    advancedRef.current = true;
    onAdvance();
  }, [onAdvance]);

  useEffect(() => {
    advancedRef.current = false;
    setShowStamp(false);
    setElapsedMs(0);
    setIsPaused(false);
    setImgFailed(false);

    const stampTimer = window.setTimeout(() => {
      setShowStamp(true);
    }, STAMP_DELAY_MS);

    return () => {
      window.clearTimeout(stampTimer);
    };
  }, [crisisEffect, headline]);

  useEffect(() => {
    if (isPaused) return;

    let lastTick = Date.now();
    const tick = window.setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick;
      lastTick = now;

      setElapsedMs((prev) => {
        const next = Math.min(CUTSCENE_DURATION_MS, prev + delta);
        if (next >= CUTSCENE_DURATION_MS) {
          window.clearInterval(tick);
          triggerAdvance();
        }
        return next;
      });
    }, 50);

    return () => {
      window.clearInterval(tick);
    };
  }, [isPaused, triggerAdvance]);

  const progressPct = Math.min(100, (elapsedMs / CUTSCENE_DURATION_MS) * 100);

  // Full-screen real-time cinema particle & shockwave canvas VFX
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles: CinemaParticle[] = Array.from(
      { length: isSuccess ? 58 : 76 },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: isSuccess
          ? (Math.random() - 0.5) * 0.7
          : (Math.random() - 0.5) * 4.2,
        vy: isSuccess
          ? -0.4 - Math.random() * 1.1
          : (Math.random() - 0.5) * 3.8,
        size: isSuccess ? 1.5 + Math.random() * 2.8 : 1.4 + Math.random() * 3.2,
        life: Math.random() * 120,
        maxLife: 100 + Math.random() * 80,
        hue: isSuccess
          ? Math.random() > 0.4
            ? 172
            : 194
          : Math.random() > 0.35
          ? 12
          : 34,
      })
    );

    let frame = 0;
    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);

      // Expanding ethereal 4D wave ring (Saved) or failure shockwave (Mistake)
      const waveRadius = (frame * 5.5) % (Math.max(width, height) * 0.9);
      const waveAlpha = Math.max(0, 0.24 - waveRadius / (Math.max(width, height) * 2.4));
      ctx.strokeStyle = isSuccess
        ? `rgba(45, 212, 191, ${waveAlpha})`
        : `rgba(244, 63, 94, ${waveAlpha * 1.2})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(width * 0.5, height * 0.46, waveRadius, 0, Math.PI * 2);
      ctx.stroke();

      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx;
          p.y += p.vy;
          p.life += 1;
          if (p.life > p.maxLife || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
            p.x = isSuccess ? Math.random() * width : width * (0.25 + Math.random() * 0.5);
            p.y = isSuccess ? height + 10 : height * (0.25 + Math.random() * 0.5);
            p.life = 0;
          }
        }

        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * (isSuccess ? 0.75 : 0.9);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, `hsla(${p.hue}, 96%, 72%, ${alpha})`);
        grad.addColorStop(1, `hsla(${p.hue}, 96%, 55%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();

        if (!isSuccess) {
          // Sharp spark streak on mistake
          ctx.strokeStyle = `hsla(${p.hue}, 100%, 78%, ${alpha * 0.85})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5);
          ctx.stroke();
        }
      }

      if (!prefersReduced) {
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isSuccess]);

  const media = CUTSCENE_MEDIA[crisisEffect];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isSuccess ? 'Saved cutscene outcome' : 'Mistake cutscene outcome'}
      className="fixed inset-0 z-50 w-screen h-screen bg-[#03050a] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Full-Screen Photorealistic Film Frame with Ken Burns Camera Motion */}
      <div className="absolute inset-0 overflow-hidden">
        {!imgFailed ? (
          <img
            src={media.src}
            alt={media.alt}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className={`w-full h-full object-cover object-center will-change-transform ${
              isSuccess
                ? 'animate-cinema-save brightness-[0.88] contrast-[1.08]'
                : 'animate-cinema-mistake brightness-[0.76] contrast-[1.16] saturate-[1.15]'
            }`}
          />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_#162238_0%,_#060b14_75%)]" />
        )}

        {/* Cinematic Color Grading & Atmospheric Wash */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-700 ${
            isSuccess
              ? 'bg-[radial-gradient(circle_at_50%_45%,rgba(45,212,191,0.14),rgba(3,7,15,0.68)_82%)]'
              : 'bg-[radial-gradient(circle_at_50%_45%,rgba(239,68,68,0.28),rgba(8,3,6,0.78)_82%)]'
          }`}
        />

        {/* Real-Time Canvas VFX Particles & Shockwave */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 w-full h-full"
        />
      </div>

      {/* Top Cinema Letterbox Header */}
      <div className="relative z-10 w-full bg-gradient-to-b from-black/90 via-black/60 to-transparent px-6 sm:px-10 py-5 flex items-center justify-between gap-4">
        <div className="text-xs sm:text-sm font-medium text-slate-200">
          {isSuccess
            ? 'Outcome Sequence · 4D Correction Applied'
            : isTimeout
            ? 'Outcome Sequence · Timer Expired'
            : wasSoundSectionCorrupted
            ? 'Outcome Sequence · Sound Premise Altered'
            : 'Outcome Sequence · Misconception Triggered'}
        </div>

        <span
          className={`font-mono-tabular text-xs sm:text-sm font-semibold ${
            isSuccess ? 'text-teal-300' : 'text-rose-300'
          }`}
        >
          {isSuccess ? `+${pointsEarned} pts · +5% Integrity` : '-35% Integrity'}
        </span>
      </div>

      {/* Centerpiece Cinematic Outcome Stamp: SAVED / MISTAKE */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 pointer-events-none">
        {showStamp && (
          <div
            className={`animate-cutscene-stamp px-10 sm:px-14 py-5 sm:py-6 rounded-3xl border-2 backdrop-blur-md flex flex-col items-center gap-2 shadow-[0_24px_80px_rgba(0,0,0,0.85)] ${
              isSuccess
                ? 'border-teal-300/85 bg-[#051d1b]/75 text-teal-100 shadow-[0_0_80px_rgba(45,212,191,0.38)]'
                : 'border-rose-400/85 bg-[#24060b]/80 text-rose-100 shadow-[0_0_80px_rgba(244,63,94,0.45)]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              {isSuccess ? (
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-teal-300 shrink-0" />
              ) : (
                <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-300 shrink-0" />
              )}
              <span className="font-display text-5xl sm:text-7xl font-bold tracking-[0.14em] uppercase">
                {isSuccess ? 'Saved' : 'Mistake'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-200/90">
              {isSuccess
                ? 'The crew acts on your 4D guidance without ever knowing you were there.'
                : 'Your intervention—or hesitation—forced the crew into danger.'}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Cinema Letterbox Narrative & Next-Level Transition */}
      <div className="relative z-10 w-full bg-gradient-to-t from-black via-black/90 to-transparent px-6 sm:px-10 pt-10 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-end mb-5">
            <div className="lg:col-span-7">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-1.5">
                {headline}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                {detail}
              </p>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-cyan-400/25 bg-slate-950/75 backdrop-blur-md px-4 py-3">
              <p className="text-xs font-semibold text-cyan-300 mb-1">
                Space Science Principle
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
                {scienceTakeaway}
              </p>
            </div>
          </div>

          {/* Transition Progress & Reading Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>
                  {isPaused
                    ? 'Timer paused while reading'
                    : isGameOver
                    ? 'Entering emergency debrief...'
                    : isLastEvent
                    ? 'Finalizing orbital shift...'
                    : 'Advancing to next level...'}
                </span>
                <span className="font-mono-tabular">
                  {Math.max(
                    0,
                    Math.ceil((CUTSCENE_DURATION_MS - elapsedMs) / 1000)
                  )}
                  s
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800/90 overflow-hidden">
                <div
                  className={`h-full transition-all duration-75 ${
                    isSuccess ? 'bg-teal-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-600/80 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={triggerAdvance}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                  isSuccess
                    ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 focus-visible:ring-teal-200'
                    : 'bg-rose-500 hover:bg-rose-400 text-white focus-visible:ring-rose-200'
                }`}
              >
                <span>
                  {isGameOver
                    ? 'View Debrief'
                    : isLastEvent
                    ? 'Complete Shift'
                    : 'Next Level'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
