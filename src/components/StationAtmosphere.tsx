import React, { useEffect, useRef, useState } from 'react';
import { CrisisEffectType } from '../data/scenarios';

interface StationAtmosphereProps {
  crisisEffect: CrisisEffectType | null;
  phase: 'title' | 'playing' | 'resolved' | 'failed';
  shakeTrigger: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  hue: number;
  phase: number;
}

export const StationAtmosphere: React.FC<StationAtmosphereProps> = ({
  crisisEffect,
  phase,
  shakeTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imgError, setImgError] = useState(false);
  const [pointer, setPointer] = useState<{ x: number; y: number; active: boolean }>({
    x: 0.5,
    y: 0.5,
    active: false,
  });

  // Canvas 4D ethereal dust motes & subtle cosmic shimmer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random() * (width || 1280),
      y: Math.random() * (height || 720),
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.1 - Math.random() * 0.25,
      radius: 0.9 + Math.random() * 2.1,
      alpha: 0.18 + Math.random() * 0.42,
      hue: i % 3 === 0 ? 188 : i % 3 === 1 ? 164 : 205,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw gentle drifting 4D motes
      for (const p of particles) {
        if (!prefersReduced) {
          p.x += p.vx + Math.sin(t + p.phase) * 0.12;
          p.y += p.vy;
          if (p.y < -10) p.y = height + 10;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
        }

        const glowAlpha = p.alpha * (0.65 + 0.35 * Math.sin(t * 1.8 + p.phase));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4.5);
        const hue =
          phase === 'failed' ? 8 : phase === 'resolved' ? 162 : p.hue;
        grad.addColorStop(0, `hsla(${hue}, 92%, 75%, ${glowAlpha})`);
        grad.addColorStop(1, `hsla(${hue}, 92%, 60%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [phase]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setPointer((prev) => ({ ...prev, active: false }));
  };

  // Subtle parallax offset for the station backdrop so the 4D perspective feels alive
  const parallaxX = pointer.active ? (pointer.x - 0.5) * -14 : 0;
  const parallaxY = pointer.active ? (pointer.y - 0.5) * -9 : 0;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      key={shakeTrigger}
      className={`relative w-full h-full overflow-hidden select-none ${
        shakeTrigger > 0 && phase === 'failed' ? 'animate-station-shake' : ''
      }`}
    >
      {/* Space Station Interior Backdrop */}
      <div
        className="absolute inset-[-18px] transition-transform duration-300 ease-out will-change-transform"
        style={{
          transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0) scale(1.03)`,
        }}
      >
        {!imgError ? (
          <img
            src="/assets/aistudio/image_8d115ddf.png"
            alt="Futuristic space station interior corridor with starfield viewport, glowing overhead panels, pipes, and control consoles"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center brightness-[0.82] contrast-[1.08]"
          />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_#1b2634_0%,_#0b111c_65%,_#05070d_100%)]" />
        )}
      </div>

      {/* Mysterious 4D Ethereal Vignette & Lighting Wash */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          phase === 'resolved'
            ? 'bg-[radial-gradient(circle_at_50%_45%,rgba(45,212,191,0.16),rgba(6,9,17,0.72)_78%)]'
            : phase === 'failed'
            ? 'bg-[radial-gradient(circle_at_50%_45%,rgba(239,68,68,0.24),rgba(6,9,17,0.78)_78%)]'
            : 'bg-[radial-gradient(circle_at_50%_42%,rgba(56,189,248,0.08),rgba(6,9,17,0.68)_78%)]'
        }`}
      />

      {/* Bottom Floor Contrast Scrim for HUD & Panels */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#060911]/90 via-transparent to-[#060911]/65" />

      {/* Crisis-Specific Spatial Phenomena anchored to the station deck */}
      {phase === 'playing' && crisisEffect === 'zero_g_fire' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[28%] top-[43%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-sky-400/35 blur-xl animate-flame-orb" />
            <div className="w-9 h-9 rounded-full bg-[radial-gradient(circle,#fef08a_15%,#38bdf8_65%,transparent_100%)] animate-flame-orb shadow-[0_0_24px_rgba(56,189,248,0.8)]" />
          </div>
        </div>
      )}

      {phase === 'playing' && crisisEffect === 'hull_leak' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[24%] top-[62%]"
        >
          <div className="relative w-28 h-16">
            <div className="absolute right-0 top-1/2 w-2.5 h-2.5 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,0.95)]" />
            <div className="absolute right-3 top-4 w-2 h-2 rounded-full bg-cyan-200/70 animate-air-stream" />
            <div
              className="absolute right-4 top-7 w-1.5 h-1.5 rounded-full bg-sky-100/70 animate-air-stream"
              style={{ animationDelay: '0.45s' }}
            />
            <div
              className="absolute right-2 top-9 w-2 h-2 rounded-full bg-cyan-300/60 animate-air-stream"
              style={{ animationDelay: '0.9s' }}
            />
          </div>
        </div>
      )}

      {phase === 'playing' && crisisEffect === 'solar_storm' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[44%] top-[34%] w-[26%] h-[32%] overflow-hidden rounded-3xl"
        >
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent rotate-[34deg] animate-solar-streak" />
          <div
            className="w-32 h-0.5 mt-8 bg-gradient-to-r from-transparent via-emerald-300 to-transparent rotate-[34deg] animate-solar-streak"
            style={{ animationDelay: '0.6s' }}
          />
          <div
            className="w-20 h-0.5 mt-14 ml-12 bg-gradient-to-r from-transparent via-amber-200 to-transparent rotate-[34deg] animate-solar-streak"
            style={{ animationDelay: '1.1s' }}
          />
        </div>
      )}

      {phase === 'playing' && crisisEffect === 'debris_alert' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[52%] top-[46%] -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-36 h-36 rounded-full border border-rose-400/40 animate-ping opacity-30" />
          <div className="absolute inset-4 rounded-full border border-dashed border-amber-300/50 animate-ethereal-shimmer" />
        </div>
      )}

      {phase === 'playing' && crisisEffect === 'thermal_spike' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(249,115,22,0.22),transparent_55%)] animate-pulse"
        />
      )}

      {phase === 'playing' && crisisEffect === 'eva_tether' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[48%] top-[42%] w-24 h-24 rounded-full border border-cyan-300/25 animate-ethereal-shimmer"
        />
      )}

      {/* Drifting 4D Phase Motes Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
      />

      {/* Ethereal 4D Observer Cursor Reticle (unseen by astronauts) */}
      {pointer.active && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-16 h-16 transition-opacity duration-200"
          style={{
            left: `${pointer.x * 100}%`,
            top: `${pointer.y * 100}%`,
            transform: 'translate3d(-50%, -50%, 0)',
          }}
        >
          <div className="w-full h-full rounded-full border border-cyan-300/30 shadow-[0_0_25px_rgba(56,189,248,0.22)] flex items-center justify-center">
            <div className="w-8 h-8 border border-teal-200/35 rotate-45 animate-ethereal-shimmer" />
          </div>
        </div>
      )}
    </div>
  );
};
