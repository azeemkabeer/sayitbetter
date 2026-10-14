/**
 * Chat integration utilities for WhatsApp, Instagram, and clipboard parsing.
 */

export interface ChatCleanResult {
  cleanedText: string;
  detectedSender?: string;
  wasCleaned: boolean;
}

/**
 * Intelligent cleaner that detects and strips WhatsApp / Instagram chat metadata,
 * timestamps, and sender prefixes from copied conversations.
 *
 * Examples handled:
 * - "[14/10/2026, 11:42:15] Alex: Why didn't you call me?" -> "Why didn't you call me?"
 * - "10/14/26, 2:30 PM - Mom: Are you coming home?" -> "Are you coming home?"
 * - "[14:32] Sarah: We need to talk about yesterday." -> "We need to talk about yesterday."
 * - "Alex: Stop sending me emails at 3am." -> "Stop sending me emails at 3am."
 * - Instagram DM copy format: "username\n12h\nI really don't appreciate that" -> "I really don't appreciate that"
 */
export function cleanChatImport(raw: string): ChatCleanResult {
  if (!raw || typeof raw !== 'string') {
    return { cleanedText: '', wasCleaned: false };
  }

  let text = raw.trim();
  let detectedSender: string | undefined;
  let wasCleaned = false;

  // Pattern 1: WhatsApp export bracket format: [dd/mm/yy, hh:mm:ss] Name: Message
  // or [mm/dd/yyyy, hh:mm:ss AM] Name: Message
  const bracketRegex = /^\[\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s+[APap][Mm])?\]\s+([^:]+):\s+([\s\S]+)$/;
  const matchBracket = text.match(bracketRegex);
  if (matchBracket) {
    detectedSender = matchBracket[1].trim();
    text = matchBracket[2].trim();
    wasCleaned = true;
  }

  // Pattern 2: WhatsApp dash format: 14/10/26, 11:42 - Name: Message
  if (!wasCleaned) {
    const dashRegex = /^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4},?\s+\d{1,2}:\d{2}(?:\s+[APap][Mm])?\s*-\s*([^:]+):\s+([\s\S]+)$/;
    const matchDash = text.match(dashRegex);
    if (matchDash) {
      detectedSender = matchDash[1].trim();
      text = matchDash[2].trim();
      wasCleaned = true;
    }
  }

  // Pattern 3: Simple timestamp prefix: [12:45] Name: Message or 12:45 PM Name: Message
  if (!wasCleaned) {
    const simpleTimeRegex = /^\[?\d{1,2}:\d{2}(?:\s+[APap][Mm])?\]?\s+([^:]+):\s+([\s\S]+)$/;
    const matchSimple = text.match(simpleTimeRegex);
    if (matchSimple) {
      detectedSender = matchSimple[1].trim();
      text = matchSimple[2].trim();
      wasCleaned = true;
    }
  }

  // Pattern 4: Instagram DM copy multi-line format:
  // line 1: username
  // line 2: 2h / 1d / active now (time indicator)
  // line 3+: message text
  if (!wasCleaned && text.includes('\n')) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 3) {
      const timeIndicatorRegex = /^(\d+[smhdwy]|active\s+now|sent|delivered)$/i;
      if (timeIndicatorRegex.test(lines[1])) {
        detectedSender = lines[0];
        text = lines.slice(2).join('\n');
        wasCleaned = true;
      }
    }
  }

  // Pattern 5: Simple "Name: Message" format (e.g. "Alex: We have a problem")
  if (!wasCleaned) {
    const namePrefixRegex = /^([A-Z][a-zA-Z0-9_\s]{1,20}):\s+([\s\S]+)$/;
    const matchName = text.match(namePrefixRegex);
    if (matchName) {
      detectedSender = matchName[1].trim();
      text = matchName[2].trim();
      wasCleaned = true;
    }
  }

  // Remove surrounding quotes if user copied quotes
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    text = text.substring(1, text.length - 1).trim();
  }

  // Clamp to 400 characters if over limit
  if (text.length > 400) {
    text = text.slice(0, 400);
    wasCleaned = true;
  }

  return {
    cleanedText: text,
    detectedSender,
    wasCleaned,
  };
}

/**
 * Launch WhatsApp with the message pre-filled directly in the chat draft
 * Works across both WhatsApp Web (desktop) and native WhatsApp Mobile apps.
 */
export function sendToWhatsApp(message: string): void {
  const encoded = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Open Instagram Direct Inbox and copy message text to clipboard
 * Due to Instagram's privacy & spam architecture, web links cannot pre-fill DM contents,
 * so this copies the text to the clipboard and directly launches the Instagram DM inbox.
 */
export async function openInstagramDirect(
  message: string
): Promise<{ success: boolean; copied: boolean }> {
  let copied = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(message);
      copied = true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = message;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      copied = true;
    }
  } catch (err) {
    console.warn('Clipboard write failed:', err);
  }

  // Open Instagram Direct Inbox
  window.open('https://instagram.com/direct/inbox/', '_blank', 'noopener,noreferrer');

  return { success: true, copied };
}

/**
 * Native OS share sheet (Supported on mobile Safari, Chrome, Android, etc.)
 */
export async function triggerNativeShare(
  title: string,
  text: string
): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
      });
      return true;
    } catch (err) {
      // User cancelled share or share failed
      return false;
    }
  }
  return false;
}
