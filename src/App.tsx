import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  RefreshCw,
  AlertCircle,
  Zap,
  RotateCcw,
  Smile,
  Info,
  Dices,
  Flame,
  Mic,
  MicOff,
  ClipboardPaste,
  HelpCircle,
  Check,
} from 'lucide-react';
import { Recipient, Personality, RewriteResponse, MascotState, SarcasmLevel } from './lib/types';
import { RECIPIENTS, PERSONALITIES, STARTER_SCENARIOS, StarterScenario, SARCASM_LEVELS } from './lib/constants';
import { MascotGoblin } from './components/MascotGoblin';
import { OutputCard } from './components/OutputCard';
import { StarterPills } from './components/StarterPills';
import { SafetyBanner } from './components/SafetyBanner';
import { WelcomeGuide } from './components/WelcomeGuide';
import { SarcasmMeter } from './components/SarcasmMeter';
import { SubtextRadar } from './components/SubtextRadar';
import { ChatIntegrationsModal } from './components/ChatIntegrationsModal';
import { cleanChatImport } from './lib/chat-integrations';

const LOCAL_STORAGE_GUIDE_KEY = 'say_it_better_welcome_seen';

// Fun interactive sticker pills inspired by the reference illustration
const FUN_STICKERS = [
  { text: 'HAI!', state: 'idle' as MascotState, color: 'bg-[#CCFF00] text-[#121118]' },
  { text: 'OK BOSS!!', state: 'thinking' as MascotState, color: 'bg-[#BFA2F8] text-[#121118]' },
  { text: 'TOLD YOU!!', state: 'success' as MascotState, color: 'bg-[#CCFF00] text-[#121118]' },
  { text: 'WHATEVA!!', state: 'error' as MascotState, color: 'bg-[#FF5588] text-white' },
  { text: 'WAT?!', state: 'error' as MascotState, color: 'bg-[#FFBE3D] text-[#121118]' },
  { text: 'WHEN?', state: 'thinking' as MascotState, color: 'bg-[#CCFF00] text-[#121118]' },
];

export default function App() {
  // Input states
  const [draft, setDraft] = useState('');
  const [recipient, setRecipient] = useState<Recipient>('friend');
  const [personality, setPersonality] = useState<Personality>('unhinged_goblin');
  const [sarcasmLevel, setSarcasmLevel] = useState<SarcasmLevel>(3);

  // Paste alert message
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);

  // Web Speech API states
  const [isListening, setIsListening] = useState(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');

  // Status & Async states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RewriteResponse | null>(null);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [customStickerText, setCustomStickerText] = useState<string | undefined>(undefined);

  // Welcome modal state
  const [showWelcome, setShowWelcome] = useState(false);
  // WhatsApp / Instagram chat info modal
  const [showChatInfo, setShowChatInfo] = useState(false);

  // Ref for auto-scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Web Speech API dictation toggle
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechNotice('Voice dictation is not supported in this browser. Please use Chrome/Edge or type your message.');
      setTimeout(() => setSpeechNotice(null), 4500);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setCustomStickerText('GOT IT!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      baseTextRef.current = draft;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechNotice(null);
        setCustomStickerText('LISTENING 🎙️');
        setMascotState('thinking');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = 0; i < event.results.length; i++) {
          interim += event.results[i][0].transcript;
        }
        const initial = baseTextRef.current.trim();
        const combined = initial ? `${initial} ${interim.trim()}` : interim.trim();

        if (combined.length <= 400) {
          setDraft(combined);
          if (pasteNotice) setPasteNotice(null);
        } else {
          setDraft(combined.slice(0, 400));
          setPasteNotice('Draft hit the 400-character limit during dictation.');
          recognition.stop();
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechNotice('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else if (event.error === 'no-speech') {
          setSpeechNotice('No speech detected. Try speaking closer to the microphone.');
        } else {
          setSpeechNotice(`Dictation stopped: ${event.error || 'Connection interrupted'}`);
        }
        setTimeout(() => setSpeechNotice(null), 4500);
        setMascotState('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        setMascotState('idle');
        if (customStickerText === 'LISTENING 🎙️') {
          setCustomStickerText('READY!');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setSpeechNotice('Unable to start voice dictation.');
      setTimeout(() => setSpeechNotice(null), 4500);
    }
  };

  // Check first-time visitor on mount
  useEffect(() => {
    try {
      const seen = localStorage.getItem(LOCAL_STORAGE_GUIDE_KEY);
      if (!seen) {
        setShowWelcome(true);
      }
    } catch {
      // localStorage may fail in restricted contexts
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    try {
      localStorage.setItem(LOCAL_STORAGE_GUIDE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  // Draft change handler with 400 char hard stop
  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= 400) {
      setDraft(val);
      if (pasteNotice) setPasteNotice(null);
    } else {
      setDraft(val.slice(0, 400));
      setPasteNotice('Max limit of 400 characters reached.');
      setTimeout(() => setPasteNotice(null), 3000);
    }
  };

  // Handle paste with smart chat cleanup & truncation notice
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const { cleanedText, wasCleaned, detectedSender } = cleanChatImport(pastedText);

    if (wasCleaned) {
      e.preventDefault();
      setDraft((prev) => {
        const combined = prev ? `${prev} ${cleanedText}` : cleanedText;
        return combined.slice(0, 400);
      });
      setMascotState('thinking');
      setCustomStickerText('CLEANED!');
      setPasteNotice(
        detectedSender
          ? `Imported from ${detectedSender}! Stripped chat timestamps and headers.`
          : 'Imported from chat! Stripped timestamp & contact header.'
      );
      setTimeout(() => setPasteNotice(null), 4000);
      return;
    }

    const currentLength = draft.length;
    if (currentLength + pastedText.length > 400) {
      setPasteNotice('Pasted text was trimmed to fit within the 400-character limit.');
      setTimeout(() => setPasteNotice(null), 3500);
    }
  };

  // 1-Click Clipboard Import for WhatsApp & Instagram
  const handleChatImport = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        setPasteNotice('Clipboard reading is restricted by your browser. Please paste directly using Ctrl+V or Cmd+V.');
        setTimeout(() => setPasteNotice(null), 4000);
        return;
      }
      const rawText = await navigator.clipboard.readText();
      if (!rawText || rawText.trim().length === 0) {
        setPasteNotice('Your clipboard is empty! Copy a message from WhatsApp or Instagram first.');
        setTimeout(() => setPasteNotice(null), 4000);
        return;
      }

      const { cleanedText, wasCleaned, detectedSender } = cleanChatImport(rawText);
      setDraft(cleanedText.slice(0, 400));
      setError(null);
      setMascotState('thinking');
      setCustomStickerText('IMPORTED!');

      if (wasCleaned) {
        setPasteNotice(
          detectedSender
            ? `Imported message from ${detectedSender}! Stripped timestamps and headers.`
            : 'Imported from chat! Cleaned timestamps & headers.'
        );
      } else {
        setPasteNotice('Imported text directly from clipboard!');
      }
      setTimeout(() => setPasteNotice(null), 4000);
    } catch {
      setPasteNotice('Clipboard permission was not granted. Please paste directly with Ctrl+V or Cmd+V.');
      setTimeout(() => setPasteNotice(null), 4000);
    }
  };

  // Selection from starter pills
  const handleSelectScenario = (scenario: StarterScenario) => {
    setDraft(scenario.draft);
    setRecipient(scenario.recipient);
    setPersonality(scenario.personality);
    if (scenario.sarcasmLevel) {
      setSarcasmLevel(scenario.sarcasmLevel);
    }
    setError(null);
    setMascotState('idle');
    setCustomStickerText('READY!');
  };

  // Roll a completely random creative goofy scenario
  const handleRollRandomGoofy = () => {
    const randomIndex = Math.floor(Math.random() * STARTER_SCENARIOS.length);
    const chosen = STARTER_SCENARIOS[randomIndex];
    handleSelectScenario(chosen);
    setCustomStickerText('GOOFY TIME!!');
  };

  // Sarcasm meter change with live mascot reaction
  const handleSarcasmChange = (newLevel: SarcasmLevel) => {
    setSarcasmLevel(newLevel);
    const levelInfo = SARCASM_LEVELS.find((l) => l.level === newLevel);
    if (levelInfo) {
      setCustomStickerText(levelInfo.callout);
    }

    if (newLevel === 1) {
      setMascotState('sensitive');
    } else if (newLevel === 2) {
      setMascotState('idle');
    } else if (newLevel === 3) {
      setMascotState('thinking');
    } else if (newLevel === 4) {
      setMascotState('success');
    } else {
      setMascotState('copied');
    }
  };

  // Trigger copy reaction on goblin
  const handleCardCopy = (_cardId: string) => {
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setMascotState('copied');
    setCustomStickerText('COPIED!!');
    copyTimeoutRef.current = setTimeout(() => {
      if (result?.safetyTier === 'sensitive_pivot') {
        setMascotState('sensitive');
        setCustomStickerText('WITH CARE');
      } else {
        setMascotState('success');
        setCustomStickerText('TOLD YOU!!');
      }
    }, 2500);
  };

  // Submit rewrite request
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = draft.trim();
    if (trimmed.length < 5) {
      setError('Your message must be at least 5 characters long.');
      setMascotState('error');
      setCustomStickerText('TOO SHORT!');
      return;
    }
    if (trimmed.length > 400) {
      setError('Your message cannot exceed 400 characters.');
      setMascotState('error');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMascotState('thinking');
    setCustomStickerText('COOKING...');

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draft: trimmed,
          recipient,
          personality,
          sarcasmLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rewrite your message.');
      }

      setResult(data as RewriteResponse);

      if (data.safetyTier === 'crisis' || data.safetyTier === 'sensitive_pivot') {
        setMascotState('sensitive');
        setCustomStickerText('WITH CARE');
      } else {
        setMascotState('success');
        setCustomStickerText(sarcasmLevel >= 4 ? 'MAX GOOFY!!' : 'TOLD YOU!!');
      }

      // Smooth scroll to output section
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      const errorMsg = (err as Error)?.message || 'We ran into a temporary issue calibrating your rewrites. Please tap Try Again!';
      setError(errorMsg);
      setMascotState('error');
      setCustomStickerText('WAT?!');
    } finally {
      setIsLoading(false);
    }
  };

  const trimmedLength = draft.trim().length;
  const isDraftValid = trimmedLength >= 5 && trimmedLength <= 400;
  const activeSarcasmInfo = SARCASM_LEVELS.find((l) => l.level === sarcasmLevel) || SARCASM_LEVELS[2];

  return (
    <div className="min-h-screen bg-[#18171E] text-white flex flex-col justify-between selection:bg-[#CCFF00] selection:text-[#121118]">
      {/* Welcome Guide Modal */}
      <WelcomeGuide
        isOpen={showWelcome}
        onClose={handleCloseWelcome}
        onTrySample={handleSelectScenario}
      />

      {/* WhatsApp & Instagram Feasibility / Integration Modal */}
      <ChatIntegrationsModal
        isOpen={showChatInfo}
        onClose={() => setShowChatInfo(false)}
      />

      {/* Main App Container */}
      <div className="w-full max-w-4xl mx-auto px-4 py-4 md:py-8 flex-1">
        {/* Neon Header Bar */}
        <header className="w-full bg-[#CCFF00] text-[#121118] px-5 py-3.5 rounded-3xl border-2 border-[#121118] shadow-[4px_4px_0px_#000000] mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#121118] text-[#CCFF00] flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_#000000]">
              ⚡
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none text-[#121118] flex items-center gap-2">
                Say It Better
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-wider bg-[#121118] text-[#CCFF00] px-2 py-0.5 rounded-full">
                  NEON REWRITE
                </span>
              </h1>
              <p className="text-[11px] md:text-xs font-bold text-[#121118]/80 mt-0.5">
                Calibrate petty, emotional, or high-stakes texts with precision
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChatInfo(true)}
              type="button"
              title="Learn about WhatsApp and Instagram integration feasibility"
              className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#121118] text-[#CCFF00] hover:bg-[#2D2B36] transition-all shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 text-xs font-black"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">WhatsApp/IG Info</span>
            </button>

            <button
              onClick={handleRollRandomGoofy}
              type="button"
              className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#121118] text-[#CCFF00] hover:bg-[#2D2B36] transition-all shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 text-xs font-black"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Goofy Roll</span>
            </button>

            <button
              onClick={() => setShowWelcome(true)}
              type="button"
              aria-label="Welcome Tour and Feature Guide"
              className="cursor-pointer px-3 py-1.5 rounded-xl bg-[#121118] text-[#CCFF00] hover:bg-[#2D2B36] transition-all shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] flex items-center gap-1.5 text-xs font-black"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tour & Guide</span>
            </button>
          </div>
        </header>

        {/* Hero Banner with Mascot & Interactive Sticker Bar */}
        <div className="mb-8 p-6 md:p-8 bg-[#222129] rounded-3xl border-2 border-[#383644] shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-[#7C3AED]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#BFA2F8] text-[#121118] border-2 border-[#121118] shadow-[2px_2px_0px_#000000] mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>With Live Sarcasm Meter & Goofy Rewrites</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Don’t press send angry. Let our Sticker Goblin recalibrate it.
            </h2>
            <p className="mt-2 text-sm text-[#D1D5DB] font-medium leading-relaxed max-w-xl">
              Get an instant <strong>Ready-to-Send</strong> version, a <strong>Witty Goofy Alternative</strong>, and your chosen <strong>Persona Mode</strong>—custom calibrated to your exact sarcasm level.
            </p>

            {/* Interactive Sticker Row */}
            <div className="mt-4 pt-3 border-t border-[#34323F] flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#A1A1AA] flex items-center gap-1 mr-1">
                <Smile className="w-3.5 h-3.5 text-[#CCFF00]" />
                Sticker Moods:
              </span>
              {FUN_STICKERS.map((stk) => (
                <button
                  key={stk.text}
                  type="button"
                  onClick={() => {
                    setMascotState(stk.state);
                    setCustomStickerText(stk.text);
                  }}
                  className={`cursor-pointer px-2.5 py-1 rounded-full text-xs font-black border-2 border-[#121118] shadow-[2px_2px_0px_#000000] hover:scale-105 active:scale-95 transition-all ${stk.color}`}
                >
                  {stk.text}
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center z-10">
            <MascotGoblin
              state={mascotState}
              size={135}
              stickerText={customStickerText}
            />
          </div>
        </div>

        {/* Input Form Section */}
        <section className="bg-[#222129] rounded-3xl border-2 border-[#383644] p-6 md:p-8 shadow-[6px_6px_0px_#000000]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Draft Textarea */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="draft-message"
                    className="font-black text-sm uppercase tracking-wider text-[#CCFF00] flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#CCFF00] text-[#121118] flex items-center justify-center text-xs font-black">
                      1
                    </span>
                    Your Raw Message Draft
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowChatInfo(true)}
                    className="cursor-pointer text-[11px] font-bold text-[#A1A1AA] hover:text-[#CCFF00] flex items-center gap-1 transition-colors"
                    title="Learn about WhatsApp & Instagram integration feasibility"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp / IG Info</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {trimmedLength > 0 && trimmedLength < 5 && (
                    <span className="text-xs font-bold text-[#FF5555]">
                      Need at least 5 chars ({trimmedLength}/5)
                    </span>
                  )}
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                      draft.length >= 380
                        ? 'bg-[#FF5555]/20 text-[#FF8585] border-[#FF5555]'
                        : 'bg-[#18171E] text-[#A1A1AA] border-[#383644]'
                    }`}
                  >
                    {draft.length} / 400
                  </span>
                </div>
              </div>

              <div className="relative">
                <textarea
                  id="draft-message"
                  value={draft}
                  onChange={handleDraftChange}
                  onPaste={handlePaste}
                  rows={4}
                  maxLength={400}
                  placeholder="Paste or dictate the angry, petty, awkward, or overthinking text you are tempted to send..."
                  className="w-full p-4 pb-14 rounded-2xl border-2 border-[#383644] bg-[#18171E] text-white text-base placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#CCFF00] focus:border-[#CCFF00] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.4)] resize-y transition-all leading-relaxed"
                />

                {/* Floating Toolbar: Import, Dictate, Clear */}
                <div className="absolute right-3 bottom-3 flex flex-wrap items-center gap-2">
                  {draft.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setDraft('');
                        setPasteNotice(null);
                        setCustomStickerText('CLEARED');
                      }}
                      aria-label="Clear draft text"
                      className="cursor-pointer px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#18171E] hover:bg-[#282733] text-[#A1A1AA] hover:text-white border border-[#383644] transition-all"
                    >
                      Clear
                    </button>
                  )}

                  {/* 1-Tap Paste from Chat */}
                  <button
                    type="button"
                    onClick={handleChatImport}
                    title="Paste message from WhatsApp or Instagram clipboard (auto-cleans timestamps & headers)"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#282633] hover:bg-[#383547] text-[#CCFF00] border-2 border-[#121118] shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span>Paste Chat</span>
                  </button>

                  {/* Floating Microphone Dictation Button */}
                  <button
                    type="button"
                    onClick={toggleSpeechRecognition}
                    aria-label={isListening ? 'Stop voice dictation' : 'Start voice dictation'}
                    className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#121118] transition-all shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] ${
                      isListening
                        ? 'bg-[#FF5555] text-white animate-pulse'
                        : 'bg-[#CCFF00] hover:bg-[#D4FF00] text-[#121118]'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5 animate-bounce" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Dictate</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dictation Notice */}
              {speechNotice && (
                <div className="mt-2 text-xs font-bold text-[#FF8585] bg-[#FF5555]/10 border border-[#FF5555] p-2.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#FF5555]" />
                  <span>{speechNotice}</span>
                </div>
              )}

              {/* Paste Notice */}
              {pasteNotice && (
                <div className="mt-2 text-xs font-bold text-[#FFD480] bg-[#FFBE3D]/10 border border-[#FFBE3D] p-2.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#FFBE3D]" />
                  <span>{pasteNotice}</span>
                </div>
              )}

              {/* Quick Starter Scenarios */}
              <StarterPills onSelectScenario={handleSelectScenario} />
            </div>

            {/* Step 2: Recipient Selector */}
            <div className="pt-4 border-t-2 border-dashed border-[#34323F]">
              <div className="flex items-center justify-between mb-3">
                <label className="font-black text-sm uppercase tracking-wider text-[#CCFF00] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#CCFF00] text-[#121118] flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  Recipient Power Dynamic
                </label>
                <span className="text-xs font-bold text-[#A1A1AA]">
                  Calibrates fallout risk
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {RECIPIENTS.map((item) => {
                  const isSelected = recipient === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRecipient(item.id)}
                      className={`cursor-pointer p-3 rounded-2xl border-2 text-left transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#CCFF00] text-[#121118] border-[#121118] shadow-[3px_3px_0px_#000000] font-black'
                          : 'bg-[#18171E] hover:bg-[#282733] text-[#D1D5DB] border-[#383644] shadow-[2px_2px_0px_#000000] font-bold'
                      }`}
                    >
                      <span className="text-xs">{item.badge}</span>
                      <span
                        className={`text-[10px] mt-1 font-medium leading-tight ${
                          isSelected ? 'text-[#121118]/80' : 'text-[#858592]'
                        }`}
                      >
                        {item.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Interactive Sarcasm Meter */}
            <SarcasmMeter
              level={sarcasmLevel}
              onChange={handleSarcasmChange}
            />

            {/* Step 4: Personality Selector */}
            <div className="pt-4 border-t-2 border-dashed border-[#34323F]">
              <div className="flex items-center justify-between mb-3">
                <label className="font-black text-sm uppercase tracking-wider text-[#CCFF00] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#CCFF00] text-[#121118] flex items-center justify-center text-xs font-black">
                    4
                  </span>
                  Choose Calibration Persona
                </label>
                <span className="text-xs font-bold text-[#A1A1AA]">
                  Shapes Card 3's signature voice
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {PERSONALITIES.map((item) => {
                  const isSelected = personality === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPersonality(item.id)}
                      className={`cursor-pointer p-3.5 rounded-2xl border-2 text-left transition-all duration-150 active:translate-x-[1px] active:translate-y-[1px] flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#7C3AED] text-white border-[#BFA2F8] shadow-[4px_4px_0px_#CCFF00]'
                          : 'bg-[#18171E] hover:bg-[#282733] text-white border-[#383644] shadow-[2px_2px_0px_#000000]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-full border border-[#121118] ${
                              isSelected
                                ? 'bg-[#CCFF00] text-[#121118]'
                                : 'bg-[#2A2933] text-[#D1D5DB]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </div>
                        <div
                          className={`text-xs font-bold mt-1.5 ${
                            isSelected ? 'text-[#E9D5FF]' : 'text-[#A1A1AA]'
                          }`}
                        >
                          {item.tagline}
                        </div>
                      </div>
                      <p
                        className={`text-[11px] mt-2 font-medium leading-relaxed ${
                          isSelected ? 'text-white/90' : 'text-[#71717A]'
                        }`}
                      >
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message & Retry Prompt */}
            {error && (
              <div className="p-4 bg-[#2A141A] border-2 border-[#FF5555] rounded-2xl text-[#FF8585] shadow-[3px_3px_0px_#FF5555] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-[#FF5555]" />
                  <span className="text-sm font-bold">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-[#FF5555] text-[#121118] hover:bg-[#FF7373] active:translate-y-[1px]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              </div>
            )}

            {/* Submit CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !isDraftValid}
                className={`cursor-pointer w-full py-4 px-6 rounded-2xl font-black text-base md:text-lg border-2 border-[#121118] transition-all duration-150 flex items-center justify-center gap-2 shadow-[5px_5px_0px_#000000] ${
                  isLoading
                    ? 'bg-[#FFBE3D] text-[#121118] cursor-wait'
                    : isDraftValid
                    ? 'bg-[#CCFF00] hover:bg-[#D4FF00] text-[#121118] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000000]'
                    : 'bg-[#2D2B36] text-[#71717A] cursor-not-allowed border-[#383644] shadow-none'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Goblin is cooking your rewrites...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    <span>Say It Better ({activeSarcasmInfo.title})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Output Cards Section */}
        <div ref={resultsRef} className="mt-10">
          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Output Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-[#222129] rounded-2xl border-2 border-[#383644] shadow-[4px_4px_0px_#000000]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                      🎯 Calibrated Output
                    </h2>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-black border border-[#121118] shadow-[1.5px_1.5px_0px_#000000]"
                      style={{ backgroundColor: activeSarcasmInfo.color, color: '#121118' }}
                    >
                      {activeSarcasmInfo.emoji} {activeSarcasmInfo.label} Sarcasm
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] font-medium mt-1">
                    Pick your favorite version or copy the chat bubble preview
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  disabled={isLoading}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#CCFF00] hover:bg-[#D4FF00] text-[#121118] border-2 border-[#121118] shadow-[2px_2px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reroll Versions</span>
                </button>
              </div>

              {/* Safety Banner (Crisis or Sensitive Pivot) */}
              <SafetyBanner
                safetyTier={result.safetyTier}
                pivotExplanation={result.pivotExplanation}
                emergencyResources={result.emergencyResources}
              />

              {/* Subtext Radar & Fallout Analysis */}
              {result.analysis && result.safetyTier === 'standard' && (
                <SubtextRadar analysis={result.analysis} rawDraft={draft} />
              )}

              {/* The 3 Cards */}
              {result.cards && result.cards.length > 0 && (
                <div className="grid grid-cols-1 gap-5">
                  {result.cards.map((card, idx) => (
                    <OutputCard
                      key={card.id || idx}
                      card={card}
                      index={idx}
                      onCopyTrigger={handleCardCopy}
                      isSensitivePivot={result.safetyTier === 'sensitive_pivot'}
                      recipient={recipient}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t-2 border-[#383644] bg-[#141318] py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#71717A] font-medium">
          <div className="flex items-center gap-2">
            <span className="font-black text-[#CCFF00]">Say It Better</span>
            <span>•</span>
            <span>Sarcasm Meter & Goofy Rewrites</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowWelcome(true)}
              className="hover:text-white font-bold underline cursor-pointer"
            >
              Guide & Philosophy
            </button>
            <span>•</span>
            <span>Powered by Google GenAI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
