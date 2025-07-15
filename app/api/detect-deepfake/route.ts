// app/api/detect-deepfake/route.ts - Simplified Edge Runtime version

import { NextRequest, NextResponse } from 'next/server';

// CRITICAL: Tell Vercel to use Edge Runtime
export const runtime = 'edge';

// Your actual Vercel URL (replace with yours)
const VERCEL_URL = 'https://lion-project.vercel.app';

// Global session cache
let ort: any = null;
let session: any = null;

async function initializeONNX() {
  if (!ort) {
    try {
      console.log('🔄 Initializing ONNX Runtime on Edge...');
      
      ort = await import('onnxruntime-web');
      
      // Configure for Edge Runtime with CDN WASM files
      ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.3/dist/';
      ort.env.wasm.numThreads = 1;
      ort.env.wasm.simd = true;
      
      console.log('✅ ONNX Runtime initialized on Edge');
    } catch (error) {
      console.error('❌ ONNX initialization failed:', error);
      throw error;
    }
  }
  return ort;
}

async function loadModel() {
  if (!session) {
    try {
      console.log('🔄 Loading ONNX model on Edge Runtime...');
      const ort = await initializeONNX();
      
      // Fetch model from your Vercel deployment
      const modelUrl = `${VERCEL_URL}/models/deepfake_detector.onnx`;
      console.log('📥 Fetching model from:', modelUrl);
      
      const response = await fetch(modelUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.status} ${response.statusText}`);
      }
      
      const modelBytes = await response.arrayBuffer();
      console.log(`📊 Model loaded: ${Math.round(modelBytes.byteLength / 1024 / 1024)}MB`);
      
      // Create session
      session = await ort.InferenceSession.create(modelBytes, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'basic',
      });
      
      console.log('✅ ONNX model loaded successfully on Edge');
      console.log('Inputs:', session.inputNames);
      console.log('Outputs:', session.outputNames);
      
    } catch (error) {
      console.error('❌ Model loading failed on Edge:', error);
      throw new Error(`Model loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  return session;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('🎤 [EDGE] Starting deepfake detection...');
    
    const data = await request.json();
    
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
    
    const features = new Float32Array(data.features);
    
    try {
      const ort = await initializeONNX();
      const modelSession = await loadModel();
      
      console.log('🧠 Creating input tensor...');
      const inputTensor = new ort.Tensor('float32', features, [1, 1, 128, 128]);
      
      console.log('🧠 Running inference on Edge...');
      const startInference = Date.now();
      const outputs = await modelSession.run({ audio_features: inputTensor });
      const inferenceTime = Date.now() - startInference;
      
      console.log(`✅ Inference completed in ${inferenceTime}ms`);
      
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
          model_version: '1.0-edge-runtime'
        },
        is_suspicious: fakeProb > 0.7,
        timestamp: new Date().toISOString(),
        debug: {
          raw_scores: [realScore, fakeScore],
          inference_time_ms: inferenceTime,
          total_time_ms: Date.now() - startTime,
          runtime: 'edge'
        }
      };

      console.log(`✅ [EDGE] Result: ${prediction} (${(confidence * 100).toFixed(1)}%)`);
      return NextResponse.json(result);

    } catch (modelError) {
      console.error('❌ Model inference error on Edge:', modelError);
      
      return NextResponse.json(
        { 
          error: 'Model inference failed on Edge Runtime', 
          details: modelError instanceof Error ? modelError.message : 'Unknown model error',
          errorType: 'EDGE_MODEL_ERROR',
          runtime: 'edge'
        }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ General error on Edge:', error);
    
    return NextResponse.json(
      { 
        error: 'Detection failed on Edge Runtime', 
        details: error instanceof Error ? error.message : 'Unknown error',
        processing_time_ms: Date.now() - startTime,
        runtime: 'edge'
      }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log('🔍 Edge Runtime health check...');
    
    let onnxStatus = 'unknown';
    try {
      await initializeONNX();
      onnxStatus = 'initialized';
    } catch (onnxError) {
      console.error('ONNX initialization error:', onnxError);
      onnxStatus = 'failed';
    }
    
    const response = {
      status: onnxStatus === 'initialized' ? 'healthy' : 'error',
      runtime: 'edge',
      onnx_status: onnxStatus,
      model_url: `${VERCEL_URL}/models/deepfake_detector.onnx`,
      wasm_source: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.3/dist/',
      processing_mode: 'client-side-features',
      timestamp: new Date().toISOString(),
      note: 'Running on Vercel Edge Runtime for ONNX.js compatibility'
    };
    
    console.log('Edge health check result:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Edge health check error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        runtime: 'edge',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}