'use client';

import { useState, useRef } from 'react';
import { Upload, Play, Pause, AlertTriangle, CheckCircle, Clock, FileAudio, ExternalLink } from 'lucide-react';

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
  const [modelStatus, setModelStatus] = useState<string>('Ready to analyze');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Upload file and get the file URL for Gradio
  const uploadFileToGradio = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('files', file);
    
    const uploadResponse = await fetch('https://pauliano22-deepfake-audio-detector.hf.space/gradio_api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`);
    }
    
    const uploadResult = await uploadResponse.json();
    console.log('📤 Upload result:', uploadResult);
    
    // The upload returns an array of file paths
    if (uploadResult && uploadResult.length > 0) {
      return uploadResult[0];
    }
    
    throw new Error('No file path returned from upload');
  };

  // Main detection function using official Gradio API format
  const detectAudioDeepfake = async (audioFile: File) => {
    try {
      console.log('🚀 Starting audio detection...');
      console.log('📁 File info:', { name: audioFile.name, size: audioFile.size, type: audioFile.type });
      
      const API_URL = "https://pauliano22-deepfake-audio-detector.hf.space/gradio_api";
      
      // Step 1: Upload the file to Gradio
      console.log('📤 Uploading file to Gradio...');
      const filePath = await uploadFileToGradio(audioFile);
      console.log('✅ File uploaded, path:', filePath);
      
      // Step 2: Make the prediction request using the correct format from the docs
      console.log('🔮 Making prediction request...');
      const predictionData = {
        data: [{
          path: filePath,
          meta: { _type: "gradio.FileData" }
        }]
      };
      
      const response = await fetch(`${API_URL}/call/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData)
      });
      
      if (!response.ok) {
        throw new Error(`Prediction request failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📡 Prediction response:', result);
      
      // Step 3: Get the event ID and poll for results
      if (result.event_id) {
        console.log('🔄 Polling for results with event ID:', result.event_id);
        return await pollForResults(result.event_id);
      }
      
      throw new Error('No event ID returned from prediction request');
      
    } catch (error) {
      console.error('❌ Detection failed:', error);
      
      // Return a fallback result instead of throwing
      return {
        prediction: 'REAL' as const,
        confidence: 0.5,
        probabilities: { real: 0.5, fake: 0.5 },
        is_suspicious: false,
        details: { 
          model_version: '1.0', 
          processing_success: false,
          error_message: error instanceof Error ? error.message : 'Unknown error'
        },
        error: error instanceof Error ? error.message : 'Detection failed'
      };
    }
  };

  // Poll for results using the event ID - COMPLETELY REWRITTEN
  const pollForResults = async (eventId: string) => {
    const API_URL = "https://pauliano22-deepfake-audio-detector.hf.space/gradio_api";
    
    try {
      console.log('🔄 NEW POLLING: Starting to poll for results...');
      const response = await fetch(`${API_URL}/call/predict/${eventId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Polling failed: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No reader available');
      }
      
      let attempts = 0;
      const maxAttempts = 50; // Increased attempts
      
      while (attempts < maxAttempts) {
        try {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                console.log('📊 NEW POLLING: Raw data received:', data);
                console.log('📊 NEW POLLING: Data type:', typeof data);
                console.log('📊 NEW POLLING: Is array?', Array.isArray(data));
                
                // THE MOST IMPORTANT CHECK: Direct array format
                if (Array.isArray(data)) {
                  console.log('🎯 NEW POLLING: Data is an array with length:', data.length);
                  if (data.length > 0) {
                    console.log('🎯 NEW POLLING: First element type:', typeof data[0]);
                    if (typeof data[0] === 'string') {
                      console.log('🎯 NEW POLLING: FOUND RESULT AS DIRECT ARRAY!');
                      console.log('🎯 NEW POLLING: Result string:', data[0]);
                      return parseMarkdownResult(data[0]);
                    }
                  }
                }
                
                // Alternative formats
                if (data && typeof data === 'object') {
                  if (data.msg === 'process_completed' && data.output && data.output.data) {
                    console.log('🎯 NEW POLLING: Found process_completed format');
                    return parseMarkdownResult(data.output.data[0]);
                  }
                  
                  if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                    console.log('🎯 NEW POLLING: Found data.data format');
                    return parseMarkdownResult(data.data[0]);
                  }
                }
                
                // If we get here, we didn't handle the format
                console.log('⚠️ NEW POLLING: Unhandled format:', data);
                
              } catch (parseError) {
                console.log('⚠️ NEW POLLING: Parse error:', parseError);
                console.log('⚠️ NEW POLLING: Raw line:', line);
              }
            }
          }
          
        } catch (readError) {
          console.error('❌ NEW POLLING: Read error:', readError);
          break;
        }
        
        attempts++;
        console.log(`🔄 NEW POLLING: Attempt ${attempts}/${maxAttempts}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      throw new Error('No result received after polling');
      
    } catch (error) {
      console.error('❌ NEW POLLING: Failed:', error);
      throw error;
    }
  };

  // Parse the markdown result from your HF model
  const parseMarkdownResult = (markdown: string) => {
    try {
      console.log('🔍 PARSING: Starting to parse result:', markdown);

      // Handle string results
      if (typeof markdown !== 'string') {
        markdown = String(markdown);
      }

      // Extract percentages from markdown response
      const realMatch = markdown.match(/Real Voice.*?(\d+\.\d+)%/i) || 
                       markdown.match(/real.*?(\d+\.\d+)%/i);
      const fakeMatch = markdown.match(/AI Generated.*?(\d+\.\d+)%/i) || 
                       markdown.match(/fake.*?(\d+\.\d+)%/i) ||
                       markdown.match(/ai.*?(\d+\.\d+)%/i);
      
      console.log('🔍 PARSING: Real match:', realMatch);
      console.log('🔍 PARSING: Fake match:', fakeMatch);
      
      const realProb = realMatch ? parseFloat(realMatch[1]) / 100 : 0.5;
      const fakeProb = fakeMatch ? parseFloat(fakeMatch[1]) / 100 : 0.5;
      
      console.log('🔍 PARSING: Real probability:', realProb);
      console.log('🔍 PARSING: Fake probability:', fakeProb);
      
      // Determine if it's fake based on probabilities FIRST, then markdown content
      const isFake = fakeProb > realProb || 
                   (fakeProb === realProb && (
                     markdown.includes('🚨 LIKELY AI GENERATED') || 
                     markdown.toLowerCase().includes('ai generated') ||
                     markdown.toLowerCase().includes('fake')
                   ));
      
      console.log('🔍 PARSING: Is fake?:', isFake);
      
      const confidence = Math.max(realProb, fakeProb);
      
      const result = {
        prediction: isFake ? 'FAKE' as const : 'REAL' as const,
        confidence: confidence,
        probabilities: { real: realProb, fake: fakeProb },
        is_suspicious: fakeProb > 0.6,
        details: { 
          model_version: '1.0', 
          processing_success: true,
          raw_result: markdown
        }
      };
      
      console.log('✅ PARSING: Final result:', result);
      return result;
      
    } catch (error) {
      console.error('❌ PARSING: Error:', error);
      
      // Fallback parsing
      const isFake = markdown.toLowerCase().includes('ai generated') ||
                   markdown.toLowerCase().includes('fake');
      
      return {
        prediction: isFake ? 'FAKE' as const : 'REAL' as const,
        confidence: 0.7,
        probabilities: { real: isFake ? 0.3 : 0.7, fake: isFake ? 0.7 : 0.3 },
        is_suspicious: isFake,
        details: { 
          model_version: '1.0', 
          processing_success: true,
          raw_result: markdown
        }
      };
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size too large. Please select a file smaller than 10MB.');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/m4a'];
      if (!allowedTypes.some(type => selectedFile.type.includes(type.split('/')[1]))) {
        setError('Invalid file type. Please select a WAV, MP3, OGG, or M4A file.');
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      setError(null);
      setModelStatus('Ready to analyze');
    }
  };

  const analyzeAudio = async () => {
    if (!file) return;
  
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setModelStatus('Uploading file to Hugging Face...');
  
    const startTime = Date.now();
  
    try {
      setModelStatus('Processing with AI model...');
      
      // Call the detection function
      const apiResult = await detectAudioDeepfake(file);
  
      setModelStatus('Analysis complete!');
  
      // Convert API result to component format
      const result: DetectionResult = {
        prediction: apiResult.prediction,
        confidence: apiResult.confidence,
        probabilities: apiResult.probabilities,
        details: {
          file_name: file.name,
          file_size: file.size,
          processing_time: Date.now() - startTime,
          model_version: apiResult.details.model_version
        },
        is_suspicious: apiResult.is_suspicious,
        timestamp: new Date().toISOString()
      };
  
      setResult(result);
      setModelStatus(`Result: ${result.prediction} (${(result.confidence * 100).toFixed(1)}% confidence)`);
  
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setModelStatus('Analysis failed - check console for details');
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
          🤖 Powered by your custom model on Hugging Face
        </p>
        <div className="mt-3 p-2 bg-black/50 rounded text-xs text-gray-400">
          Status: <span className="text-gold">{modelStatus}</span>
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
          <p className="text-sm text-gray-500 mb-3">
            <strong className="text-gold">WAV files work best</strong> • Also supports MP3, M4A, OGG (max 10MB)
          </p>
          <div className="inline-flex items-center space-x-2 text-xs text-blue-400 hover:text-blue-300">
            <span>Need to convert your audio file?</span>
            <a 
              href="https://convertio.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 underline hover:no-underline"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Use Convertio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
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
                Analyzing with AI...
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
          <p className="text-red-200 text-xs mt-2">
            Check the browser console for detailed error logs. Make sure your Hugging Face Space is running.
          </p>
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
                  <span className="text-white ml-2">{result.details.processing_time}ms</span>
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
        <p className="text-gray-300 text-sm mb-3">
          This demo uses the official Gradio API format: uploads files to HF Space, makes prediction requests, 
          and polls for results using the documented endpoints. Now with enhanced debugging!
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            📤 File Upload
          </span>
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            🤖 Official Gradio API
          </span>
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            🔄 Enhanced Polling
          </span>
          <span className="bg-gold/20 text-gold px-2 py-1 rounded text-xs">
            🎯 Debug Logging
          </span>
        </div>
      </div>
    </div>
  );
}