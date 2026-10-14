import React, { useState } from 'react';
import { Check, Copy, Sparkles, Send, Flame, ShieldAlert, MessageCircle, CornerDownRight, Wand2, Share2, ExternalLink } from 'lucide-react';
import { RewriteCard, Recipient } from '../lib/types';
import { RECIPIENTS } from '../lib/constants';
import { sendToWhatsApp, openInstagramDirect, triggerNativeShare } from '../lib/chat-integrations';

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
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Recipient info for the simulator
  const recipientInfo = RECIPIENTS.find((r) => r.id === recipient) || RECIPIENTS[0];

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

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
      showNotice('Copied message to clipboard!');
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      onCopyTrigger(card.id);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleWhatsApp = () => {
    sendToWhatsApp(currentText);
    onCopyTrigger(card.id);
    showNotice('Opening WhatsApp with message loaded into chat box!');
  };

  const handleInstagram = async () => {
    const res = await openInstagramDirect(currentText);
    onCopyTrigger(card.id);
    showNotice(
      res.copied
        ? 'Copied to clipboard! Switched to Instagram Direct — just paste into your chat.'
        : 'Opening Instagram Direct...'
    );
  };

  const handleShare = async () => {
    const shared = await triggerNativeShare('Say It Better rewrite', currentText);
    if (shared) {
      onCopyTrigger(card.id);
      showNotice('Shared message!');
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
      <div className="mt-4 pt-3 border-t border-[#34323F] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#A1A1AA]">
          <span>
            {currentText.length} chars • {currentText.trim().split(/\s+/).length} words
          </span>
          <span className="text-[11px] text-[#A1A1AA] flex items-center gap-1 font-mono">
            <ExternalLink className="w-3 h-3 text-[#CCFF00]" />
            Direct Export to Chat:
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1-Tap Copy */}
          <button
            onClick={handleCopy}
            type="button"
            aria-label={copied ? 'Copied to clipboard' : 'Copy message text'}
            className={`cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs sm:text-sm border-2 border-[#121118] transition-all duration-150 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${
              copied
                ? 'bg-[#CCFF00] text-[#121118] shadow-[2px_2px_0px_#000000]'
                : 'bg-[#BFA2F8] hover:bg-[#D8B4FE] text-[#121118] shadow-[2.5px_2.5px_0px_#000000]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Send directly to WhatsApp */}
          <button
            onClick={handleWhatsApp}
            type="button"
            title="Open WhatsApp with this message pre-filled directly in chat"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm bg-[#25D366] hover:bg-[#20bd5a] text-[#121118] border-2 border-[#121118] shadow-[2.5px_2.5px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <svg className="w-4 h-4 fill-[#121118]" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.676.15-.2.301-.776.98-.952 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.176.201-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.677-1.632-.927-2.234-.244-.587-.492-.507-.676-.516l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.91 1.228 3.111.15.201 2.122 3.24 5.14 4.544.718.31 1.278.496 1.716.635.722.23 1.379.197 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.04 2C6.516 2 2.028 6.488 2.028 12.012c0 1.895.53 3.664 1.448 5.184L2 22l4.944-1.425a9.96 9.96 0 0 0 5.096 1.397c5.524 0 10.012-4.488 10.012-10.012C22.052 6.488 17.564 2 12.04 2z" />
            </svg>
            <span>WhatsApp</span>
          </button>

          {/* Switch to Instagram Direct */}
          <button
            onClick={handleInstagram}
            type="button"
            title="Copy and switch directly to Instagram Direct Inbox"
            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white border-2 border-[#121118] shadow-[2.5px_2.5px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Instagram</span>
          </button>

          {/* OS Share Sheet */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleShare}
              type="button"
              title="Share with other apps"
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs bg-[#18171E] hover:bg-[#282733] text-[#D1D5DB] border border-[#383644] transition-all ml-auto"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          )}
        </div>

        {/* Action Notice Toast */}
        {actionNotice && (
          <div className="text-xs font-bold text-[#121118] bg-[#CCFF00] border-2 border-[#121118] p-2.5 rounded-xl shadow-[2px_2px_0px_#000000] flex items-center gap-2 animate-in fade-in duration-200">
            <Check className="w-4 h-4 stroke-[3] shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>
    </div>
  );
};
