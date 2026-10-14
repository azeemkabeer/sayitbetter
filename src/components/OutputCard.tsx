import React, { useState } from 'react';
import { Check, Copy, Sparkles, Send, Flame, ShieldAlert, MessageCircle, CornerDownRight, Wand2 } from 'lucide-react';
import { RewriteCard, Recipient } from '../lib/types';
import { RECIPIENTS } from '../lib/constants';

interface OutputCardProps {
  card: RewriteCard;
  index: number;
  onCopyTrigger: (cardId: string) => void;
  isSensitivePivot?: boolean;
  recipient?: Recipient;
}

export const OutputCard: React.FC<OutputCardProps> = ({
  card,
  index,
  onCopyTrigger,
  isSensitivePivot = false,
  recipient = 'friend',
}) => {
  const [copied, setCopied] = useState(false);
  const [currentText, setCurrentText] = useState(card.text);
  const [activeTweak, setActiveTweak] = useState<string | null>(null);

  // Recipient info for the simulator
  const recipientInfo = RECIPIENTS.find((r) => r.id === recipient) || RECIPIENTS[0];

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentText;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      onCopyTrigger(card.id);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      onCopyTrigger(card.id);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  // 1-Tap Tone Tweakers
  const handleApplyTweak = (type: 'snappy' | 'buffer' | 'casual' | 'reset') => {
    if (type === 'reset') {
      setCurrentText(card.text);
      setActiveTweak(null);
      return;
    }

    if (type === 'snappy') {
      // Pick first sentence or condense
      const sentences = card.text.split(/(?<=[.?!])\s+/);
      const first = sentences[0] || card.text;
      setCurrentText(first);
      setActiveTweak('snappy');
    } else if (type === 'buffer') {
      // Add a polite exit buffer
      const buffer = recipient === 'boss'
        ? " Completely understand if your schedule is packed—no rush at all!"
        : " No worries at all if you're busy, just wanted to check in!";
      if (!currentText.includes('No worries')) {
        setCurrentText(`${currentText.trim()}${buffer}`);
        setActiveTweak('buffer');
      }
    } else if (type === 'casual') {
      // Convert to natural casual lowercase
      const casual = currentText
        .toLowerCase()
        .replace(/^[a-z]/, (c) => c.toLowerCase());
      setCurrentText(casual);
      setActiveTweak('casual');
    }
  };

  // Sticker callout tags matching the reference
  const stickerThemes = {
    ready_to_send: {
      badgeBg: 'bg-[#BFA2F8]',
      badgeText: 'text-[#121118]',
      bubbleBg: 'bg-[#7C3AED] text-white',
      accentBorder: 'border-l-8 border-l-[#BFA2F8]',
      stickerTag: 'OK BOSS!!',
      stickerBg: 'bg-[#121118] text-[#CCFF00]',
      icon: <Send className="w-4 h-4" />,
      tag: 'READY TO SEND',
    },
    funnier_alternative: {
      badgeBg: 'bg-[#CCFF00]',
      badgeText: 'text-[#121118]',
      bubbleBg: 'bg-[#CCFF00] text-[#121118]',
      accentBorder: 'border-l-8 border-l-[#CCFF00]',
      stickerTag: 'TOLD YOU!!',
      stickerBg: 'bg-[#BFA2F8] text-[#121118]',
      icon: <Sparkles className="w-4 h-4" />,
      tag: 'FUNNIER TAKE',
    },
    full_personality: {
      badgeBg: 'bg-[#FF5588]',
      badgeText: 'text-white',
      bubbleBg: 'bg-[#FF5588] text-white',
      accentBorder: 'border-l-8 border-l-[#FF5588]',
      stickerTag: 'WHATEVA!!',
      stickerBg: 'bg-[#CCFF00] text-[#121118]',
      icon: <Flame className="w-4 h-4" />,
      tag: 'FULL PERSONA',
    },
  };

  const theme = stickerThemes[card.id] || stickerThemes.ready_to_send;

  return (
    <div
      className={`group relative flex flex-col justify-between bg-[#222129] rounded-2xl border-2 border-[#383644] p-5 md:p-6 shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#CCFF00] hover:border-[#CCFF00] transition-all duration-200 ${theme.accentBorder}`}
    >
      {/* Top Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-dashed border-[#34323F]">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#121118] shadow-[2px_2px_0px_#000000] ${theme.badgeBg} ${theme.badgeText}`}
            >
              {theme.icon}
              {isSensitivePivot ? 'Safety Pivot' : theme.tag}
            </span>

            {/* Comic Sticker Bubble Tag */}
            <span
              className={`hidden sm:inline-flex items-center text-[11px] font-black tracking-wider px-2.5 py-0.5 rounded-full border-2 border-[#121118] shadow-[1.5px_1.5px_0px_#000000] ${theme.stickerBg}`}
            >
              {theme.stickerTag}
            </span>
          </div>

          {/* Subtitle / Approach Tag */}
          <span className="text-xs font-bold text-[#D1D5DB] bg-[#18171E] px-2.5 py-1 rounded-lg border border-[#383644]">
            {card.subtitle}
          </span>
        </div>

        {/* Card Title & Modification indicator */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            {card.title}
          </h3>
          {activeTweak && (
            <span className="text-[10px] font-black uppercase tracking-wider text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded border border-[#CCFF00]">
              Tweak: {activeTweak}
            </span>
          )}
        </div>

        {/* Interactive Chat Simulation Viewport */}
        <div className="mt-4 p-4 rounded-xl bg-[#18171E] border-2 border-[#383644] space-y-3">
          {/* Header indicator */}
          <div className="flex items-center justify-between text-xs font-black text-[#A1A1AA] uppercase tracking-wider border-b border-[#282733] pb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>Chat Simulation Thread</span>
            </div>
            <span className="text-[10px] text-[#71717A]">
              To {recipientInfo.label}
            </span>
          </div>

          {/* Outgoing Message Bubble (What You Send) */}
          <div className="flex flex-col items-end">
            <div
              className={`max-w-[90%] md:max-w-[85%] p-4 rounded-2xl rounded-tr-xs font-sans text-[15px] leading-relaxed font-medium shadow-[3px_3px_0px_#000000] select-text selection:bg-white selection:text-[#121118] ${
                card.id === 'funnier_alternative'
                  ? 'bg-[#CCFF00] text-[#121118] font-bold border-2 border-[#121118]'
                  : card.id === 'full_personality'
                  ? 'bg-[#A855F7] text-white border-2 border-[#121118]'
                  : 'bg-[#7C3AED] text-white border-2 border-[#121118]'
              }`}
            >
              <div className="whitespace-pre-wrap">{currentText}</div>
              <div
                className={`mt-1.5 text-[10px] text-right font-mono font-bold ${
                  card.id === 'funnier_alternative' ? 'text-[#121118]/70' : 'text-white/70'
                }`}
              >
                Delivered ✓✓
              </div>
            </div>
          </div>

          {/* Simulated Incoming Reply Bubble */}
          {card.predictedReply && (
            <div className="flex flex-col items-start pt-1">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#A1A1AA] mb-1">
                <CornerDownRight className="w-3 h-3 text-[#CCFF00]" />
                <span>Simulated Reply from {recipientInfo.badge}:</span>
              </div>
              <div className="max-w-[90%] md:max-w-[85%] p-3.5 rounded-2xl rounded-tl-xs bg-[#2A2933] text-[#E4E4E7] border border-[#3E3C4A] font-sans text-sm leading-relaxed shadow-[2px_2px_0px_#000000]">
                "{card.predictedReply}"
              </div>
            </div>
          )}
        </div>

        {/* 1-Tap Tone Tweakers Tray */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#71717A] flex items-center gap-1 mr-1">
            <Wand2 className="w-3 h-3 text-[#CCFF00]" />
            Quick Tweaks:
          </span>
          <button
            type="button"
            onClick={() => handleApplyTweak('snappy')}
            className={`cursor-pointer px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
              activeTweak === 'snappy'
                ? 'bg-[#CCFF00] text-[#121118] border-[#121118] shadow-[1.5px_1.5px_0px_#000000]'
                : 'bg-[#18171E] hover:bg-[#282733] text-[#D1D5DB] border-[#383644]'
            }`}
          >
            ⚡ Snappier
          </button>
          <button
            type="button"
            onClick={() => handleApplyTweak('buffer')}
            className={`cursor-pointer px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
              activeTweak === 'buffer'
                ? 'bg-[#BFA2F8] text-[#121118] border-[#121118] shadow-[1.5px_1.5px_0px_#000000]'
                : 'bg-[#18171E] hover:bg-[#282733] text-[#D1D5DB] border-[#383644]'
            }`}
          >
            🛡️ Add Exit Buffer
          </button>
          <button
            type="button"
            onClick={() => handleApplyTweak('casual')}
            className={`cursor-pointer px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
              activeTweak === 'casual'
                ? 'bg-[#FFBE3D] text-[#121118] border-[#121118] shadow-[1.5px_1.5px_0px_#000000]'
                : 'bg-[#18171E] hover:bg-[#282733] text-[#D1D5DB] border-[#383644]'
            }`}
          >
            😎 More Casual
          </button>
          {activeTweak && (
            <button
              type="button"
              onClick={() => handleApplyTweak('reset')}
              className="cursor-pointer text-[10px] text-[#A1A1AA] hover:text-white underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-[#34323F]">
        <div className="text-xs font-bold text-[#A1A1AA]">
          {currentText.length} chars • {currentText.trim().split(/\s+/).length} words
        </div>

        <button
          onClick={handleCopy}
          type="button"
          aria-label={copied ? 'Copied to clipboard' : 'Copy message text'}
          className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm border-2 border-[#121118] transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
            copied
              ? 'bg-[#CCFF00] text-[#121118] shadow-[2px_2px_0px_#000000]'
              : 'bg-[#BFA2F8] hover:bg-[#D8B4FE] text-[#121118] shadow-[3px_3px_0px_#000000]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 stroke-[2.5]" />
              <span>Copy Message</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
