import React from 'react';
import { Radio, AlertOctagon, ShieldAlert, Ear, ArrowRight } from 'lucide-react';
import { DraftAnalysis, FalloutRisk } from '../lib/types';

interface SubtextRadarProps {
  analysis: DraftAnalysis;
  rawDraft: string;
}

export const SubtextRadar: React.FC<SubtextRadarProps> = ({ analysis, rawDraft }) => {
  const riskTheme: Record<FalloutRisk, { badgeBg: string; textColor: string; border: string; glow: string }> = {
    Low: {
      badgeBg: 'bg-[#CCFF00]',
      textColor: 'text-[#121118]',
      border: 'border-[#CCFF00]',
      glow: 'shadow-[3px_3px_0px_#CCFF00]',
    },
    Medium: {
      badgeBg: 'bg-[#FFBE3D]',
      textColor: 'text-[#121118]',
      border: 'border-[#FFBE3D]',
      glow: 'shadow-[3px_3px_0px_#FFBE3D]',
    },
    High: {
      badgeBg: 'bg-[#FB923C]',
      textColor: 'text-[#121118]',
      border: 'border-[#FB923C]',
      glow: 'shadow-[3px_3px_0px_#FB923C]',
    },
    Catastrophic: {
      badgeBg: 'bg-[#FF5555]',
      textColor: 'text-white',
      border: 'border-[#FF5555]',
      glow: 'shadow-[3px_3px_0px_#FF5555]',
    },
  };

  const risk = riskTheme[analysis.falloutRisk] || riskTheme.Medium;

  return (
    <div className="bg-[#222129] rounded-2xl border-2 border-[#383644] p-5 md:p-6 shadow-[5px_5px_0px_#000000] relative overflow-hidden">
      {/* Decorative pulse indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-dashed border-[#34323F]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#18171E] border border-[#383644] text-[#CCFF00] flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse text-[#CCFF00]" />
          </span>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Raw Draft Subtext Radar
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[#A1A1AA] bg-[#18171E] px-2.5 py-1 rounded-full border border-[#383644]">
            {analysis.vibeTag}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full border-2 border-[#121118] ${risk.badgeBg} ${risk.textColor} ${risk.glow}`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Fallout Risk: {analysis.falloutRisk}</span>
          </span>
        </div>
      </div>

      {/* Side by side: What you typed vs What they hear */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#18171E] border border-[#383644]">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#A1A1AA] mb-1.5">
            What You Typed:
          </div>
          <p className="text-xs text-[#D1D5DB] italic font-medium leading-relaxed line-clamp-3">
            "{rawDraft}"
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#2A2438] border-2 border-[#BFA2F8] shadow-[2px_2px_0px_#000000]">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#CCFF00] mb-1.5 flex items-center gap-1.5">
            <Ear className="w-3.5 h-3.5" />
            <span>What They Secretly Hear:</span>
          </div>
          <p className="text-xs text-white font-bold leading-relaxed">
            "{analysis.subtext}"
          </p>
        </div>
      </div>

      {/* Predicted Reaction banner */}
      <div className="mt-3.5 p-3 rounded-xl bg-[#18171E] border border-[#383644] flex items-center gap-2.5">
        <span className="text-base shrink-0">🔮</span>
        <div className="text-xs text-[#D1D5DB] font-medium leading-tight">
          <strong className="text-white">Predicted Raw Reaction: </strong>
          {analysis.predictedReaction}
        </div>
      </div>
    </div>
  );
};
