import React from 'react';
import { AstronautProfile } from '../data/scenarios';

interface AstronautSpriteProps {
  astronaut: AstronautProfile;
  mood: 'thinking' | 'aha' | 'alarmed';
  variant?: 'a' | 'b';
  isHighlighted?: boolean;
}

export const AstronautSprite: React.FC<AstronautSpriteProps> = ({
  astronaut,
  mood,
  variant = 'a',
  isHighlighted = false,
}) => {
  const floatClass = variant === 'a' ? 'animate-float-a' : 'animate-float-b';

  const statusRingColor =
    mood === 'aha'
      ? 'rgba(45, 212, 191, 0.55)'
      : mood === 'alarmed'
      ? 'rgba(248, 113, 113, 0.55)'
      : isHighlighted
      ? 'rgba(56, 189, 248, 0.5)'
      : 'rgba(148, 163, 184, 0.2)';

  return (
    <div className={`relative flex flex-col items-center select-none ${floatClass}`}>
      {/* Ethereal 4D Resonance Aura behind the Astronaut's Helmet */}
      <div
        aria-hidden="true"
        className="absolute -top-3 w-28 h-28 rounded-full blur-xl transition-all duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${statusRingColor} 0%, transparent 72%)`,
        }}
      />

      {/* Articulated Floating Zero-G Astronaut SVG */}
      <svg
        width="134"
        height="162"
        viewBox="0 0 134 162"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`${astronaut.name}, ${astronaut.role}`}
        className="relative drop-shadow-[0_14px_24px_rgba(2,6,23,0.75)]"
      >
        {/* Subtle EVA Tether */}
        <path
          d="M95 104 C118 112, 126 136, 114 156"
          stroke={astronaut.suitTrim}
          strokeOpacity="0.45"
          strokeWidth="2.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {/* Life-Support Backpack */}
        <rect
          x="33"
          y="58"
          width="68"
          height="50"
          rx="14"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="2"
        />
        <rect x="27" y="68" width="8" height="24" rx="4" fill="#334155" />
        <rect x="99" y="68" width="8" height="24" rx="4" fill="#334155" />

        {/* Left & Right Floating Arms */}
        <g
          style={{
            transform: mood === 'aha' ? 'rotate(14deg)' : 'rotate(0deg)',
            transformOrigin: '42px 72px',
            transition: 'transform 300ms ease',
          }}
        >
          <path
            d="M42 70 C24 74, 18 88, 22 102"
            stroke="#E2E8F0"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M42 70 C24 74, 18 88, 22 102"
            stroke="#CBD5E1"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <circle cx="22" cy="103" r="6.5" fill="#334155" stroke={astronaut.suitTrim} strokeWidth="2" />
        </g>

        {/* Right Arm (slightly raised toward helmet when thinking) */}
        <g
          style={{
            transform:
              mood === 'thinking'
                ? 'rotate(-16deg)'
                : mood === 'aha'
                ? 'rotate(-26deg)'
                : 'rotate(6deg)',
            transformOrigin: '92px 72px',
            transition: 'transform 300ms ease',
          }}
        >
          <path
            d="M92 70 C108 66, 114 54, 106 42"
            stroke="#E2E8F0"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M92 70 C108 66, 114 54, 106 42"
            stroke="#CBD5E1"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <circle cx="105" cy="40" r="6.5" fill="#334155" stroke={astronaut.suitTrim} strokeWidth="2" />
        </g>

        {/* Zero-G Floating Legs */}
        <path
          d="M54 110 C50 128, 44 140, 48 150"
          stroke="#E2E8F0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M80 110 C86 126, 94 136, 90 148"
          stroke="#E2E8F0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Boots */}
        <rect x="40" y="144" width="16" height="10" rx="5" fill="#1E293B" stroke={astronaut.suitTrim} strokeWidth="2" />
        <rect x="82" y="142" width="16" height="10" rx="5" fill="#1E293B" stroke={astronaut.suitTrim} strokeWidth="2" />

        {/* Torso Suit */}
        <rect
          x="42"
          y="60"
          width="50"
          height="54"
          rx="18"
          fill="#F1F5F9"
          stroke="#94A3B8"
          strokeWidth="2"
        />
        {/* Suit Trim Stripes */}
        <path d="M44 74 H90" stroke={astronaut.suitTrim} strokeWidth="3.5" />
        {/* Chest Control Module */}
        <rect
          x="53"
          y="79"
          width="28"
          height="20"
          rx="5"
          fill="#0F172A"
          stroke="#475569"
          strokeWidth="1.5"
        />
        <circle cx="61" cy="89" r="3" fill={mood === 'alarmed' ? '#EF4444' : astronaut.suitTrim} />
        <rect x="67" y="86" width="10" height="2.5" rx="1" fill="#94A3B8" />
        <rect x="67" y="91" width="7" height="2.5" rx="1" fill="#64748B" />

        {/* Helmet Shell */}
        <circle
          cx="67"
          cy="38"
          r="26"
          fill="#F8FAFC"
          stroke="#94A3B8"
          strokeWidth="2.5"
        />
        {/* Visor */}
        <rect
          x="47"
          y="22"
          width="40"
          height="30"
          rx="14"
          fill="#09111E"
          stroke={astronaut.suitTrim}
          strokeWidth="2"
        />
        {/* Visor Reflection & Mood Eyes */}
        <path
          d="M52 29 C57 25, 65 25, 71 27"
          stroke={astronaut.visorGlow}
          strokeOpacity="0.55"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {mood === 'thinking' && (
          <g>
            <circle cx="59" cy="38" r="2.2" fill={astronaut.visorGlow} />
            <circle cx="75" cy="38" r="2.2" fill={astronaut.visorGlow} />
            <path d="M63 44 H71" stroke={astronaut.visorGlow} strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round" />
          </g>
        )}
        {mood === 'aha' && (
          <g>
            <path d="M56 38 Q59 34 62 38" stroke="#5EEAD4" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M72 38 Q75 34 78 38" stroke="#5EEAD4" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M62 43 Q67 47 72 43" stroke="#5EEAD4" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
        {mood === 'alarmed' && (
          <g>
            <path d="M56 35 L62 40 M62 35 L56 40" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
            <path d="M72 35 L78 40 M78 35 L72 40" stroke="#FCA5A5" strokeWidth="2" strokeLinecap="round" />
            <circle cx="67" cy="45" r="2.5" stroke="#FCA5A5" strokeWidth="1.8" />
          </g>
        )}

        {/* Helmet Antenna Beacon */}
        <line x1="91" y1="26" x2="97" y2="14" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <circle
          cx="97"
          cy="13"
          r="3"
          fill={mood === 'alarmed' ? '#EF4444' : mood === 'aha' ? '#2DD4BF' : astronaut.suitTrim}
        />
      </svg>

      {/* Clean Unboxed Crew Identity */}
      <div className="mt-1 text-center">
        <p className="text-xs font-semibold tracking-wide text-slate-100 drop-shadow">
          {astronaut.name}
        </p>
        <p className="text-[11px] text-slate-300/80">{astronaut.role}</p>
      </div>
    </div>
  );
};
