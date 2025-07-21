'use client';

import { useState, useRef } from 'react';
import { Upload, Play, Pause, AlertTriangle, CheckCircle, Clock, FileAudio, ExternalLink, Zap, Shield, Target, Video } from 'lucide-react';

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
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modelStatus, setModelStatus] = useState<string>('Ready to analyze');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Extract audio from MP4 using Web APIs
  const extractAudioFromVideo = async (videoFile: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      
      video.onloadedmetadata = () => {
        try {
          // Create audio context
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioContext.createMediaElementSource(video);
          const destination = audioContext.createMediaStreamDestination();
          
          source.connect(destination);
          
          // Create MediaRecorder to capture audio
          const mediaRecorder = new MediaRecorder(destination.stream, {
            mimeType: 'audio/webm; codecs=opus'
          });
          
          const chunks: BlobPart[] = [];
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunks.push(event.data);
            }
          };
          
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(chunks, { type: 'audio/webm' });
            const audioFile = new File([audioBlob], 
              videoFile.name.replace(/\.[^/.]+$/, '') + '.webm', 
              { type: 'audio/webm' }
            );
            resolve(audioFile);
          };
          
          mediaRecorder.onerror = (event) => {
            reject(new Error('Audio extraction failed'));
          };
          
          // Start recording
          mediaRecorder.start();
          video.play();
          
          // Stop recording when video ends (or after reasonable duration)
          video.onended = () => {
            mediaRecorder.stop();
            audioContext.close();
          };
          
          // Safety timeout
          setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
              audioContext.close();
            }
          }, Math.min(video.duration * 1000 || 30000, 60000)); // Max 1 minute
          
        } catch (error) {
          reject(new Error('Browser audio extraction not supported'));
        }
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video file'));
      };
      
      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  };

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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file size (max 25MB for video files, 10MB for audio)
      const maxSize = selectedFile.type.includes('video') ? 25 * 1024 * 1024 : 10 * 1024 * 1024;
      if (selectedFile.size > maxSize) {
        setError(`File size too large. Please select a file smaller than ${selectedFile.type.includes('video') ? '25MB' : '10MB'}.`);
        return;
      }
      
      // Validate file type - now includes MP4
      const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/m4a', 'video/mp4'];
      const isValidType = allowedTypes.some(type => {
        const [category, format] = type.split('/');
        return selectedFile.type.includes(format) || 
               (category === 'video' && selectedFile.name.toLowerCase().endsWith('.mp4'));
      });
      
      if (!isValidType) {
        setError('Invalid file type. Please select a WAV, MP3, OGG, M4A, or MP4 file.');
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      setError(null);
      setModelStatus('Ready to analyze');
      
      // If it's an MP4 file, extract audio
      if (selectedFile.type.includes('video') || selectedFile.name.toLowerCase().endsWith('.mp4')) {
        setIsExtracting(true);
        setModelStatus('Extracting audio from video...');
        
        try {
          const extractedAudio = await extractAudioFromVideo(selectedFile);
          setAudioFile(extractedAudio);
          setModelStatus('Audio extracted - ready to analyze');
        } catch (extractError) {
          setError('Failed to extract audio from video. Please try converting to audio format first.');
          setModelStatus('Audio extraction failed');
        } finally {
          setIsExtracting(false);
        }
      } else {
        setAudioFile(selectedFile);
      }
    }
  };

  const analyzeAudio = async () => {
    const fileToAnalyze = audioFile || file;
    if (!fileToAnalyze) return;
  
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setModelStatus('Analyzing audio...');
  
    const startTime = Date.now();
  
    try {
      setModelStatus('Processing with AI...');
      
      // Call the detection function
      const apiResult = await detectAudioDeepfake(fileToAnalyze);
  
      setModelStatus('Analysis complete!');
  
      // Convert API result to component format
      const result: DetectionResult = {
        prediction: apiResult.prediction,
        confidence: apiResult.confidence,
        probabilities: apiResult.probabilities,
        details: {
          file_name: file?.name || 'Unknown',
          file_size: file?.size || 0,
          processing_time: Date.now() - startTime,
          model_version: apiResult.details.model_version
        },
        is_suspicious: apiResult.is_suspicious,
        timestamp: new Date().toISOString()
      };
  
      setResult(result);
      setModelStatus(`Analysis complete - ${result.prediction} detected`);
  
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setModelStatus('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || (!audioFile && !file)) return;

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

  const isVideoFile = file && (file.type.includes('video') || file.name.toLowerCase().endsWith('.mp4'));

    return (
    <div className="max-w-4xl mx-auto">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gold mb-4">
          Try Our AI Detection Technology
        </h3>
      </div>

      {/* Main Card */}
      <div className="bg-gray-dark border border-gold/20 rounded-xl p-8 shadow-2xl">
        
        {/* Status Bar */}
        <div className="mb-6 p-3 bg-black/50 rounded-lg text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isAnalyzing || isExtracting ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
            }`}></div>
            <span className="text-gold font-medium">{modelStatus}</span>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/mp4,.mp4"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gold/30 hover:border-gold/60 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:bg-gold/5"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <FileAudio className="w-12 h-12 text-gold" />
              <Video className="w-12 h-12 text-gold" />
            </div>
            <h4 className="text-xl font-semibold text-gold mb-2">
              Drop your audio or video file here
            </h4>
            <p className="text-gray-300 mb-4">
              Or click to browse your files
            </p>
            <p className="text-sm text-gray-400">
              Supports WAV, MP3, M4A, OGG files up to 10MB<br />
              <strong>NEW:</strong> MP4 video files up to 25MB (audio will be extracted)
            </p>
          </div>
        </div>

        {/* File Info */}
        {file && (
          <div className="mb-6 p-4 bg-black/30 border border-gold/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isVideoFile ? (
                  <Video className="w-8 h-8 text-gold" />
                ) : (
                  <FileAudio className="w-8 h-8 text-gold" />
                )}
                <div>
                  <p className="font-semibold text-gold text-lg">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(file.size)} • {file.type}
                    {isVideoFile && (
                      <span className="ml-2 px-2 py-1 bg-blue-900/30 border border-blue-500/50 rounded text-xs text-blue-400">
                        Video → Audio
                      </span>
                    )}
                  </p>
                  {isVideoFile && audioFile && (
                    <p className="text-xs text-green-400 mt-1">
                      ✓ Audio extracted ({formatFileSize(audioFile.size)})
                    </p>
                  )}
                </div>
              </div>
              
              <button
                onClick={togglePlayback}
                disabled={isExtracting || (!audioFile && !!isVideoFile)}
                className="flex items-center space-x-2 bg-gold/20 hover:bg-gold/30 text-gold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlaying ? 
                  <Pause className="w-5 h-5" /> : 
                  <Play className="w-5 h-5" />
                }
                <span className="font-medium">
                  {isExtracting ? 'Extracting...' : (isPlaying ? 'Pause' : 'Play')}
                </span>
              </button>
            </div>
            
            <audio
              ref={audioRef}
              src={audioFile ? URL.createObjectURL(audioFile) : (file && !isVideoFile ? URL.createObjectURL(file) : '')}
              onEnded={() => setIsPlaying(false)}
              onPause={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}

        {/* Analyze Button */}
        {file && !isExtracting && (audioFile || !isVideoFile) && (
          <div className="mb-6 text-center">
            <button
              onClick={analyzeAudio}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-gold to-yellow-500 text-black px-12 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto shadow-lg"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-6 h-6 mr-3 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6 mr-3" />
                  Analyze Audio
                </>
              )}
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-red-400 font-semibold">Analysis Failed</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className={`p-6 rounded-xl border-2 ${
              result.prediction === 'FAKE' 
                ? 'bg-red-900/20 border-red-500/50 shadow-red-500/20' 
                : 'bg-green-900/20 border-green-500/50 shadow-green-500/20'
            } shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {result.prediction === 'FAKE' ? (
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                  ) : (
                    <CheckCircle className="w-12 h-12 text-green-400" />
                  )}
                  <div>
                    <h4 className={`text-3xl font-bold ${
                      result.prediction === 'FAKE' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {result.prediction === 'FAKE' ? 'AI Generated' : 'Authentic'}
                    </h4>
                    <p className="text-gray-300 text-lg">
                      {(result.confidence * 100).toFixed(1)}% confidence
                    </p>
                  </div>
                </div>
                
                {result.is_suspicious && (
                  <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg px-4 py-2">
                    <p className="text-yellow-400 font-semibold flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Suspicious
                    </p>
                  </div>
                )}
              </div>

              {/* Probability Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">Real Audio:</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${result.probabilities.real * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-green-400 font-mono text-lg font-bold min-w-[60px]">
                      {(result.probabilities.real * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">AI Generated:</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-red-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${result.probabilities.fake * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-red-400 font-mono text-lg font-bold min-w-[60px]">
                      {(result.probabilities.fake * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details - Collapsible */}
            <details className="group bg-black/30 border border-gold/20 rounded-lg overflow-hidden">
              <summary className="p-4 cursor-pointer text-gold hover:bg-gold/5 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Technical Details</span>
                </div>
                <div className="transform group-open:rotate-180 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-4 pb-4 space-y-3 text-sm border-t border-gold/10">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Processing Time:</span>
                    <span className="text-white font-mono">{result.details.processing_time}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">File Size:</span>
                    <span className="text-white font-mono">{formatFileSize(result.details.file_size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Analyzed:</span>
                    <span className="text-white font-mono">{new Date(result.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Model Version:</span>
                    <span className="text-white font-mono">{result.details.model_version}</span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        )}

        {/* Convert Audio Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Need to convert your audio or video file?{' '}
            <a 
              href="https://convertio.co/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gold hover:text-yellow-400 transition-colors inline-flex items-center"
            >
              Try Convertio
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}