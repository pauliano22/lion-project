// app/api/detect-deepfake/route.ts - Simple status API

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    processing_mode: 'client-side-only',
    model_source: 'hugging-face-external',
    model_url: 'https://huggingface.co/pauliano22/deepfake-audio-detector/resolve/main/deepfake_detector.onnx',
    note: 'All AI processing happens in the browser for maximum privacy and reliability',
    timestamp: new Date().toISOString()
  });
}

export async function POST() {
  return NextResponse.json({
    message: 'AI processing is now client-side only',
    redirect: 'Use the browser-based analyzer on the main page'
  });
}