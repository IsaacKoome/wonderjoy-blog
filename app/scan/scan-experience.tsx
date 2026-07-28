'use client';

/* eslint-disable @next/next/no-img-element -- Camera captures are short-lived data URLs and cannot use Next Image. */

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScanRequest, ScanResult } from '@/lib/scan-types';
import styles from './scan.module.css';

type Phase = 'consent' | 'capture' | 'review' | 'details' | 'analyzing' | 'results';
type Capture = ScanRequest['captures'][number];

const CAPTURE_STEPS: Array<{ angle: Capture['angle']; eyebrow: string; title: string; instruction: string }> = [
  { angle: 'front', eyebrow: 'Photo 1 of 3', title: 'Look straight ahead', instruction: 'Center your face in the oval and keep a relaxed expression.' },
  { angle: 'left', eyebrow: 'Photo 2 of 3', title: 'Turn slightly left', instruction: 'Keep both cheeks visible. A small turn is enough.' },
  { angle: 'right', eyebrow: 'Photo 3 of 3', title: 'Turn slightly right', instruction: 'Keep the phone still and use the same lighting.' },
];

const CONCERNS = ['Breakouts', 'Dark marks', 'Dryness', 'Oil and shine', 'Uneven texture', 'Visible redness', 'Fine lines', 'Routine check'];
const SKIN_FEELS = [
  'Comfortable most of the day', 'Tight or dry after cleansing', 'Oily by midday',
  'Oily in some areas and dry in others', 'Easily irritated', 'Not sure yet',
];
const progressByPhase: Record<Phase, number> = { consent: 1, capture: 2, review: 2, details: 3, analyzing: 4, results: 4 };
const MAX_ANALYSIS_REQUEST_LENGTH = 3_800_000;
const DEFAULT_ANALYSIS_ERROR = 'The check-in could not be completed. Please try again.';

function responseErrorMessage(status: number) {
  if (status === 413) return 'Those photos are too large. Please retake them and try again.';
  if (status === 429) return 'The analyzer is busy right now. Please wait a minute and try again.';
  if (status === 502 || status === 503 || status === 504) return 'The analyzer could not reach its AI service. Please try again in a moment.';
  return DEFAULT_ANALYSIS_ERROR;
}

function CameraIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.4 5.5 9.6 4h4.8l1.2 1.5H19A2.5 2.5 0 0 1 21.5 8v9A2.5 2.5 0 0 1 19 19.5H5A2.5 2.5 0 0 1 2.5 17V8A2.5 2.5 0 0 1 5 5.5h3.4Z" /><circle cx="12" cy="12.5" r="3.5" /></svg>;
}

function ShieldIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8 19 5.6v5.8c0 4.5-2.8 8.1-7 9.8-4.2-1.7-7-5.3-7-9.8V5.6L12 2.8Z" /><path d="m8.9 12 2 2 4.3-4.5" /></svg>;
}

function SparkleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8c.7 4.3 2.9 6.5 7.2 7.2-4.3.7-6.5 2.9-7.2 7.2-.7-4.3-2.9-6.5-7.2-7.2 4.3-.7 6.5-2.9 7.2-7.2Z" /><path d="M19 16.5c.3 2 1.3 3 3.2 3.3-1.9.3-2.9 1.3-3.2 3.2-.3-1.9-1.3-2.9-3.2-3.2 1.9-.3 2.9-1.3 3.2-3.3Z" /></svg>;
}

function StepProgress({ phase }: { phase: Phase }) {
  const current = progressByPhase[phase];
  return <div className={styles.progressWrap} aria-label={`Step ${current} of 4`}>
    <div className={styles.progressLabels}><span>Step {current} of 4</span><span>{current === 4 ? 'Your check-in' : 'About 2 minutes'}</span></div>
    <div className={styles.progressTrack}><span style={{ width: `${current * 25}%` }} /></div>
  </div>;
}

export default function ScanExperience() {
  const [phase, setPhase] = useState<Phase>('consent');
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [processingConfirmed, setProcessingConfirmed] = useState(false);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [analysisError, setAnalysisError] = useState('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [skinFeel, setSkinFeel] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  }, []);

  useEffect(() => {
    if (phase !== 'capture') return;
    let cancelled = false;
    async function enableCamera() {
      setCameraError('');
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera access is not available in this browser. Try the latest Chrome or Safari on your phone.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } } });
        if (cancelled) { stream.getTracks().forEach((track) => track.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (error) {
        const denied = error instanceof DOMException && error.name === 'NotAllowedError';
        setCameraError(denied ? 'Camera permission was blocked. Allow camera access in your browser settings, then try again.' : 'We could not start your camera. Close other camera apps and try again.');
      }
    }
    void enableCamera();
    return () => { cancelled = true; stopCamera(); };
  }, [phase, stopCamera]);

  const currentStep = CAPTURE_STEPS[Math.min(captures.length, CAPTURE_STEPS.length - 1)];
  const canStart = adultConfirmed && processingConfirmed;

  function startCapture() {
    if (!canStart) return;
    setAnalysisError(''); setCaptures([]); setPhase('capture');
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video || !cameraReady || video.videoWidth === 0) return;
    const width = Math.min(960, video.videoWidth);
    const height = Math.round((video.videoHeight / video.videoWidth) * width);
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.translate(width, 0); context.scale(-1, 1); context.drawImage(video, 0, 0, width, height);
    const nextCaptures = [...captures, { angle: currentStep.angle, dataUrl: canvas.toDataURL('image/webp', 0.78) }];
    setCaptures(nextCaptures);
    if (nextCaptures.length === CAPTURE_STEPS.length) setPhase('review');
  }

  function toggleConcern(concern: string) {
    setConcerns((current) => current.includes(concern) ? current.filter((item) => item !== concern) : current.length < 3 ? [...current, concern] : current);
  }

  async function analyze() {
    if (captures.length !== 3 || concerns.length === 0 || !skinFeel) return;
    setPhase('analyzing'); setAnalysisError('');
    const payload: ScanRequest = { isAdult: true, captures, profile: { concerns, skinFeel, notes: notes.trim().slice(0, 300) } };
    try {
      const requestBody = JSON.stringify(payload);
      if (requestBody.length > MAX_ANALYSIS_REQUEST_LENGTH) {
        throw new Error('Those photos are too large. Please retake them and try again.');
      }

      const response = await fetch('/api/scan/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: requestBody });
      const responseText = await response.text();
      let responseBody: unknown;
      try {
        responseBody = responseText ? JSON.parse(responseText) : null;
      } catch {
        responseBody = null;
      }

      if (!response.ok) {
        const serverMessage = responseBody && typeof responseBody === 'object' && 'error' in responseBody && typeof responseBody.error === 'string'
          ? responseBody.error
          : responseErrorMessage(response.status);
        throw new Error(serverMessage);
      }
      if (!responseBody || typeof responseBody !== 'object' || !('observations' in responseBody)) {
        throw new Error(DEFAULT_ANALYSIS_ERROR);
      }
      setResult(responseBody as ScanResult); setCaptures([]); setPhase('results');
    } catch (error) {
      setAnalysisError(error instanceof Error ? error.message : DEFAULT_ANALYSIS_ERROR);
      setPhase('details');
    }
  }

  function resetScan() {
    stopCamera(); setCaptures([]); setConcerns([]); setSkinFeel(''); setNotes(''); setResult(null);
    setAnalysisError(''); setCameraError(''); setPhase('consent');
  }

  return <main className={styles.page}>
    <div className={styles.ambientOne} /><div className={styles.ambientTwo} />
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <div className={styles.kicker}><SparkleIcon /> AI-powered cosmetic check-in</div>
        <h1>Meet your skin,<br /><span>where it is today.</span></h1>
        <p>A guided camera check-in that turns visible skin patterns and your concerns into a simple routine you can follow.</p>
        <div className={styles.trustRow}><span><ShieldIcon /> No WonderJoy photo storage</span><span>18+ only</span><span>Not a medical diagnosis</span></div>
      </div>
      <div className={styles.heroOrb} aria-hidden="true"><div className={styles.orbRing} /><span>2 min</span><small>guided check-in</small></div>
    </section>

    <section className={styles.workspace} aria-live="polite">
      <StepProgress phase={phase} />

      {phase === 'consent' && <div className={styles.twoColumn}>
        <div className={styles.primaryCard}>
          <div className={styles.sectionIcon}><CameraIcon /></div><p className={styles.eyebrow}>Before we begin</p><h2>A clear, private check-in</h2>
          <p className={styles.lead}>We will guide you through three quick camera angles. Remove makeup if practical, face a window, and avoid beauty filters.</p>
          <div className={styles.prepGrid}><div><b>01</b><span>Use soft, even light</span></div><div><b>02</b><span>Keep your face uncovered</span></div><div><b>03</b><span>Hold the phone at eye level</span></div></div>
          <label className={styles.consentRow}><input type="checkbox" checked={adultConfirmed} onChange={(e) => setAdultConfirmed(e.target.checked)} /><span>I confirm that I am 18 or older.</span></label>
          <label className={styles.consentRow}><input type="checkbox" checked={processingConfirmed} onChange={(e) => setProcessingConfirmed(e.target.checked)} /><span>I consent to sending these captures to WonderJoy&apos;s AI provider for this one check-in. WonderJoy does not save them to a database or file. Read our <Link href="/privacy">privacy policy</Link>.</span></label>
          <button className={styles.primaryButton} disabled={!canStart} onClick={startCapture}>Open my camera <span aria-hidden="true">→</span></button>
        </div>
        <aside className={styles.sideCard}><p className={styles.eyebrow}>What this can do</p><h3>Notice. Simplify. Track.</h3>
          <ul className={styles.checkList}><li>Describe visible cosmetic patterns</li><li>Suggest a gentle AM and PM routine</li><li>Give you one focus for your next check-in</li></ul>
          <div className={styles.boundaryNote}><ShieldIcon /><p><strong>A helpful boundary</strong>This tool cannot diagnose acne, rosacea, eczema, skin cancer, or any medical condition. See a qualified clinician for pain, bleeding, rapidly changing spots, or persistent symptoms.</p></div>
        </aside>
      </div>}

      {phase === 'capture' && <div className={styles.captureLayout}>
        <div className={styles.cameraCard}><div className={styles.cameraViewport}><video ref={videoRef} muted playsInline className={styles.video} /><div className={styles.faceGuide} aria-hidden="true" />
          {!cameraReady && !cameraError && <div className={styles.cameraStatus}><span className={styles.spinner} /> Starting your camera…</div>}
          {cameraError && <div className={styles.cameraError} role="alert"><CameraIcon /><p>{cameraError}</p><button type="button" onClick={() => setPhase('consent')}>Go back</button></div>}
          <span className={styles.lightHint}>Face a window for the clearest result</span></div>
          <button className={styles.shutter} onClick={capturePhoto} disabled={!cameraReady} aria-label="Take photo"><span /></button>
        </div>
        <div className={styles.captureCopy}><p className={styles.eyebrow}>{currentStep.eyebrow}</p><h2>{currentStep.title}</h2><p>{currentStep.instruction}</p>
          <div className={styles.captureDots} aria-label={`${captures.length} of 3 photos captured`}>{CAPTURE_STEPS.map((step, index) => <span key={step.angle} className={index < captures.length ? styles.dotDone : index === captures.length ? styles.dotActive : ''} />)}</div>
          <div className={styles.captureChecklist}>
            <span>Light in front of you</span><span>Lens clean</span><span>No filters</span><span>Hold still</span>
          </div>
          <div className={styles.miniTip}><SparkleIcon /><span>Even front lighting helps the AI distinguish visible surface patterns from shadows. It cannot measure skin hydration.</span></div>
        </div>
      </div>}

      {phase === 'review' && <div className={styles.primaryCard}>
        <p className={styles.eyebrow}>Your three angles</p><h2>Quick quality check</h2><p className={styles.lead}>Make sure your whole face is visible and the photos are not blurry or strongly shadowed.</p>
        <div className={styles.reviewGrid}>{captures.map((capture, index) => <figure key={capture.angle}><img src={capture.dataUrl} alt={`${CAPTURE_STEPS[index].title} capture`} /><figcaption>{CAPTURE_STEPS[index].title}</figcaption></figure>)}</div>
        <div className={styles.buttonRow}><button className={styles.secondaryButton} onClick={() => { setCaptures([]); setCameraError(''); setPhase('capture'); }}>Retake photos</button><button className={styles.primaryButton} onClick={() => setPhase('details')}>They look clear <span>→</span></button></div>
      </div>}

      {phase === 'details' && <div className={styles.twoColumnDetails}>
        <div className={styles.primaryCard}><p className={styles.eyebrow}>Personalize the check-in</p><h2>What would you like to understand?</h2>
          <div className={styles.fieldHeader}><label>Choose up to 3 concerns</label><span>{concerns.length}/3 selected</span></div>
          <div className={styles.chipGrid}>{CONCERNS.map((concern) => { const selected = concerns.includes(concern); return <button type="button" key={concern} className={selected ? styles.chipSelected : styles.chip} onClick={() => toggleConcern(concern)} aria-pressed={selected} disabled={!selected && concerns.length >= 3}>{selected && <span>✓</span>}{concern}</button>; })}</div>
          <label className={styles.fieldLabel} htmlFor="skin-feel">How does your skin usually feel?</label>
          <select id="skin-feel" value={skinFeel} onChange={(e) => setSkinFeel(e.target.value)} className={styles.select}><option value="">Choose the closest answer</option>{SKIN_FEELS.map((feel) => <option key={feel}>{feel}</option>)}</select>
          <label className={styles.fieldLabel} htmlFor="scan-notes">Anything useful to add? <span>Optional</span></label>
          <textarea id="scan-notes" value={notes} maxLength={300} onChange={(e) => setNotes(e.target.value)} placeholder="For example: I started a new cleanser two weeks ago." className={styles.textarea} />
          {analysisError && <p className={styles.inlineError} role="alert">{analysisError}</p>}
          <div className={styles.buttonRow}><button className={styles.secondaryButton} onClick={() => setPhase('review')}>Back</button><button className={styles.primaryButton} onClick={() => void analyze()} disabled={concerns.length === 0 || !skinFeel}>Analyze my check-in <SparkleIcon /></button></div>
        </div>
        <aside className={styles.photoSummary}>{captures[0] && <img src={captures[0].dataUrl} alt="Your front-facing check-in capture" />}<div><ShieldIcon /><p><strong>Private by design</strong>Captures stay in this browser until you request analysis. WonderJoy does not save them after the request.</p></div></aside>
      </div>}

      {phase === 'analyzing' && <div className={styles.analyzingCard}><div className={styles.analysisOrb}><SparkleIcon /><span className={styles.orbitOne} /><span className={styles.orbitTwo} /></div><p className={styles.eyebrow}>Creating your check-in</p><h2>Reading the visible patterns</h2><p>We are checking image quality, comparing the three angles, and building a gentle routine around your answers.</p><div className={styles.loadingLine}><span /></div><small>Please keep this page open. This usually takes under a minute.</small></div>}

      {phase === 'results' && result && <div className={styles.resultsWrap}>
        <div className={styles.resultsHero}><div><p className={styles.eyebrow}>Today&apos;s cosmetic check-in</p><h2>Your skin snapshot</h2><p>{result.overview}</p></div><div className={styles.qualitySummary}>
          <div className={styles.clarityScore}><span>AI capture clarity</span><strong>{result.captureQuality.score}<small>/10</small></strong><em>Photo readability—not a skin score</em></div>
          <div className={`${styles.qualityBadge} ${styles[`quality${result.captureQuality.status}`]}`}><span /> Capture quality: {result.captureQuality.status}</div>
        </div></div>
        {result.captureQuality.notes.length > 0 && <div className={styles.qualityNotes}>{result.captureQuality.notes.map((note) => <span key={note}>{note}</span>)}</div>}
        <div className={styles.observationGrid}>{result.observations.map((observation) => <article key={observation.label} className={styles.observationCard}><div><span>{observation.confidence} confidence</span><SparkleIcon /></div><h3>{observation.label}</h3><p>{observation.summary}</p></article>)}</div>
        <div className={styles.routineGrid}><article className={styles.routineCard}><p className={styles.eyebrow}>Morning</p><h3>Protect and support</h3><ol>{result.routine.morning.map((step) => <li key={step}>{step}</li>)}</ol></article><article className={styles.routineCardDark}><p className={styles.eyebrow}>Evening</p><h3>Cleanse and recover</h3><ol>{result.routine.evening.map((step) => <li key={step}>{step}</li>)}</ol></article></div>
        <div className={styles.focusCard}><SparkleIcon /><div><p className={styles.eyebrow}>Focus before your next check-in</p><h3>{result.focusForNextCheckIn}</h3></div></div>
        {result.cautions.length > 0 && <div className={styles.cautions}><strong>Keep it gentle</strong><ul>{result.cautions.map((caution) => <li key={caution}>{caution}</li>)}</ul></div>}
        <p className={styles.disclaimer}>{result.disclaimer}</p><div className={styles.buttonRowCenter}><button className={styles.secondaryButton} onClick={resetScan}>Start a new check-in</button><Link className={styles.primaryLink} href="/articles">Explore the skincare library <span>→</span></Link></div>
      </div>}
    </section>

    <section className={styles.howItWorks}><p className={styles.eyebrow}>Designed for consistency, not perfection</p><h2>A calmer way to understand your routine</h2><div>
      <article><span>01</span><h3>Capture</h3><p>Three guided angles create a more balanced visual check-in than one selfie.</p></article>
      <article><span>02</span><h3>Understand</h3><p>Visible cosmetic patterns are translated into plain, cautious language.</p></article>
      <article><span>03</span><h3>Act gently</h3><p>You leave with a focused routine—without buying ten new products.</p></article>
    </div></section>
  </main>;
}
