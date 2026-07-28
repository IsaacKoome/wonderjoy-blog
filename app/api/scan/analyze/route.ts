import { NextResponse } from 'next/server';
import type { ScanRequest, ScanResult } from '@/lib/scan-types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_CAPTURE_LENGTH = 2_000_000;
const MAX_REQUEST_LENGTH = 4_000_000;
const ALLOWED_CONCERNS = new Set([
  'Breakouts', 'Dark marks', 'Dryness', 'Oil and shine', 'Uneven texture',
  'Visible redness', 'Fine lines', 'Routine check',
]);
const ALLOWED_ANGLES = new Set(['front', 'left', 'right']);

const resultSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    captureQuality: {
      type: 'object',
      additionalProperties: false,
      properties: {
        status: { type: 'string', enum: ['good', 'fair', 'retake'] },
        notes: { type: 'array', items: { type: 'string' }, minItems: 0, maxItems: 3 },
      },
      required: ['status', 'notes'],
    },
    overview: { type: 'string' },
    observations: {
      type: 'array', minItems: 2, maxItems: 4,
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          label: { type: 'string' },
          summary: { type: 'string' },
          confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
        },
        required: ['label', 'summary', 'confidence'],
      },
    },
    routine: {
      type: 'object', additionalProperties: false,
      properties: {
        morning: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 4 },
        evening: { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 4 },
      },
      required: ['morning', 'evening'],
    },
    focusForNextCheckIn: { type: 'string' },
    cautions: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 3 },
    disclaimer: { type: 'string' },
  },
  required: ['captureQuality', 'overview', 'observations', 'routine', 'focusForNextCheckIn', 'cautions', 'disclaimer'],
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validStringArray(value: unknown, min: number, max: number) {
  return Array.isArray(value) && value.length >= min && value.length <= max &&
    value.every((item) => typeof item === 'string' && item.length > 0 && item.length < 500);
}

function isScanResult(value: unknown): value is ScanResult {
  if (!isPlainObject(value) || !isPlainObject(value.captureQuality) || !isPlainObject(value.routine)) return false;
  const quality = value.captureQuality;
  const routine = value.routine;
  const observations = value.observations;
  return (
    ['good', 'fair', 'retake'].includes(String(quality.status)) &&
    validStringArray(quality.notes, 0, 3) &&
    typeof value.overview === 'string' && value.overview.length > 0 && value.overview.length < 1200 &&
    Array.isArray(observations) && observations.length >= 2 && observations.length <= 4 &&
    observations.every((item) => isPlainObject(item) && typeof item.label === 'string' &&
      typeof item.summary === 'string' && ['low', 'medium', 'high'].includes(String(item.confidence))) &&
    validStringArray(routine.morning, 2, 4) && validStringArray(routine.evening, 2, 4) &&
    typeof value.focusForNextCheckIn === 'string' && validStringArray(value.cautions, 1, 3) &&
    typeof value.disclaimer === 'string'
  );
}

function parseDataUrl(dataUrl: string) {
  const match = /^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  return match ? { mimeType: match[1], data: match[2] } : null;
}

function isValidRequest(value: unknown): value is ScanRequest {
  if (!isPlainObject(value) || value.isAdult !== true || !Array.isArray(value.captures) || !isPlainObject(value.profile)) return false;
  if (value.captures.length !== 3) return false;
  const angles = new Set<string>();
  for (const capture of value.captures) {
    if (!isPlainObject(capture) || typeof capture.angle !== 'string' || typeof capture.dataUrl !== 'string') return false;
    if (!ALLOWED_ANGLES.has(capture.angle) || capture.dataUrl.length > MAX_CAPTURE_LENGTH || !parseDataUrl(capture.dataUrl)) return false;
    angles.add(capture.angle);
  }
  const { concerns, skinFeel, notes } = value.profile;
  return angles.size === 3 && Array.isArray(concerns) && concerns.length >= 1 && concerns.length <= 3 &&
    concerns.every((concern) => typeof concern === 'string' && ALLOWED_CONCERNS.has(concern)) &&
    typeof skinFeel === 'string' && skinFeel.length > 0 && skinFeel.length < 120 &&
    typeof notes === 'string' && notes.length <= 300;
}

function buildPrompt(request: ScanRequest) {
  return `You are the cosmetic skincare check-in assistant for WonderJoy AI.

Analyze the three user-provided face captures only for visible, non-medical cosmetic patterns. The angles are front, slight left, and slight right.

User-selected concerns: ${request.profile.concerns.join(', ')}
How their skin usually feels: ${request.profile.skinFeel}
Optional context: ${request.profile.notes || 'None provided'}

Safety and quality rules:
- This is educational cosmetic guidance, not diagnosis, triage, or treatment.
- Never identify or speculate about diseases or conditions, including acne diagnosis, rosacea, eczema, infection, allergy, or skin cancer.
- Do not assess moles, lesions, wounds, or suspicious spots. If relevant, advise professional evaluation without describing a diagnosis.
- Discuss only clearly visible patterns such as apparent surface shine, visible flaking or dryness, visible blemishes, post-blemish-looking marks, uneven-looking tone, or texture.
- Do not infer age, ethnicity, health status, hormones, lifestyle, or sensitive traits from the images.
- Do not assign numeric skin scores or claim precise measurements.
- If lighting, blur, framing, makeup, or filters limit reliability, lower confidence and say so. Set captureQuality.status to retake if the images are too poor to support useful observations.
- Keep the routine gentle, low-cost, and ingredient-category based. Do not prescribe medicines. Recommend patch testing, one new product at a time, moisturizer, and broad-spectrum SPF 30+ where relevant.
- Use short, calm, supportive sentences. Avoid certainty words such as definitely, proven from your photo, or diagnosed.
- The disclaimer must say this is not medical advice and advise a qualified clinician for painful, bleeding, rapidly changing, severe, or persistent concerns.

Return only the requested structured JSON.`;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') || '0');
  if (contentLength > MAX_REQUEST_LENGTH) {
    return NextResponse.json({ error: 'Those photos are too large. Please retake them and try again.' }, { status: 413 });
  }
  let body: unknown;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: 'The check-in request was not valid.' }, { status: 400 }); }
  if (!isValidRequest(body)) {
    return NextResponse.json({ error: 'Please complete all three photos and the short questionnaire.' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Skin analysis is not configured yet. Add GEMINI_API_KEY to the deployment environment and try again.' }, { status: 503 });
  }

  const model = (process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite').trim();
  const imageParts = body.captures.map((capture) => {
    const parsed = parseDataUrl(capture.dataUrl)!;
    return { inlineData: { mimeType: parsed.mimeType, data: parsed.data } };
  });

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: buildPrompt(body) }, ...imageParts] }],
        generationConfig: {
          maxOutputTokens: 2200,
          responseMimeType: 'application/json',
          responseJsonSchema: resultSchema,
        },
      }),
      signal: AbortSignal.timeout(55_000),
    });
    if (!response.ok) {
      const providerError = await response.text();
      let providerMessage = response.statusText;
      try {
        const parsed = JSON.parse(providerError) as { error?: { message?: string; status?: string } };
        providerMessage = parsed.error?.message || parsed.error?.status || providerMessage;
      } catch {
        // Keep the status text when the provider did not return JSON.
      }
      console.error('[scan] Gemini request failed', {
        status: response.status,
        model,
        message: providerMessage.slice(0, 500),
      });

      if (response.status === 429) {
        return NextResponse.json({ error: 'The analyzer is busy right now. Please wait a minute and try again.' }, { status: 429 });
      }

      return NextResponse.json({
        error: response.status === 401 || response.status === 403
          ? 'The analyzer is temporarily unavailable while its secure connection is restored.'
          : response.status === 404
            ? 'The selected analysis model is temporarily unavailable.'
            : 'The AI provider could not complete this check-in. Please try again.',
      }, { status: 503 });
    }
    const providerBody = (await response.json()) as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = providerBody.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === 'string')?.text;
    if (!text) return NextResponse.json({ error: 'The analyzer returned no usable result. Please try again.' }, { status: 503 });
    const result: unknown = JSON.parse(text);
    if (!isScanResult(result)) return NextResponse.json({ error: 'The analyzer returned an incomplete result. Please try again.' }, { status: 503 });
    return NextResponse.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'TimeoutError';
    console.error('[scan] Analysis failed before a valid result was returned', {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message.slice(0, 500) : 'Unknown error',
    });
    return NextResponse.json({ error: timedOut ? 'The analysis took too long. Please try again.' : 'The check-in could not be completed. Please try again.' }, { status: timedOut ? 504 : 503 });
  }
}
