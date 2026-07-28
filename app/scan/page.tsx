import type { Metadata } from 'next';
import ScanExperience from './scan-experience';

export const metadata: Metadata = {
  title: 'AI Skin Check-In | WonderJoy AI',
  description:
    'Use your camera for a private, guided cosmetic skin check-in and receive a simple morning and evening skincare routine.',
  alternates: {
    canonical: 'https://wonderjoyai.com/scan',
  },
};

export default function ScanPage() {
  return <ScanExperience />;
}
