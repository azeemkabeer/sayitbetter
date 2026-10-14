export type Recipient = 
  | 'friend'
  | 'crush'
  | 'boss'
  | 'family'
  | 'partner'
  | 'group_chat';

export type Personality = 
  | 'diplomat'
  | 'petty_polite'
  | 'unhinged_goblin'
  | 'delulu_romantic'
  | 'corporate_survivor'
  | 'gen_z_brainrot';

export type SafetyTier = 'standard' | 'sensitive_pivot' | 'crisis';

export type FalloutRisk = 'Low' | 'Medium' | 'High' | 'Catastrophic';

export interface DraftAnalysis {
  subtext: string;
  falloutRisk: FalloutRisk;
  predictedReaction: string;
  vibeTag: string;
}

export interface RewriteCard {
  id: 'ready_to_send' | 'funnier_alternative' | 'full_personality';
  title: string;
  subtitle: string;
  text: string;
  predictedReply?: string;
}

export interface RewriteResponse {
  safetyTier: SafetyTier;
  pivotExplanation?: string;
  emergencyResources?: string[];
  cards: RewriteCard[];
  analysis?: DraftAnalysis;
}

export type SarcasmLevel = 1 | 2 | 3 | 4 | 5;

export interface RewriteRequest {
  draft: string;
  recipient: Recipient;
  personality: Personality;
  sarcasmLevel?: SarcasmLevel;
}

export type MascotState = 'idle' | 'thinking' | 'success' | 'copied' | 'sensitive' | 'error';
