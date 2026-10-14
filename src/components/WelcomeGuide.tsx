import React from 'react';
import {
  X,
  Sparkles,
  Send,
  Laugh,
  Flame,
  Radio,
  Mic,
  Gauge,
  MessageSquare,
  Wand2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { MascotGoblin } from './MascotGoblin';
import { STARTER_SCENARIOS, StarterScenario } from '../lib/constants';

interface WelcomeGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onTrySample: (sample: StarterScenario) => void;
}

export const WelcomeGuide: React.FC<WelcomeGuideProps> = ({
  isOpen,
  onClose,
  onTrySample,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-[#1E1D24] rounded-3xl border-2 border-[#CCFF00] shadow-[8px_8px_0px_#000000] p-6 md:p-8 max-h-[92vh] overflow-y-auto text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close welcome guide"
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-xl border-2 border-[#121118] bg-[#2D2B36] hover:bg-[#FF5555] text-white shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Header with Mascot */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b-2 border-dashed border-[#383644]">
          <MascotGoblin state="idle" size={95} showStatusBadge={false} />
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#CCFF00] text-[#121118] border border-[#121118] shadow-[2px_2px_0px_#000000] mb-2">
              ⚡ EMOTIONAL CALIBRATION ENGINE
            </div>
            <h2 id="welcome-modal-title" className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Welcome to Say It Better!
            </h2>
            <p className="text-sm font-medium text-[#D1D5DB] mt-1 leading-relaxed">
              We help you rewrite raw, difficult, emotionally charged, or petty messages into calibrated social perfection before you hit send.
            </p>
          </div>
        </div>

        {/* 3-Step Quick Start Guide */}
        <div className="mt-6">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#CCFF00] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#CCFF00]" />
            <span>How It Works (Where To Start):</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-[#26252E] rounded-2xl border-2 border-[#383644] shadow-[3px_3px_0px_#000000]">
              <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-[#121118] flex items-center justify-center font-black text-xs mb-2">
                1
              </div>
              <h4 className="text-sm font-black text-white mb-1">Pour Out Your Raw Draft</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Type or tap the <strong>Dictate (Voice)</strong> mic button to vent out loud. No filter needed.
              </p>
            </div>

            <div className="p-4 bg-[#26252E] rounded-2xl border-2 border-[#383644] shadow-[3px_3px_0px_#000000]">
              <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-[#121118] flex items-center justify-center font-black text-xs mb-2">
                2
              </div>
              <h4 className="text-sm font-black text-white mb-1">Select Context & Sarcasm</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Choose who you're texting (Boss, Crush, Friend) and dial the <strong>Sarcasm Meter</strong> (0% Zen to 100% Unhinged).
              </p>
            </div>

            <div className="p-4 bg-[#26252E] rounded-2xl border-2 border-[#383644] shadow-[3px_3px_0px_#000000]">
              <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-[#121118] flex items-center justify-center font-black text-xs mb-2">
                3
              </div>
              <h4 className="text-sm font-black text-white mb-1">Calibrate & Copy</h4>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Review the Subtext Radar, check the simulated replies, apply 1-tap tweaks, and copy the winning card.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="mt-6 pt-5 border-t border-[#34323F]">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#BFA2F8] mb-3">
            Main Features & Superpowers:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-[#18171E] rounded-xl border border-[#383644] flex items-start gap-3">
              <div className="p-2 bg-[#7C3AED]/20 text-[#BFA2F8] rounded-lg shrink-0">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-white block">3 Calibrated Angles</strong>
                <span className="text-[11px] text-[#A1A1AA] leading-tight block mt-0.5">
                  1. Ready to Send (frictionless), 2. Funnier Take (witty), 3. Full Persona Mode.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#18171E] rounded-xl border border-[#383644] flex items-start gap-3">
              <div className="p-2 bg-[#CCFF00]/20 text-[#CCFF00] rounded-lg shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-white block">Subtext Radar & Fallout Meter</strong>
                <span className="text-[11px] text-[#A1A1AA] leading-tight block mt-0.5">
                  Decodes what you typed vs. what the recipient will actually hear underneath.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#18171E] rounded-xl border border-[#383644] flex items-start gap-3">
              <div className="p-2 bg-[#FFBE3D]/20 text-[#FFBE3D] rounded-lg shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-white block">5-Level Sarcasm Meter</strong>
                <span className="text-[11px] text-[#A1A1AA] leading-tight block mt-0.5">
                  Dial from 0% Zen Monk diplomacy all the way to 100% Unhinged Goofy chaos.
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-[#18171E] rounded-xl border border-[#383644] flex items-start gap-3">
              <div className="p-2 bg-[#FF5588]/20 text-[#FF5588] rounded-lg shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-xs text-white block">Simulated Reply Predictor</strong>
                <span className="text-[11px] text-[#A1A1AA] leading-tight block mt-0.5">
                  See what they are most likely to text back before you even press send.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t-2 border-dashed border-[#383644] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onTrySample(STARTER_SCENARIOS[0]);
              onClose();
            }}
            className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-black text-sm bg-[#CCFF00] text-[#121118] border-2 border-[#121118] shadow-[3px_3px_0px_#000000] hover:bg-[#D4FF00] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <span>🐴 Try A Sample Scenario</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-2xl font-bold text-sm bg-[#26252E] text-white border-2 border-[#383644] hover:bg-[#34323F] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            Got it, let's write!
          </button>
        </div>
      </div>
    </div>
  );
};
