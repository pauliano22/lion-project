// components/AudioTester.tsx - CDN-based ONNX (no npm package)

'use client';

import { useState, useRef } from 'react';
import { Upload, Play, Pause, AlertTriangle, CheckCircle, Clock, FileAudio } from 'lucide-react';
import { AudioFeatureExtractor } from '@/lib/audio-processing';

interface DetectionResult {
  prediction: 'FAKE' | 'REAL';
  confidence: number;
  probabilities: {
    real: number;
    fake: number;
  };
  is_suspicious: boolean;
  timestamp: string;
  details: {
    file_name: string;
    file_size: number;
    processing_time: number;
    model_version: string;
  };
}

export default function AudioTester() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modelStatus, setModelStatus] = useState<string>('Not loaded');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const featureExtractor = new AudioFeatureExtractor();

  // ONNX session cache
  let onnxSession: any = null;
  let ort: any = null;

  // Your model URL on Hugging Face
  const MODEL_URL = 'https://huggingface.co/pauliano22/deepfake-audio-detector/resolve/main/deepfake_detector.onnx';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const loadONNXFromCDN = async (): Promise<any> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).ort) {
        resolve((window as any).ort);
        return;
      }

      console.log('🔄 Loading ONNX Runtime from CDN...');
      setModelStatus('Loading ONNX Runtime from CDN...');

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/ort.min.js';
      
      script.onload = () => {
        const ort = (window as any).ort;
        if (ort) {
          // Configure ONNX
          ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/';
          ort.env.wasm.numThreads = 1;
          ort.env.wasm.simd = true;
          
          console.log('✅ ONNX Runtime loaded from CDN');
          resolve(ort);
        } else {
          reject(new Error('ONNX Runtime not found on window object'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load ONNX Runtime from CDN'));
      };
      
      document.head.appendChild(script);
    });
  };

  const initializeONNX = async () => {
    if (!ort) {
      try {
        console.log('🔄 Initializing ONNX Runtime...');
        setModelStatus('Initializing ONNX...');
        
        ort = await loadONNXFromCDN();
        
        console.log('✅ ONNX Runtime initialized');
        return ort;
        
      } catch (error) {
        console.error('❌ ONNX initialization failed:', error);
        setModelStatus('ONNX initialization failed');
        throw error;
      }
    }
    return ort;
  };

  const loadONNXModel = async () => {
    if (onnxSession) return onnxSession;
    
    try {
      console.log('🔄 Loading model from Hugging Face...');
      setModelStatus('Loading model from Hugging Face...');
      
      const ort = await initializeONNX();
      
      console.log('📥 Fetching model from:', MODEL_URL);
      setModelStatus('Downloading model...');
      
      const response = await fetch(MODEL_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch model: ${response.status} ${response.statusText}`);
      }
      
      const modelBytes = await response.arrayBuffer();
      console.log(`📊 Model downloaded: ${Math.round(modelBytes.byteLength / 1024 / 1024)}MB`);
      setModelStatus('Creating ONNX session...');
      
      // Create session
      onnxSession = await ort.InferenceSession.create(modelBytes, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'basic',
      });
      
      console.log('✅ ONNX model loaded successfully');
      console.log('Inputs:', onnxSession.inputNames);
      console.log('Outputs:', onnxSession.outputNames);
      
      setModelStatus('Model ready!');
      return onnxSession;
      
    } catch (error) {
      console.error('❌ Model loading failed:', error);
      setModelStatus('Model loading failed');
      throw error;
    }
  };

  const runONNXInference = async (features: Float32Array) => {
    try {
      setModelStatus('Running inference...');
      
      const ort = await initializeONNX();
      const session = await loadONNXModel();
      
      console.log('🧠 Creating input tensor...');
      const inputTensor = new ort.Tensor('float32', features, [1, 1, 128, 128]);
      
      console.log('🧠 Running inference...');
      const startInference = Date.now();
      const outputs = await session.run({ audio_features: inputTensor });
      const inferenceTime = Date.now() - startInference;
      
      console.log(`✅ Inference completed in ${inferenceTime}ms`);
      setModelStatus('Analysis complete!');
      
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
      
      return {
        realProb,
        fakeProb,
        inferenceTime,
        rawScores: [realScore, fakeScore]
      };
      
    } catch (error) {
      console.error('❌ ONNX inference failed:', error);
      setModelStatus('Inference failed');
      throw error;
    }
  };

  const analyzeAudio = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setModelStatus('Starting analysis...');

    const startTime = Date.now();

    try {
      console.log('🎵 Starting analysis with CDN-loaded ONNX...');
      
      // Step 1: Extract features
      console.log('📊 Step 1: Extracting audio features...');
      setModelStatus('Processing audio...');
      const features = await featureExtractor.extractMelSpectrogram(file);
      
      if (!features) {
        throw new Error('Failed to extract audio features');
      }
      console.log('✅ Features extracted:', features.length);

      // Step 2: Run ONNX inference
      console.log('🧠 Step 2: Running AI model inference...');
      const inferenceResult = await runONNXInference(features);
      
      // Step 3: Process results
      const prediction = inferenceResult.fakeProb > 0.5 ? 'FAKE' : 'REAL';
      const confidence = Math.max(inferenceResult.realProb, inferenceResult.fakeProb);
      
      const result: DetectionResult = {
        prediction,
        confidence,
        probabilities: {
          real: inferenceResult.realProb,
          fake: inferenceResult.fakeProb
        },
        details: {
          file_name: file.name,
          file_size: file.size,
          processing_time: startTime,
          model_version: '1.0-cdn-external'
        },
        is_suspicious: inferenceResult.fakeProb > 0.7,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ Analysis complete: ${prediction} (${(confidence * 100).toFixed(1)}%)`);
      setResult(result);
      setModelStatus(`Result: ${prediction} (${(confidence * 100).toFixed(1)}%)`);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setModelStatus('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !file) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-dark border border-gold/20 rounded-lg p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gold mb-2">
          AI Audio Detection Demo
        </h3>
        <p className="text-gray-300">
          Upload an audio file to test our deepfake detection technology
        </p>
        <p className="text-sm text-gray-400 mt-2">
          🔒 Fully private - all processing happens in your browser
        </p>
        <div className="mt-3 p-2 bg-black/50 rounded text-xs text-gray-400">
          Model Status: <span className="text-gold">{modelStatus}</span>
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gold/30 rounded-lg p-8 text-center cursor-pointer hover:border-gold/50 transition-colors"
        >
          <Upload className="w-12 h-12 text-gold mx-auto mb-4" />
          <p className="text-gray-300 mb-2">
            Click to upload an audio file
          </p>
          <p className="text-sm text-gray-500">
            Supports WAV, MP3, M4A, OGG (max 10MB)
          </p>
        </div>
      </div>

      {/* File Info */}
      {file && (
        <div className="mb-6 p-4 bg-black border border-gold/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileAudio className="w-6 h-6 text-gold" />
              <div>
                <p className="font-semibold text-gold">{file.name}</p>
                <p className="text-sm text-gray-400">
                  {formatFileSize(file.size)} • {file.type}
                </p>
              </div>
            </div>
            
            <button
              onClick={togglePlayback}
              className="flex items-center space-x-2 bg-gold text-black px-4 py-2 rounded-lg hover:bg-gold-dark transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
          </div>
          
          <audio
            ref={audioRef}
            src={file ? URL.createObjectURL(file) : ''}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      )}

      {/* Analyze Button */}
      {file && (
        <div className="mb-6 text-center">
          <button
            onClick={analyzeAudio}
            disabled={isAnalyzing}
            className="bg-gold text-black px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isAnalyzing ? (
              <>
                <Clock className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 mr-2" />
                Analyze Audio
              </>
            )}
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 font-semibold">Analysis Failed</p>
          </div>
          <p className="text-red-300 mt-1">{error}</p>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          {/* Main Result */}
          <div className={`p-6 rounded-lg border-2 ${
            result.prediction === 'FAKE' 
              ? 'bg-red-900/20 border-red-500' 
              : 'bg-green-900/20 border-green-500'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {result.prediction === 'FAKE' ? (
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                )}
                <div>
                  <h4 className={`text-2xl font-bold ${
                    result.prediction === 'FAKE' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {result.prediction === 'FAKE' ? 'AI Generated' : 'Likely Real'}
                  </h4>
                  <p className="text-gray-300">
                    {(result.confidence * 100).toFixed(1)}% confidence
                  </p>
                </div>
              </div>
              
              {result.is_suspicious && (
                <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg px-3 py-1">
                  <p className="text-yellow-400 text-sm font-semibold">⚠️ Suspicious</p>
                </div>
              )}
            </div>

            {/* Probability Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Real Audio:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${result.probabilities.real * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-green-400 font-mono text-sm">
                    {(result.probabilities.real * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">AI Generated:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${result.probabilities.fake * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-red-400 font-mono text-sm">
                    {(result.probabilities.fake * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <details className="bg-black border border-gold/20 rounded-lg">
            <summary className="p-4 cursor-pointer text-gold hover:text-gold-dark transition-colors">
              📊 Technical Details
            </summary>
            <div className="px-4 pb-4 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400">Model Version:</span>
                  <span className="text-white ml-2">{result.details.model_version}</span>
                </div>
                <div>
                  <span className="text-gray-400">Processing Time:</span>
                  <span className="text-white ml-2">{Date.now() - result.details.processing_time}ms</span>
                </div>
                <div>
                  <span className="text-gray-400">File Size:</span>
                  <span className="text-white ml-2">{formatFileSize(result.details.file_size)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Analyzed:</span>
                  <span className="text-white ml-2">{new Date(result.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-600">
                <span className="text-gray-400">Model Source:</span>
                <span className="text-white ml-2">Hugging Face (CDN-loaded)</span>
              </div>
            </div>
          </details>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 p-4 bg-gray-900/50 border border-gold/20 rounded-lg">
        <h4 className="text-gold font-semibold mb-2">How It Works</h4>
        <p className="text-gray-300 text-sm">
          ONNX.js is loaded from CDN, your trained model from Hugging Face, and all processing happens locally in your browser. 
          No data leaves your device - maximum privacy and security.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            🔒 100% Private
          </span>
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            🌐 CDN-loaded
          </span>
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            🤗 Hugging Face
          </span>
        </div>
      </div>
    </div>
  );
}