import React from 'react';
import { X, CheckCircle2, Shield, HelpCircle, ArrowRight } from 'lucide-react';

interface ChatIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatIntegrationsModal: React.FC<ChatIntegrationsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-[#222129] rounded-3xl border-3 border-[#CCFF00] shadow-[8px_8px_0px_#000000] overflow-hidden">
        {/* Header Bar */}
        <div className="bg-[#CCFF00] text-[#121118] p-5 flex items-center justify-between border-b-2 border-[#121118]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-[#121118] text-[#CCFF00] rounded-xl border border-[#121118]">
              <HelpCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 id="chat-modal-title" className="text-lg md:text-xl font-black uppercase tracking-tight">
                WhatsApp & Instagram Integration
              </h2>
              <p className="text-xs font-bold text-[#121118]/80">
                Feasibility & Direct Chat Workflow Explained
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="cursor-pointer p-2 rounded-xl bg-[#121118] text-white hover:bg-[#34323F] transition-all border border-[#121118] active:translate-x-[1px] active:translate-y-[1px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Question: Is this feasible? */}
          <div className="p-4 rounded-2xl bg-[#18171E] border border-[#383644] space-y-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]/30 inline-block">
              Architecture & Feasibility
            </span>
            <h3 className="text-base font-black text-white">
              Is direct chat import and export feasible in a web app?
            </h3>
            <p className="text-xs text-[#D1D5DB] leading-relaxed">
              <strong>Yes, with specific platform boundaries:</strong> Modern web browsers enforce strict security sandboxes preventing websites from reading your active background apps (like personal WhatsApp or Instagram windows). However, <strong>direct URL scheme exports</strong>, <strong>Web Share APIs</strong>, and <strong>smart clipboard parsers</strong> make the round-trip practically seamless!
            </p>
          </div>

          {/* Feature 1: WhatsApp Export */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#18171E] border border-[#383644]">
            <div className="p-2.5 rounded-xl bg-[#25D366] text-[#121118] shrink-0 border border-[#121118] shadow-[2px_2px_0px_#000000]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.676.15-.2.301-.776.98-.952 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.677-1.632-.927-2.234-.244-.587-.492-.507-.676-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.228 3.111.15.201 2.122 3.24 5.14 4.544.718.31 1.278.496 1.716.635.722.23 1.379.197 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.516 2 2.028 6.488 2.028 12.012c0 1.895.53 3.664 1.448 5.184L2 22l4.944-1.425a9.96 9.96 0 0 0 5.096 1.397c5.524 0 10.012-4.488 10.012-10.012C22.052 6.488 17.564 2 12.04 2z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">Direct WhatsApp Pre-fill</h4>
                <span className="text-[10px] font-black uppercase text-[#25D366] bg-[#25D366]/10 px-2 py-0.5 rounded border border-[#25D366]/30">
                  100% Native
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Clicking the <strong>WhatsApp</strong> button triggers WhatsApp's official deep link. It immediately launches WhatsApp Web or the WhatsApp mobile app with the rewritten text <strong>already typed into the chat composer</strong> ready for you to send.
              </p>
            </div>
          </div>

          {/* Feature 2: Instagram Handoff */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#18171E] border border-[#383644]">
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white shrink-0 border border-[#121118] shadow-[2px_2px_0px_#000000]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">Instagram Direct Handoff</h4>
                <span className="text-[10px] font-black uppercase text-[#FF5588] bg-[#FF5588]/10 px-2 py-0.5 rounded border border-[#FF5588]/30">
                  Meta Restriction Solved
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Meta intentionally blocks external web URLs from typing into someone's private Instagram DMs to prevent automated spam bots. Our app solves this gracefully: clicking <strong>Instagram</strong> copies the message to your clipboard and immediately opens your Instagram Direct inbox.
              </p>
            </div>
          </div>

          {/* Feature 3: Smart Clean Import */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#18171E] border border-[#383644]">
            <div className="p-2.5 rounded-xl bg-[#BFA2F8] text-[#121118] shrink-0 border border-[#121118] shadow-[2px_2px_0px_#000000]">
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white">Smart Chat Cleaner on Import</h4>
                <span className="text-[10px] font-black uppercase text-[#BFA2F8] bg-[#BFA2F8]/10 px-2 py-0.5 rounded border border-[#BFA2F8]/30">
                  Auto-Detect
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                When copying messages from WhatsApp or Instagram exports, timestamps and names like <code className="text-[#CCFF00] bg-[#121118] px-1 py-0.5 rounded">[12:45 PM] Alex:</code> are automatically detected and stripped, so only the actual message text is loaded into your draft!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#18171E] border-t-2 border-[#34323F] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs md:text-sm bg-[#CCFF00] hover:bg-[#D4FF00] text-[#121118] border-2 border-[#121118] shadow-[3px_3px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span>Got It, Let's Write!</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
