// components/AudioTester.tsx - Updated to process audio on client side

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const featureExtractor = new AudioFeatureExtractor();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const analyzeAudio = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      console.log('🎵 Starting client-side audio processing...');
      
      // Process audio on client side (browser)
      const features = await featureExtractor.extractMelSpectrogram(file);
      
      if (!features) {
        throw new Error('Failed to extract audio features');
      }

      console.log('✅ Features extracted on client side:', features.length);

      // Send features to server (not the raw audio file)
      const response = await fetch('/api/detect-deepfake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          features: Array.from(features), // Convert Float32Array to regular array
          file_info: {
            name: file.name,
            size: file.size,
            type: file.type
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result: DetectionResult = await response.json();
      setResult(result);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
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
            </div>
          </details>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 p-4 bg-gray-900/50 border border-gold/20 rounded-lg">
        <h4 className="text-gold font-semibold mb-2">How It Works</h4>
        <p className="text-gray-300 text-sm">
          Audio processing happens entirely in your browser for privacy. Features are extracted 
          client-side and sent to our ONNX model for analysis.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            Client-side Processing
          </span>
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            Privacy-First
          </span>
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            Real-time Analysis
          </span>
        </div>
      </div>
    </div>
  );
}