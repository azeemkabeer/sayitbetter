import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { rateLimiter } from './src/lib/rate-limiter';
import { generateRewrite } from './src/lib/gemini';
import { Recipient, Personality } from './src/lib/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parser with error handling for malformed JSON
app.use(express.json({ limit: '100kb' }));
app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    res.status(400).json({ error: 'Malformed JSON payload.' });
    return;
  }
  next(err);
});

// Helper to extract client IP
function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

const VALID_RECIPIENTS: Recipient[] = ['friend', 'crush', 'boss', 'family', 'partner', 'group_chat'];
const VALID_PERSONALITIES: Personality[] = [
  'diplomat',
  'petty_polite',
  'unhinged_goblin',
  'delulu_romantic',
  'corporate_survivor',
  'gen_z_brainrot',
];

// API Route: POST /api/rewrite
app.post('/api/rewrite', async (req: Request, res: Response): Promise<void> => {
  try {
    const clientIp = getClientIp(req);

    // Rate Limiter Check (10 req/hr per IP)
    const rateLimit = rateLimiter.check(clientIp);
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());

    if (!rateLimit.allowed) {
      if (rateLimit.retryAfterSeconds) {
        res.setHeader('Retry-After', rateLimit.retryAfterSeconds.toString());
      }
      res.status(429).json({
        error: 'Rate limit exceeded. Maximum 10 rewrites per hour. Please try again later.',
        retryAfter: rateLimit.retryAfterSeconds,
      });
      return;
    }

    const { draft, recipient, personality, sarcasmLevel } = req.body || {};

    // Input Validation
    if (typeof draft !== 'string') {
      res.status(400).json({ error: 'Draft message must be a string.' });
      return;
    }

    const trimmedDraft = draft.trim();
    if (trimmedDraft.length < 5) {
      res.status(400).json({ error: 'Draft message must be at least 5 characters.' });
      return;
    }

    if (trimmedDraft.length > 400) {
      res.status(400).json({ error: 'Draft message cannot exceed 400 characters.' });
      return;
    }

    if (!VALID_RECIPIENTS.includes(recipient)) {
      res.status(400).json({ error: `Invalid recipient: must be one of ${VALID_RECIPIENTS.join(', ')}` });
      return;
    }

    if (!VALID_PERSONALITIES.includes(personality)) {
      res.status(400).json({ error: `Invalid personality: must be one of ${VALID_PERSONALITIES.join(', ')}` });
      return;
    }

    const parsedSarcasm = typeof sarcasmLevel === 'number' && sarcasmLevel >= 1 && sarcasmLevel <= 5
      ? Math.round(sarcasmLevel)
      : 3;

    // Call Gemini with timeout
    const result = await generateRewrite(trimmedDraft, recipient, personality, parsedSarcasm);
    res.status(200).json(result);
  } catch (error: unknown) {
    const err = error as { name?: string; message?: string };
    console.error('API /api/rewrite error:', err?.message || 'Internal processing error');
    if (err?.name === 'TimeoutError' || err?.message === 'GATEWAY_TIMEOUT') {
      res.status(504).json({
        error: 'The calibration took too long. Please try again with a shorter draft.',
      });
      return;
    }

    res.status(500).json({
      error: 'Unable to calibrate message at this time. Please tap Try Again.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    // Server running on configured PORT
  });
}

startServer();
