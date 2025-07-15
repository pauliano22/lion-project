// app/api/detect-deepfake/route.ts - Simple Node.js approach

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Force Node.js runtime (not Edge)
export const runtime = 'nodejs';

let ort: any = null;
let session: any = null;

async function loadONNXRuntime() {
  if (!ort) {
    try {
      console.log('🔄 Loading ONNX Runtime Node...');
      
      // Try onnxruntime-node first
      try {
        ort = require('onnxruntime-node');
        console.log('✅ Using onnxruntime-node');
      } catch (nodeError) {
        console.log('⚠️ onnxruntime-node not available, trying onnxruntime-web...');
        
        // Fallback to onnxruntime-web
        ort = require('onnxruntime-web');
        console.log('✅ Using onnxruntime-web as fallback');
      }
      
    } catch (error) {
      console.error('❌ Failed to load ONNX Runtime:', error);
      throw new Error(`ONNX Runtime loading failed: ${error}`);
    }
  }
  return ort;
}

async function loadModel() {
  if (!session) {
    try {
      console.log('🔄 Loading model...');
      
      const ort = await loadONNXRuntime();
      
      // Load model from secure models directory (not public)
      const modelPath = path.join(process.cwd(), 'models', 'deepfake_detector.onnx');
      
      console.log('📍 Model path:', modelPath);
      
      if (!fs.existsSync(modelPath)) {
        throw new Error(`Model file not found at: ${modelPath}`);
      }
      
      const stats = fs.statSync(modelPath);
      console.log(`📊 Model file size: ${Math.round(stats.size / 1024 / 1024)}MB`);
      
      // Create inference session
      session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ['cpu']
      });
      
      console.log('✅ Model loaded successfully');
      console.log('📥 Model inputs:', session.inputNames);
      console.log('📤 Model outputs:', session.outputNames);
      
    } catch (error) {
      console.error('❌ Model loading failed:', error);
      throw new Error(`Model loading error: ${error}`);
    }
  }
  
  return session;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🎤 Starting secure detection...');
    
    // Parse request
    const data = await request.json();
    
    // Validate input
    if (!data.features || !Array.isArray(data.features) || data.features.length !== 16384) {
      return NextResponse.json(
        { error: `Invalid features. Expected array of 16384 numbers, got ${data.features?.length || 'undefined'}` },
        { status: 400 }
      );
    }
    
    console.log(`✅ Received valid features: ${data.features.length} values`);
    
    // Load model and run inference
    const ort = await loadONNXRuntime();
    const modelSession = await loadModel();
    
    // Convert features to tensor
    const features = new Float32Array(data.features);
    const inputTensor = new ort.Tensor('float32', features, [1, 1, 128, 128]);
    
    console.log('🧠 Running inference...');
    const inferenceStart = Date.now();
    
    const outputs = await modelSession.run({ audio_features: inputTensor });
    
    const inferenceTime = Date.now() - inferenceStart;
    console.log(`⚡ Inference completed in ${inferenceTime}ms`);
    
    // Process results
    const predictions = outputs.predictions.data as Float32Array;
    const realScore = predictions[0];
    const fakeScore = predictions[1];
    
    console.log('📊 Raw scores:', [realScore, fakeScore]);
    
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
        file_name: data.file_info?.name || 'unknown',
        file_size: data.file_info?.size || 0,
        processing_time: startTime,
        model_version: '1.0-nodejs-secure'
      },
      is_suspicious: fakeProb > 0.7,
      timestamp: new Date().toISOString(),
      debug: {
        raw_scores: [realScore, fakeScore],
        inference_time_ms: inferenceTime,
        total_time_ms: Date.now() - startTime
      }
    };
    
    console.log(`✅ Result: ${prediction} (${(confidence * 100).toFixed(1)}%)`);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('❌ Detection failed:', error);
    
    return NextResponse.json(
      {
        error: 'Secure model inference failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        processing_time_ms: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Health check
    const modelPath = path.join(process.cwd(), 'models', 'deepfake_detector.onnx');
    const modelExists = fs.existsSync(modelPath);
    
    let onnxStatus = 'unknown';
    try {
      await loadONNXRuntime();
      onnxStatus = 'available';
    } catch {
      onnxStatus = 'failed';
    }
    
    return NextResponse.json({
      status: modelExists && onnxStatus === 'available' ? 'healthy' : 'error',
      model_exists: modelExists,
      model_path: modelPath,
      onnx_runtime: onnxStatus,
      runtime: 'nodejs',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}