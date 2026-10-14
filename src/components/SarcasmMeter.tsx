import React from 'react';
import { SarcasmLevel } from '../lib/types';
import { SARCASM_LEVELS, SarcasmLevelInfo } from '../lib/constants';
import { Flame, Gauge } from 'lucide-react';

interface SarcasmMeterProps {
  level: SarcasmLevel;
  onChange: (level: SarcasmLevel) => void;
}

export const SarcasmMeter: React.FC<SarcasmMeterProps> = ({ level, onChange }) => {
  const currentLevelInfo = SARCASM_LEVELS.find((l) => l.level === level) || SARCASM_LEVELS[2];

  return (
    <div className="pt-4 border-t-2 border-dashed border-[#34323F]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <label className="font-black text-sm uppercase tracking-wider text-[#CCFF00] flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#CCFF00] text-[#121118] flex items-center justify-center text-xs font-black">
            3
          </span>
          <Gauge className="w-4 h-4 text-[#CCFF00]" />
          Sarcasm & Goofiness Meter
        </label>

        {/* Current active badge */}
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border-2 border-[#121118] shadow-[2px_2px_0px_#000000] transition-colors"
            style={{ backgroundColor: currentLevelInfo.color, color: '#121118' }}
          >
            <span>{currentLevelInfo.emoji}</span>
            <span>{currentLevelInfo.title}</span>
            <span className="opacity-80">({currentLevelInfo.label})</span>
          </span>
        </div>
      </div>

      {/* Description of current setting */}
      <p className="text-xs text-[#D1D5DB] font-medium mb-3">
        {currentLevelInfo.desc}
      </p>

      {/* 5-Step Chunky Neo-Brutalist Level Buttons */}
      <div className="grid grid-cols-5 gap-1.5 md:gap-2">
        {SARCASM_LEVELS.map((item) => {
          const isSelected = item.level === level;
          return (
            <button
              key={item.level}
              type="button"
              onClick={() => onChange(item.level)}
              className={`cursor-pointer py-2.5 px-1 md:px-2 rounded-xl border-2 transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] flex flex-col items-center justify-center text-center ${
                isSelected
                  ? 'border-[#121118] shadow-[3px_3px_0px_#000000] scale-102 font-black'
                  : 'bg-[#18171E] hover:bg-[#282733] border-[#383644] text-[#A1A1AA] shadow-[1.5px_1.5px_0px_#000000]'
              }`}
              style={isSelected ? { backgroundColor: item.color, color: '#121118' } : undefined}
            >
              <span className="text-base md:text-lg mb-0.5">{item.emoji}</span>
              <span className="text-[10px] md:text-xs font-black leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Visual meter bar indicator */}
      <div className="mt-3 relative w-full h-2.5 bg-[#18171E] rounded-full overflow-hidden border border-[#383644]">
        <div
          className="h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(204,255,0,0.6)]"
          style={{
            width: `${(level / 5) * 100}%`,
            backgroundColor: currentLevelInfo.color,
          }}
        />
      </div>
    </div>
  );
};
