import { Recipient, Personality, SarcasmLevel } from './types';

export interface RecipientOption {
  id: Recipient;
  label: string;
  badge: string;
  description: string;
  accentColor: string;
}

export const RECIPIENTS: RecipientOption[] = [
  {
    id: 'friend',
    label: 'Friend',
    badge: '🤝 Bestie',
    description: 'High banter, casual delivery, shared history',
    accentColor: '#B4F042',
  },
  {
    id: 'crush',
    label: 'Crush',
    badge: '💌 Crush',
    description: 'Vulnerability guarded, high aura, zero begging',
    accentColor: '#FF6B6B',
  },
  {
    id: 'boss',
    label: 'Boss',
    badge: '💼 Boss',
    description: 'High stakes, strategic self-preservation, career safe',
    accentColor: '#6C38CC',
  },
  {
    id: 'family',
    label: 'Family',
    badge: '🏡 Family',
    description: 'Deep ties, generational nuances, polite boundaries',
    accentColor: '#FFBE3D',
  },
  {
    id: 'partner',
    label: 'Partner',
    badge: '❤️ Partner',
    description: 'Intimacy, emotional safety, constructive clarity',
    accentColor: '#FF6B6B',
  },
  {
    id: 'group_chat',
    label: 'Group Chat',
    badge: '💬 Group Chat',
    description: 'Audience of witnesses, punchy timing, high replay value',
    accentColor: '#00D1FF',
  },
];

export interface PersonalityOption {
  id: Personality;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  color: string;
}

export const PERSONALITIES: PersonalityOption[] = [
  {
    id: 'diplomat',
    name: 'The Diplomat',
    tagline: 'Calm, tactful, boundary-setting',
    description: 'Ironclad boundaries wrapped in pristine grace. Zero therapy-speak, zero fake warmth.',
    badge: '🕊️ Diplomat',
    color: '#6C38CC',
  },
  {
    id: 'petty_polite',
    name: 'Petty But Polite',
    tagline: 'Immaculate manners, devastating subtext',
    description: 'So polite they can never quote you to HR, but the emotional sting echoes for weeks.',
    badge: '☕ Petty & Polite',
    color: '#FF6B6B',
  },
  {
    id: 'unhinged_goblin',
    name: 'Unhinged Goblin',
    tagline: 'Lovable chaos & dramatic hyperbole',
    description: 'Goblin energy, medieval quest metaphors, feral melodrama—while never dropping the core ask.',
    badge: '👺 Goblin Mode',
    color: '#B4F042',
  },
  {
    id: 'delulu_romantic',
    name: 'Delulu Romantic',
    tagline: 'Charming rom-com optimism & cinematic flair',
    description: 'Living in an A24 romantic comedy. High theatrical hope without crossing into creepy.',
    badge: '✨ Delulu Rom-Com',
    color: '#FFBE3D',
  },
  {
    id: 'corporate_survivor',
    name: 'Corporate Survivor',
    tagline: 'Weary bureaucratic armor & CYA mastery',
    description: 'Exhausted corporate veteran armed with "per my previous email" and strategic CC-ing.',
    badge: '📊 Corp Survivor',
    color: '#00D1FF',
  },
  {
    id: 'gen_z_brainrot',
    name: 'Gen Z Brainrot (Calibrated)',
    tagline: 'Naturally online, lowercase deadpan energy',
    description: '1-2 organic slang terms maximum, deadpan lowercase poise, never synthetic spam.',
    badge: '💀 Gen Z Deadpan',
    color: '#A259FF',
  },
];

export interface SarcasmLevelInfo {
  level: SarcasmLevel;
  label: string;
  title: string;
  desc: string;
  emoji: string;
  color: string;
  callout: string;
}

export const SARCASM_LEVELS: SarcasmLevelInfo[] = [
  {
    level: 1,
    label: '0% Zen',
    title: 'Pure Zen Diplomacy',
    desc: 'Completely earnest, zero sarcasm, mature peaceful boundaries',
    emoji: '🕊️',
    color: '#A7F3D0',
    callout: 'PEACEFUL',
  },
  {
    level: 2,
    label: '25% Playful',
    title: 'Soft Banter',
    desc: 'Gentle nudge, warm teasing, harmless friendly smile',
    emoji: '😏',
    color: '#CCFF00',
    callout: 'WELL...',
  },
  {
    level: 3,
    label: '50% Witty',
    title: 'Dry Internet Wit',
    desc: 'Classic sharp comedic punchlines, disarming timing',
    emoji: '☕',
    color: '#FFBE3D',
    callout: 'HMM...',
  },
  {
    level: 4,
    label: '75% Spicy',
    title: 'Weaponized Subtext',
    desc: 'Dramatic comedic hyperbole, delicious petty perfection',
    emoji: '🌶️',
    color: '#FB923C',
    callout: 'TOLD YOU!!',
  },
  {
    level: 5,
    label: '100% Nuclear',
    title: 'Unhinged Goofy Chaos',
    desc: 'Absurd metaphors, medieval heralds, cinematic melodrama',
    emoji: '☢️',
    color: '#FF5588',
    callout: 'FERAL GOBLIN!!',
  },
];

export interface StarterScenario {
  id: string;
  draft: string;
  recipient: Recipient;
  personality: Personality;
  label: string;
  emoji: string;
  sarcasmLevel?: SarcasmLevel;
}

export const STARTER_SCENARIOS: StarterScenario[] = [
  {
    id: 'donkey_travel',
    draft: "You said you'd be here 20 minutes ago. Are you travelling by donkey?",
    recipient: 'friend',
    personality: 'unhinged_goblin',
    label: 'Late friend (Goblin)',
    emoji: '🐴',
    sarcasmLevel: 4,
  },
  {
    id: 'borrowed_jacket',
    draft: "You borrowed my jacket 6 months ago. Is it paying rent in your closet now or can I have it back?",
    recipient: 'friend',
    personality: 'unhinged_goblin',
    label: 'Hostage Jacket (Goofy)',
    emoji: '🧥',
    sarcasmLevel: 5,
  },
  {
    id: 'typing_epic',
    draft: "I see the typing bubbles popping up and disappearing for 15 minutes. Did you write an entire epic trilogy?",
    recipient: 'crush',
    personality: 'delulu_romantic',
    label: 'Typing bubbles (Rom-Com)',
    emoji: '💬',
    sarcasmLevel: 3,
  },
  {
    id: 'cheese_pajamas',
    draft: "Are we still meeting at 8pm or should I put on sweatpants and eat shredded mozzarella directly out of the bag?",
    recipient: 'group_chat',
    personality: 'gen_z_brainrot',
    label: 'Flaking plans (Deadpan)',
    emoji: '🧀',
    sarcasmLevel: 4,
  },
  {
    id: 'credit_stealer',
    draft: "Interesting how my idea became your idea the moment the manager joined the call.",
    recipient: 'boss',
    personality: 'corporate_survivor',
    label: 'Idea hijacked (Corp)',
    emoji: '📎',
    sarcasmLevel: 4,
  },
  {
    id: 'unsolicited_ted_talk',
    draft: "I didn't ask for advice, but thank you for the completely unsolicited TED Talk.",
    recipient: 'family',
    personality: 'petty_polite',
    label: 'Unsolicited lecture (Petty)',
    emoji: '🎙️',
    sarcasmLevel: 3,
  },
];

export const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    contact: 'Call or text 988 (USA & Canada)',
    desc: 'Free, confidential support 24/7.',
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    desc: 'Connect with a crisis counselor 24/7.',
  },
  {
    name: 'The Trevor Project (LGBTQ youth)',
    contact: 'Call 1-866-488-7386 or text START to 678-678',
    desc: '24/7 confidential crisis counseling.',
  },
  {
    name: 'International Resources (Befrienders Worldwide)',
    contact: 'Visit https://www.befrienders.org',
    desc: 'Find confidential support in your country.',
  },
];
