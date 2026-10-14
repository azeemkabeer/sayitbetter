import React from 'react';
import { STARTER_SCENARIOS, StarterScenario } from '../lib/constants';

interface StarterPillsProps {
  onSelectScenario: (scenario: StarterScenario) => void;
}

export const StarterPills: React.FC<StarterPillsProps> = ({ onSelectScenario }) => {
  // Matching stickers from reference illustration
  const stickerBadges: Record<string, { sticker: string; color: string; textColor: string }> = {
    donkey_travel: { sticker: 'WHEN?', color: 'bg-[#CCFF00]', textColor: 'text-[#121118]' },
    credit_stealer: { sticker: 'OK BOSS!!', color: 'bg-[#BFA2F8]', textColor: 'text-[#121118]' },
    unsolicited_ted_talk: { sticker: 'WHATEVA!!', color: 'bg-[#FF5588]', textColor: 'text-white' },
    story_lurker: { sticker: 'WAT?!', color: 'bg-[#FFBE3D]', textColor: 'text-[#121118]' },
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-xs font-black uppercase tracking-wider text-[#CCFF00] flex items-center gap-1.5">
          <span>⚡ QUICK STICKER SCENARIOS:</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {STARTER_SCENARIOS.map((item) => {
          const badge = stickerBadges[item.id] || {
            sticker: 'HAI!',
            color: 'bg-[#CCFF00]',
            textColor: 'text-[#121118]',
          };

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectScenario(item)}
              className="cursor-pointer text-left p-3.5 rounded-xl border-2 border-[#383644] bg-[#222129] hover:bg-[#2A2933] shadow-[3px_3px_0px_#000000] hover:shadow-[4px_4px_0px_#CCFF00] hover:border-[#CCFF00] transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] group"
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-[#121118] ${badge.color} ${badge.textColor}`}
                  >
                    {badge.sticker}
                  </span>
                  <span className="text-xs font-black text-white group-hover:text-[#CCFF00] transition-colors">
                    {item.emoji} {item.label}
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#BFA2F8] group-hover:text-[#CCFF00]">
                  TRY ↵
                </span>
              </div>
              <p className="text-xs text-[#D1D5DB] line-clamp-2 italic font-medium leading-relaxed">
                "{item.draft}"
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
