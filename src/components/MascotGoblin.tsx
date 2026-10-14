import React from 'react';
import { MascotState } from '../lib/types';

interface MascotGoblinProps {
  state: MascotState;
  size?: number;
  className?: string;
  showStatusBadge?: boolean;
  stickerText?: string;
}

export const MascotGoblin: React.FC<MascotGoblinProps> = ({
  state,
  size = 130,
  className = '',
  showStatusBadge = true,
  stickerText,
}) => {
  // Comic sticker bubble callouts matching the reference illustration
  const stickerCallouts: Record<MascotState, { callout: string; mood: string; badgeBg: string; badgeText: string }> = {
    idle: {
      callout: 'HAI!',
      mood: 'Standing by for chaos',
      badgeBg: 'bg-[#CCFF00]',
      badgeText: 'text-[#121118]',
    },
    thinking: {
      callout: 'CALCULATING...',
      mood: 'Calibrating subtext & aura',
      badgeBg: 'bg-[#FFBE3D]',
      badgeText: 'text-[#121118]',
    },
    success: {
      callout: 'TOLD YOU!!',
      mood: 'Devastatingly calibrated!',
      badgeBg: 'bg-[#CCFF00]',
      badgeText: 'text-[#121118]',
    },
    copied: {
      callout: 'COPIED!!',
      mood: 'Copied! Ready to deploy',
      badgeBg: 'bg-[#C084FC]',
      badgeText: 'text-[#121118]',
    },
    sensitive: {
      callout: 'WITH CARE 🕊️',
      mood: 'Safe de-escalation mode',
      badgeBg: 'bg-[#E5E7EB]',
      badgeText: 'text-[#121118]',
    },
    error: {
      callout: 'WAT?!',
      mood: 'Goblin brain hiccup',
      badgeBg: 'bg-[#FF5555]',
      badgeText: 'text-white',
    },
  };

  const current = stickerCallouts[state];
  const activeCallout = stickerText || current.callout;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <style>{`
        @keyframes floatBouncy {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes goblinThinkingPulse {
          0%, 100% {
            transform: scale(1) translateY(0px) rotate(0deg);
            filter: drop-shadow(0 0 2px rgba(204, 255, 0, 0.2));
          }
          50% {
            transform: scale(1.06) translateY(-5px) rotate(-2deg);
            filter: drop-shadow(0 0 16px rgba(204, 255, 0, 0.55));
          }
        }
        @keyframes thinkRingExpand {
          0% {
            transform: scale(0.8);
            opacity: 0.7;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }
        @keyframes thinkSparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes stickerThinkingPulse {
          0%, 100% { transform: rotate(6deg) scale(1); }
          50% { transform: rotate(8deg) scale(1.08); }
        }
        @keyframes armWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-18deg); }
        }
        @keyframes kickLeg {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-10px) rotate(8deg); }
          60% { transform: translateY(2px) scale(0.95, 1.05); }
        }

        .anim-idle {
          animation: floatBouncy 3.2s ease-in-out infinite;
        }
        .anim-thinking {
          animation: goblinThinkingPulse 1.1s ease-in-out infinite;
        }
        .anim-thinking .goblin-arm {
          transform-origin: 90px 48px;
          animation: armWave 0.55s ease-in-out infinite alternate;
        }
        .anim-thinking-ring {
          animation: thinkRingExpand 1.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        .anim-thinking-sparkle {
          animation: thinkSparkle 0.8s ease-in-out infinite alternate;
        }
        .anim-thinking-sticker {
          animation: stickerThinkingPulse 1.1s ease-in-out infinite;
        }
        .anim-success {
          animation: floatBouncy 2.2s ease-in-out infinite;
        }
        .anim-copied {
          animation: kickLeg 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        .anim-error {
          animation: floatBouncy 0.9s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .anim-idle, .anim-thinking, .anim-thinking-ring, .anim-thinking-sparkle, .anim-thinking-sticker, .anim-success, .anim-copied, .anim-error, .goblin-arm {
            animation: none !important;
          }
        }
      `}</style>

      {/* Main Character SVG Frame */}
      <div className={`relative ${state === 'thinking' ? 'anim-thinking' : `anim-${state}`}`}>
        {/* Subtle playful pulsing radar aura behind goblin during generation */}
        {state === 'thinking' && (
          <div className="absolute inset-0 -m-3 pointer-events-none flex items-center justify-center">
            <div className="w-full h-full rounded-full border-2 border-[#CCFF00] bg-[#CCFF00]/10 anim-thinking-ring" />
          </div>
        )}

        {/* Floating Comic Speech Bubble Sticker */}
        <div
          className={`absolute -top-3 -right-4 z-20 pointer-events-none transform rotate-6 animate-in zoom-in-75 duration-200 ${
            state === 'thinking' ? 'anim-thinking-sticker' : ''
          }`}
        >
          <div className="bg-[#121118] text-[#CCFF00] font-black text-xs md:text-sm px-2.5 py-1 rounded-full border-2 border-[#CCFF00] shadow-[3px_3px_0px_#000000] tracking-wider uppercase flex items-center gap-1">
            <span>{activeCallout}</span>
            <div className="absolute -bottom-1.5 left-3 w-2.5 h-2.5 bg-[#121118] border-r-2 border-b-2 border-[#CCFF00] rotate-45" />
          </div>
        </div>

        {/* Character SVG modeled directly after the Neon Stickers visual */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible drop-shadow-[4px_6px_0px_#000000]"
          role="img"
          aria-label={`Neon Sticker Goblin in ${state} mood`}
        >
          {/* Action sparkles / neon aura lines in the background */}
          <path
            d="M16 35 L10 32"
            stroke="#CCFF00"
            strokeWidth="3"
            strokeLinecap="round"
            className={state === 'thinking' ? 'anim-thinking-sparkle' : ''}
          />
          <path
            d="M22 24 L18 16"
            stroke="#CCFF00"
            strokeWidth="3"
            strokeLinecap="round"
            className={state === 'thinking' ? 'anim-thinking-sparkle' : ''}
          />
          <path
            d="M98 22 L106 17"
            stroke="#CCFF00"
            strokeWidth="3"
            strokeLinecap="round"
            className={state === 'thinking' ? 'anim-thinking-sparkle' : ''}
          />
          <path
            d="M104 33 L112 33"
            stroke="#CCFF00"
            strokeWidth="3"
            strokeLinecap="round"
            className={state === 'thinking' ? 'anim-thinking-sparkle' : ''}
          />

          {/* Shadow underneath */}
          <ellipse cx="60" cy="112" rx="38" ry="5" fill="#000000" opacity="0.35" />

          {/* Lilac Hair Fluff Tuft on Head */}
          <path
            d="M52 24 C48 12, 60 8, 62 16 C66 10, 76 12, 70 24 Z"
            fill="#BFA2F8"
            stroke="#121118"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Main Body - Pastel Lilac / Violet with Blobby Organic Shape */}
          <path
            d="M32 46 C24 58, 20 86, 32 100 C44 110, 78 110, 90 98 C102 86, 98 56, 88 44 C78 32, 42 32, 32 46 Z"
            fill="#BFA2F8"
            stroke="#121118"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />

          {/* Inner Neon Lime Face Plate (Signature from Reference) */}
          <path
            d="M38 52 C32 64, 34 82, 42 90 C50 96, 72 96, 80 88 C88 80, 88 62, 82 52 C76 42, 44 42, 38 52 Z"
            fill="#CCFF00"
            stroke="#121118"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Lilac Waving / Action Arm */}
          <path
            className="goblin-arm"
            d="M86 64 C98 62, 108 52, 104 42 C100 36, 92 42, 90 48"
            fill="#BFA2F8"
            stroke="#121118"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Neon Hand / Glove */}
          <circle cx="102" cy="40" r="6" fill="#CCFF00" stroke="#121118" strokeWidth="2.5" />
          <path d="M102 34 L104 31" stroke="#121118" strokeWidth="2" strokeLinecap="round" />
          <path d="M106 37 L110 36" stroke="#121118" strokeWidth="2" strokeLinecap="round" />

          {/* Left Rest / Balancing Hand */}
          <path
            d="M28 68 C20 72, 16 82, 22 88"
            fill="none"
            stroke="#121118"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Eyes & Mouth states matching reference art */}
          {state === 'idle' && (
            <g id="idle-face">
              {/* Left Eye */}
              <circle cx="48" cy="62" r="5" fill="#121118" />
              <circle cx="47" cy="60" r="1.8" fill="#FFFFFF" />
              {/* Right Eye */}
              <circle cx="70" cy="62" r="5" fill="#121118" />
              <circle cx="69" cy="60" r="1.8" fill="#FFFFFF" />
              {/* Cheeky Triangle Nose */}
              <polygon points="59,64 56,70 62,70" fill="#121118" />
              {/* Wide Cartoon Grin */}
              <path
                d="M48 76 Q59 88 70 76"
                fill="#FFFFFF"
                stroke="#121118"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {state === 'thinking' && (
            <g id="thinking-face">
              {/* Squinting sideways eyes */}
              <ellipse cx="48" cy="62" rx="4.5" ry="2.5" fill="#121118" />
              <ellipse cx="70" cy="62" rx="4.5" ry="2.5" fill="#121118" />
              {/* Eyebrows questioning */}
              <line x1="42" y1="55" x2="52" y2="58" stroke="#121118" strokeWidth="3" strokeLinecap="round" />
              <line x1="66" y1="58" x2="76" y2="54" stroke="#121118" strokeWidth="3" strokeLinecap="round" />
              {/* Triangle Nose */}
              <polygon points="59,64 56,70 62,70" fill="#121118" />
              {/* Smirk */}
              <path
                d="M50 78 Q60 81 68 74"
                fill="none"
                stroke="#121118"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {state === 'success' && (
            <g id="success-face">
              {/* Happy closed crescent eyes */}
              <path
                d="M44 64 Q50 56 56 64"
                fill="none"
                stroke="#121118"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <path
                d="M64 64 Q70 56 76 64"
                fill="none"
                stroke="#121118"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Triangle Nose */}
              <polygon points="60,65 57,71 63,71" fill="#121118" />
              {/* Big Joyful Open Laughing Mouth with tongue */}
              <path
                d="M46 75 C46 88, 74 88, 74 75 Z"
                fill="#121118"
                stroke="#121118"
                strokeWidth="2.5"
              />
              <path
                d="M52 82 Q60 78 68 82"
                stroke="#FF6B6B"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          )}

          {state === 'copied' && (
            <g id="copied-face">
              {/* Star Eyes for celebration */}
              <polygon
                points="49,56 51,60 55,61 52,64 53,68 49,66 45,68 46,64 43,61 47,60"
                fill="#121118"
              />
              <polygon
                points="71,56 73,60 77,61 74,64 75,68 71,66 67,68 68,64 65,61 69,60"
                fill="#121118"
              />
              {/* Open grin */}
              <path
                d="M47 75 Q60 90 73 75 Z"
                fill="#FFFFFF"
                stroke="#121118"
                strokeWidth="2.8"
              />
            </g>
          )}

          {state === 'sensitive' && (
            <g id="sensitive-face">
              {/* Gentle, caring oval eyes */}
              <circle cx="48" cy="64" r="4" fill="#121118" />
              <circle cx="70" cy="64" r="4" fill="#121118" />
              <polygon points="59,66 56,71 62,71" fill="#121118" />
              {/* Peaceful small smile */}
              <path
                d="M52 77 Q60 80 68 77"
                fill="none"
                stroke="#121118"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {state === 'error' && (
            <g id="error-face">
              {/* Wobbly/Mismatched "WAT?!" eyes */}
              {/* Left Eye: Cross */}
              <line x1="43" y1="58" x2="53" y2="68" stroke="#121118" strokeWidth="3.2" strokeLinecap="round" />
              <line x1="53" y1="58" x2="43" y2="68" stroke="#121118" strokeWidth="3.2" strokeLinecap="round" />
              {/* Right Eye: Spiral */}
              <circle cx="70" cy="63" r="6" fill="#FFFFFF" stroke="#121118" strokeWidth="2.5" />
              <circle cx="70" cy="63" r="2.8" fill="#FF5555" />
              {/* Triangle Nose */}
              <polygon points="59,65 56,71 62,71" fill="#121118" />
              {/* Squiggly mouth */}
              <path
                d="M47 78 Q53 74 59 79 T71 76"
                fill="none"
                stroke="#121118"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Little Feet */}
          <path
            d="M40 102 C36 108, 44 112, 52 108"
            fill="#BFA2F8"
            stroke="#121118"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M68 102 C74 108, 82 112, 88 106"
            fill="#BFA2F8"
            stroke="#121118"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Mood pill under mascot */}
      {showStatusBadge && (
        <div
          className={`mt-2.5 px-3 py-1 rounded-full text-xs font-black border-2 border-[#121118] shadow-[2.5px_2.5px_0px_#000000] tracking-wide transition-colors duration-200 ${current.badgeBg} ${current.badgeText}`}
        >
          {current.mood}
        </div>
      )}
    </div>
  );
};
