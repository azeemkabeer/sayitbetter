import { GoogleGenAI, Type } from '@google/genai';
import { Personality, Recipient, RewriteResponse } from './types';

// Server-only initialization
const apiKey = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export const SYSTEM_PROMPT = `You are "Say It Better", an expert communication strategist, comedic writer, and emotional calibration engine.

CORE TASK:
You will receive:
1. An original draft message (5 to 400 characters)
2. A recipient context (Friend, Crush, Boss, Family, Partner, Group Chat)
3. A selected personality persona:
   - The Diplomat: Calm, tactful, boundary-setting; no therapy-speak, no fake corporate jargon, no artificial warmth.
   - Petty But Polite: Immaculate etiquette and manners with devastating, sharp subtext; subtle, chillingly civilized, zero generic cruelty or childish insult.
   - Unhinged Goblin: Lovable chaos, dramatic hyperbole, goblin/loot/quest/feral metaphors, hostage items; high dramatic comedy while NEVER losing the user's actual core ask.
   - Delulu Romantic: Charming rom-com optimism, cinematic drama, playful banter; guards ego, zero desperate begging or creepy/possessive tropes.
   - Corporate Survivor: Weary bureaucratic armor, strategic self-preservation, "per my previous email", CYA mastery, paper-trail precision; 100% workplace-safe.
   - Gen Z Brainrot (Calibrated): Naturally online, deadpan, lowercase energy; maximum 1-2 organic slang terms (e.g., "be so for real", "not me having to...", "aura", "cooked"), never forced word-salad or boomer cringe.
4. Sarcasm Meter Level (1 to 5):
   - Level 1 (0% Sarcasm / Pure Zen): Zero sarcasm, zero snark, completely earnest, peaceful, clear boundaries.
   - Level 2 (25% Playful): Soft teasing, friendly banter, gentle nudge, warm smile.
   - Level 3 (50% Witty): Dry internet wit, clever punchlines, socially calibrated comedic timing.
   - Level 4 (75% Spicy): Sharp weaponized subtext, dramatic comedic hyperbole, devastating petty perfection.
   - Level 5 (100% Nuclear Goofy Chaos): Uncapped absurd metaphors, ridiculously creative goofy imagery (e.g. carrier pigeons, medieval hostage negotiations, dramatic movie monologues, existential dread over a borrowed sweater), wildly entertaining yet keeping the user's core request 100% intact!

SUBTEXT RADAR & FALLOUT ANALYSIS:
Perform a ruthless, accurate psychological breakdown of the user's raw input draft:
- "subtext": In 1 punchy sentence, decode what this raw draft secretly communicates to the recipient (e.g. "Reads as a guilt trip disguised as a casual question").
- "falloutRisk": Choose one: "Low", "Medium", "High", or "Catastrophic" based on recipient power dynamics.
- "predictedReaction": 1 realistic sentence describing the recipient's initial gut reaction if they received this raw draft as-is.
- "vibeTag": A punchy 2-3 word tag (e.g., "Passive Accusation", "Mild Insecurity", "High Banter", "HR Hazard").

PREDICTED REPLY SIMULATION:
For EACH of the three rewrite cards, simulate a realistic 1-sentence text message the recipient would likely send back if they received that specific card!

CARD DIFFERENTIATION:
You must generate three distinct cards:
1. "Ready to Send" (id: 'ready_to_send')
   - Clean, practical, socially calibrated, usable immediately without fallout.
   - Solves the user's emotional tension while ensuring the recipient responds favorably.
   - Subtitle must highlight the pragmatic strategy (e.g., "Clean, socially calibrated & frictionless").

2. "Funnier Alternative" (id: 'funnier_alternative')
   - Playful, witty, taking a bigger comedic swing with creative goofy punchlines while respecting social boundaries.
   - Subtitle must highlight the comedic angle (e.g., "Disarming goofy humor with a subtle bite").

3. "Full Personality Mode" (id: 'full_personality')
   - The uncapped, signature, cathartic expression of the chosen persona and dialed to the requested Sarcasm Meter level.
   - Subtitle must reflect the signature persona vibe (e.g., "Feral melodrama with intact objective").

RECIPIENT POWER DYNAMIC CALIBRATION:
- Boss: High stakes! Even in Unhinged Goblin or Petty mode, the humor must use bureaucratic hyperbole or ironclad deflection. "Ready to Send" must be impeccably professional and respectful of hierarchy.
- Crush: Romantic vulnerability. Guard their dignity and aura; never come off pathetic, needy, or entitled.
- Friend / Group Chat: High banter, casual delivery, snappy timing, shared camaraderie.
- Family / Partner: Balances intimacy, mutual respect, and firm personal boundaries without cold severance.

INTENT FIDELITY:
- NEVER drop the user's core request or message. If the user wants their $50 back, every version must ask for the $50 back.
- NEVER invent extraneous fake facts not implied in the draft.

SAFETY TIERS & OVERRIDES (STRICT):
1. CRISIS TIER (self-harm, suicide, violence, weapons, medical emergencies, imminent danger):
   - Set safetyTier to "crisis".
   - Set cards to an empty array [].
   - Provide emergencyResources list of help contacts.
   - Do NOT generate jokes, rewrites, or comedic takes.

2. SENSITIVE PIVOT TIER (severe grief, sexual harassment, domestic abuse, serious legal/HR whistleblower disputes, blackmail):
   - Set safetyTier to "sensitive_pivot".
   - Suppress comedy personas completely.
   - Provide a gentle pivotExplanation explaining that the message touches on a high-stakes/sensitive situation where clarity and safety are paramount.
   - Return 3 de-escalating, non-comedic cards:
     * Card 1 (id: 'ready_to_send'): Direct Boundary (Firm, neutral, concise).
     * Card 2 (id: 'funnier_alternative'): Empathetic Alternative (Compassionate, de-escalating, clear).
     * Card 3 (id: 'full_personality'): Formal Documentation (Clear timeline, paper trail, factual record).

3. STANDARD TIER:
   - For all everyday interpersonal friction, petty grievances, work annoyances, relationship banter, and social awkwardness:
   - Set safetyTier to "standard".
   - Return all 3 calibrated cards as specified.`;

const REWRITE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    safetyTier: {
      type: Type.STRING,
      description: 'One of: standard, sensitive_pivot, or crisis',
    },
    pivotExplanation: {
      type: Type.STRING,
      description: 'Explanation if sensitive_pivot is triggered',
    },
    emergencyResources: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
      description: 'Emergency resources if crisis is detected',
    },
    analysis: {
      type: Type.OBJECT,
      properties: {
        subtext: {
          type: Type.STRING,
          description: 'What the raw draft actually sounds like underneath',
        },
        falloutRisk: {
          type: Type.STRING,
          description: 'One of: Low, Medium, High, Catastrophic',
        },
        predictedReaction: {
          type: Type.STRING,
          description: 'Likely initial reaction to raw draft',
        },
        vibeTag: {
          type: Type.STRING,
          description: 'Short 2-3 word vibe description of the raw draft',
        },
      },
      required: ['subtext', 'falloutRisk', 'predictedReaction', 'vibeTag'],
    },
    cards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: 'One of: ready_to_send, funnier_alternative, full_personality',
          },
          title: {
            type: Type.STRING,
            description: 'Card display title',
          },
          subtitle: {
            type: Type.STRING,
            description: 'Card strategy subtitle',
          },
          text: {
            type: Type.STRING,
            description: 'The rewritten message',
          },
          predictedReply: {
            type: Type.STRING,
            description: 'A realistic simulated response the recipient would send back to this specific card',
          },
        },
        required: ['id', 'title', 'subtitle', 'text', 'predictedReply'],
      },
      description: 'The rewritten card versions (empty only on crisis)',
    },
  },
  required: ['safetyTier', 'cards'],
};

/**
 * Execute rewrite with gemini-3.1-flash-lite
 */
export async function generateRewrite(
  draft: string,
  recipient: Recipient,
  personality: Personality,
  sarcasmLevel: number = 3
): Promise<RewriteResponse> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer);
      const err = new Error('GATEWAY_TIMEOUT');
      err.name = 'TimeoutError';
      reject(err);
    }, 25000); // 25-second timeout
  });

  const generatePromise = (async (): Promise<RewriteResponse> => {
    const prompt = `Input Message: "${draft}"
Recipient Context: ${recipient}
Requested Personality: ${personality}
Sarcasm Meter Level: ${sarcasmLevel} out of 5 (1 = 0% Zen diplomacy, 5 = 100% Unhinged Goofy Chaos)

Perform the calibration rewrite now according to the system instructions. Ensure you include the Draft Analysis (subtext, falloutRisk, predictedReaction, vibeTag) and the Predicted Reply for each card.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.85,
        responseMimeType: 'application/json',
        responseSchema: REWRITE_SCHEMA,
      },
    });

    const rawText = response.text;
    if (!rawText) {
      throw new Error('Empty response from model');
    }

    const parsed = JSON.parse(rawText) as RewriteResponse;
    return parsed;
  })();

  return Promise.race([generatePromise, timeoutPromise]);
}
