// app/api/detect-deepfake/route.ts - Server receives features, not raw audio

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Dynamic imports to avoid SSR issues
let ort: any = null;
let session: any = null;

async function initializeONNX() {
  if (!ort) {
    ort = await import('onnxruntime-web');
  }
  return ort;
}

async function loadModel() {
  if (!session) {
    try {
      console.log('🔄 Initializing ONNX Runtime...');
      const ort = await initializeONNX();
      
      const modelPath = path.join(process.cwd(), 'public', 'models', 'deepfake_detector.onnx');
      console.log('✅ Loading model from:', modelPath);
      
      session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ['cpu'],
      });
      
      console.log('✅ ONNX model loaded successfully');
      
    } catch (error) {
      console.error('❌ Failed to load ONNX model:', error);
      throw new Error(`Model loading failed: ${error}`);
    }
  }
  return session;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🎤 ===== STARTING DEEPFAKE DETECTION =====');
    
    const data = await request.json();
    
    if (!data.features) {
      console.error('❌ No features provided');
      return NextResponse.json(
        { error: 'No audio features provided' }, 
        { status: 400 }
      );
    }

    if (!data.file_info) {
      console.error('❌ No file info provided');
      return NextResponse.json(
        { error: 'No file info provided' }, 
        { status: 400 }
      );
    }

    console.log('📁 File info:', data.file_info);
    console.log('🔍 Features received:', data.features.length, 'values');

    // Validate features
    if (!Array.isArray(data.features) || data.features.length !== 16384) {
      console.error('❌ Invalid features:', data.features.length);
      return NextResponse.json(
        { error: `Invalid features length. Expected 16384, got ${data.features.length}` }, 
        { status: 400 }
      );
    }

    // Convert features back to Float32Array
    const features = new Float32Array(data.features);
    console.log('✅ Features converted to Float32Array');

    // Load model and run inference
    console.log('🔍 ===== STARTING MODEL INFERENCE =====');
    try {
      const ort = await initializeONNX();
      const modelSession = await loadModel();

      // Create input tensor
      const inputTensor = new ort.Tensor('float32', features, [1, 1, 128, 128]);
      console.log('✅ Input tensor created');
      
      console.log('🧠 Running ONNX inference...');
      const outputs = await modelSession.run({ audio_features: inputTensor });
      console.log('✅ ONNX inference completed');
      
      // Process results
      const predictions = outputs.predictions.data as Float32Array;
      console.log('Raw predictions:', Array.from(predictions));
      
      const realScore = predictions[0];
      const fakeScore = predictions[1];
      
      // Apply softmax
      const expReal = Math.exp(realScore);
      const expFake = Math.exp(fakeScore);
      const sum = expReal + expFake;
      
      const realProb = expReal / sum;
      const fakeProb = expFake / sum;
      
      const prediction = fakeProb > 0.5 ? 'FAKE' : 'REAL';
      const confidence = Math.max(realProb, fakeProb);
      
      const result = {
        prediction,
        confidence,
        probabilities: {
          real: realProb,
          fake: fakeProb
        },
        details: {
          file_name: data.file_info.name,
          file_size: data.file_info.size,
          processing_time: startTime,
          model_version: '1.0'
        },
        is_suspicious: fakeProb > 0.7,
        timestamp: new Date().toISOString(),
        debug: {
          raw_scores: [realScore, fakeScore],
          processing_time_ms: Date.now() - startTime
        }
      };

      console.log(`✅ ===== DETECTION COMPLETE =====`);
      console.log(`Result: ${prediction} (${(confidence * 100).toFixed(1)}%)`);
      return NextResponse.json(result);

    } catch (modelError) {
      console.error('❌ Model inference failed:', modelError);
      return NextResponse.json(
        { 
          error: 'Model inference failed', 
          details: modelError instanceof Error ? modelError.message : 'Unknown model error',
          errorType: 'MODEL_INFERENCE_ERROR'
        }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Detection error:', error);
    
    return NextResponse.json(
      { 
        error: 'Detection failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        processing_time_ms: Date.now() - startTime
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const modelPath = path.join(process.cwd(), 'public', 'models', 'deepfake_detector.onnx');
    const modelExists = fs.existsSync(modelPath);
    
    return NextResponse.json({
      status: modelExists ? 'healthy' : 'error',
      model_file_exists: modelExists,
      model_path: modelPath,
      processing_mode: 'client-side-features',
      endpoints: {
        detect: '/api/detect-deepfake',
        method: 'POST',
        accepts: 'application/json',
        expected_payload: {
          features: 'Float32Array(16384)',
          file_info: { name: 'string', size: 'number', type: 'string' }
        }
      },
      supported_formats: ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/ogg'],
      max_file_size: '10MB'
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        model_loaded: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}