// ==============================================================================
// 🎭 DUIX-AVATAR & HEYGEM VIDEO RENDERER ADAPTER — ADSHIELD ENTERPRISE 2026.4
// Generates exact composition specs, Picture-in-Picture coordinates,
// and rendering jobs for open-source AI video avatars (Duix-Avatar / HeyGem).
// ==============================================================================

import type { VideoPitchScript } from './videoPitchGenerator.ts';
import type { VisualEvidenceResult } from '../vision/playwrightEvidenceCapture.ts';

export interface AvatarVideoCompositionSpec {
  jobId: string;
  resolution: {
    width: number;
    height: number;
    aspectRatio: '9:16';
  };
  durationSeconds: number;
  layers: {
    backgroundEvidence: {
      type: 'IMAGE_PLAYWRIGHT_SCREENSHOT';
      url: string;
      scale: number;
      blurUnfocused: boolean;
      highlightBox: {
        color: string;
        label: string;
      };
    };
    avatarForeground: {
      type: 'DUIX_TALKING_AVATAR';
      position: 'BOTTOM_RIGHT';
      widthPercent: number;
      heightPercent: number;
      offsetX: number;
      offsetY: number;
      circularMask: boolean;
      shadow: boolean;
    };
    subtitles: {
      enabled: boolean;
      fontFamily: string;
      fontSizePx: number;
      textColor: string;
      backgroundColor: string;
      srtContent: string;
    };
  };
  audioTrack: {
    voiceModel: 'pt_BR_lucas_enterprise_v2';
    speed: number;
    speechText: string;
  };
  status: 'QUEUED' | 'RENDERING' | 'COMPLETED';
  mockVideoUrl: string;
}

/**
 * Creates a ready-to-render composition spec combining Playwright evidence and Duix-Avatar
 */
export function createAvatarVideoSpec(params: {
  script: VideoPitchScript;
  evidence: VisualEvidenceResult;
}): AvatarVideoCompositionSpec {
  const { script, evidence } = params;
  const jobId = `vjob_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  return {
    jobId,
    resolution: {
      width: 1080,
      height: 1920,
      aspectRatio: '9:16'
    },
    durationSeconds: script.estimatedDurationSeconds,
    layers: {
      backgroundEvidence: {
        type: 'IMAGE_PLAYWRIGHT_SCREENSHOT',
        url: evidence.mockScreenshotUrl,
        scale: 1.0,
        blurUnfocused: false,
        highlightBox: {
          color: '#ef4444',
          label: `🚨 TAMANHOS [${evidence.brokenSizes.join(', ')}] ESGOTADOS`
        }
      },
      avatarForeground: {
        type: 'DUIX_TALKING_AVATAR',
        position: 'BOTTOM_RIGHT',
        widthPercent: 38,
        heightPercent: 32,
        offsetX: 40,
        offsetY: 60,
        circularMask: true,
        shadow: true
      },
      subtitles: {
        enabled: true,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSizePx: 44,
        textColor: '#facc15', // Vibrant yellow for mobile high-contrast legibility
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        srtContent: script.subtitlesSrt
      }
    },
    audioTrack: {
      voiceModel: 'pt_BR_lucas_enterprise_v2',
      speed: 1.05,
      speechText: script.fullSpeechText
    },
    status: 'COMPLETED',
    mockVideoUrl: `https://leakfinder-green.vercel.app/api/avatar-pitch-preview?jobId=${jobId}&domain=${encodeURIComponent(script.storeDomain)}`
  };
}
