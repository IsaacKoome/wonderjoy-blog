export type ScanConfidence = 'low' | 'medium' | 'high';

export interface ScanObservation {
  label: string;
  summary: string;
  confidence: ScanConfidence;
}

export interface ScanResult {
  captureQuality: {
    status: 'good' | 'fair' | 'retake';
    score: number;
    notes: string[];
  };
  overview: string;
  observations: ScanObservation[];
  routine: {
    morning: string[];
    evening: string[];
  };
  focusForNextCheckIn: string;
  cautions: string[];
  disclaimer: string;
}

export interface ScanRequest {
  isAdult: boolean;
  captures: Array<{
    angle: 'front' | 'left' | 'right';
    dataUrl: string;
  }>;
  profile: {
    concerns: string[];
    skinFeel: string;
    notes: string;
  };
}
