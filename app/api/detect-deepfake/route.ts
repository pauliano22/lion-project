import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64 (required by your Python server)
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

    // Call your Python server with the CORRECT endpoint and format
    const response = await fetch('http://localhost:8765/api/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_data: audioBase64,
        url: 'Next.js App',
        source: 'File Upload'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Python server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Transform your Python server response to match your interface
    return NextResponse.json({
      is_fake: result.prediction === 'FAKE',
      confidence: Math.round(result.confidence * 100),
      processing_time: 2.0, // You can add this to your Python response if needed
      model_version: 'v1.0.0'
    });

  } catch (error) {
    console.error('Detection error:', error);
    return NextResponse.json(
      { error: 'Detection failed. Please try again.' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const maxDuration = 30;