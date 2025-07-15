// app/api/detect-deepfake/route.ts - Vercel production compatible

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Global session cache
let ort: any = null;
let session: any = null;

async function initializeONNX() {
  if (!ort) {
    try {
      // Dynamic import for ONNX Runtime
      ort = await import('onnxruntime-web');
      
      // Configure for serverless environment
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
        // Production configuration for Vercel
        ort.env.wasm.wasmPaths = '/node_modules/onnxruntime-web/dist/';
        ort.env.wasm.numThreads = 1; // Single thread for serverless
        ort.env.wasm.simd = false;   // Disable SIMD for compatibility
      }
      
      console.log('✅ ONNX Runtime initialized');
    } catch (error) {
      console.error('❌ ONNX Runtime initialization failed:', error);
      throw error;
    }
  }
  return ort;
}

async function loadModel() {
  if (!session) {
    try {
      console.log('🔄 Loading ONNX model...');
      const ort = await initializeONNX();
      
      // Use absolute path for production
      const modelPath = path.join(process.cwd(), 'public', 'models', 'deepfake_detector.onnx');
      
      // Verify model file exists
      if (!fs.existsSync(modelPath)) {
        throw new Error(`Model file not found: ${modelPath}`);
      }
      
      const modelSize = fs.statSync(modelPath).size;
      console.log(`📊 Model file found: ${Math.round(modelSize / 1024 / 1024)}MB`);
      
      // Load with minimal configuration for Vercel
      session = await ort.InferenceSession.create(modelPath, {
        executionProviders: ['cpu'],
        graphOptimizationLevel: 'disabled', // Disable graph optimization
        enableCpuMemArena: false,           // Disable memory arena
        enableMemPattern: false,            // Disable memory pattern optimization
      });
      
      console.log('✅ ONNX model loaded successfully');
      console.log('Model inputs:', session.inputNames);
      console.log('Model outputs:', session.outputNames);
      
    } catch (error) {
      console.error('❌ Model loading failed:', error);
      throw new Error(`Model loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  return session;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🎤 [PRODUCTION] Starting deepfake detection...');
    
    // Parse request
    let data;
    try {
      data = await request.json();
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' }, 
        { status: 400 }
      );
    }
    
    // Validate input
    if (!data.features || !Array.isArray(data.features)) {
      return NextResponse.json(
        { error: 'No valid features array provided' }, 
        { status: 400 }
      );
    }

    if (data.features.length !== 16384) {
      return NextResponse.json(
        { error: `Invalid features length: ${data.features.length}, expected 16384` }, 
        { status: 400 }
      );
    }

    console.log('✅ Input validation passed');
    
    // Convert to Float32Array
    const features = new Float32Array(data.features);
    
    // Load model and run inference
    try {
      const ort = await initializeONNX();
      const modelSession = await loadModel();
      
      console.log('🧠 Creating input tensor...');
      const inputTensor = new ort.Tensor('float32', features, [1, 1, 128, 128]);
      
      console.log('🧠 Running inference...');
      const startInference = Date.now();
      const outputs = await modelSession.run({ audio_features: inputTensor });
      const inferenceTime = Date.now() - startInference;
      
      console.log(`✅ Inference completed in ${inferenceTime}ms`);
      
      // Process results
      const predictions = outputs.predictions.data as Float32Array;
      const realScore = predictions[0];
      const fakeScore = predictions[1];
      
      console.log('Raw predictions:', [realScore, fakeScore]);
      
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
          model_version: '1.0-production'
        },
        is_suspicious: fakeProb > 0.7,
        timestamp: new Date().toISOString(),
        debug: {
          raw_scores: [realScore, fakeScore],
          inference_time_ms: inferenceTime,
          total_time_ms: Date.now() - startTime,
          environment: 'production'
        }
      };

      console.log(`✅ Result: ${prediction} (${(confidence * 100).toFixed(1)}%)`);
      return NextResponse.json(result);

    } catch (modelError) {
      console.error('❌ Model inference error:', modelError);
      console.error('Model error stack:', modelError instanceof Error ? modelError.stack : 'No stack trace');
      
      return NextResponse.json(
        { 
          error: 'Model inference failed', 
          details: modelError instanceof Error ? modelError.message : 'Unknown model error',
          errorType: 'MODEL_INFERENCE_ERROR',
          timestamp: new Date().toISOString()
        }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ General error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Detection failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        processing_time_ms: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('🔍 Health check starting...');
    
    // Check model file
    const modelPath = path.join(process.cwd(), 'public', 'models', 'deepfake_detector.onnx');
    const modelExists = fs.existsSync(modelPath);
    
    let modelSize = 0;
    if (modelExists) {
      modelSize = fs.statSync(modelPath).size;
    }
    
    // Try to initialize ONNX (but don't load full model)
    let onnxStatus = 'unknown';
    try {
      await initializeONNX();
      onnxStatus = 'initialized';
    } catch (onnxError) {
      console.error('ONNX initialization error:', onnxError);
      onnxStatus = 'failed';
    }
    
    const response = {
      status: modelExists && onnxStatus === 'initialized' ? 'healthy' : 'error',
      environment: process.env.NODE_ENV || 'unknown',
      model_file_exists: modelExists,
      model_size_mb: Math.round(modelSize / 1024 / 1024),
      model_path: modelPath,
      onnx_status: onnxStatus,
      node_version: process.version,
      platform: process.platform,
      processing_mode: 'client-side-features',
      timestamp: new Date().toISOString()
    };
    
    console.log('Health check result:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}