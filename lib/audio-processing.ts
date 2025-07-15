// lib/audio-processing.ts - Simplified version for debugging

export class AudioFeatureExtractor {
    async extractMelSpectrogram(audioFile: File): Promise<Float32Array | null> {
      try {
        console.log('🎵 Starting simplified audio processing...');
        console.log('File details:', {
          name: audioFile.name,
          size: audioFile.size,
          type: audioFile.type
        });
  
        // Step 1: Decode audio file
        console.log('Step 1: Decoding audio file...');
        const audioBuffer = await this.decodeAudioFile(audioFile);
        console.log('✅ Audio decoded:', {
          duration: audioBuffer.duration,
          sampleRate: audioBuffer.sampleRate,
          channels: audioBuffer.numberOfChannels
        });
  
        // Step 2: Get audio data
        console.log('Step 2: Extracting audio data...');
        const audioData = audioBuffer.getChannelData(0); // Get first channel
        console.log('✅ Audio data extracted:', audioData.length, 'samples');
  
        // Step 3: Create dummy mel spectrogram for testing
        console.log('Step 3: Creating dummy features...');
        const targetSize = 128 * 128; // 16,384 values
        const features = new Float32Array(targetSize);
        
        // Fill with some basic audio statistics
        const audioStats = this.computeBasicStats(audioData);
        console.log('Audio stats:', audioStats);
        
        // Create features based on audio data (simplified)
        for (let i = 0; i < targetSize; i++) {
          // Use a simple pattern based on audio data
          const audioIndex = Math.floor((i / targetSize) * audioData.length);
          const audioValue = audioData[audioIndex] || 0;
          features[i] = Math.abs(audioValue) + Math.random() * 0.1; // Add some variation
        }
        
        // Normalize to [0, 1]
        const normalized = this.normalizeArray(features);
        
        console.log('✅ Features created:', {
          length: normalized.length,
          min: Math.min(...normalized),
          max: Math.max(...normalized),
          mean: normalized.reduce((a, b) => a + b, 0) / normalized.length
        });
  
        return normalized;
        
      } catch (error) {
        console.error('❌ Audio processing failed at step:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        return null;
      }
    }
  
    private async decodeAudioFile(audioFile: File): Promise<AudioBuffer> {
      try {
        const arrayBuffer = await audioFile.arrayBuffer();
        console.log('File loaded as ArrayBuffer:', arrayBuffer.byteLength, 'bytes');
        
        // Create audio context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error('Web Audio API not supported');
        }
        
        const audioContext = new AudioContextClass();
        console.log('Audio context created, sample rate:', audioContext.sampleRate);
        
        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
          await audioContext.close(); // Clean up
          return audioBuffer;
        } catch (decodeError) {
          await audioContext.close(); // Clean up even on error
          throw decodeError;
        }
        
      } catch (error) {
        console.error('Audio decoding failed:', error);
        throw new Error(`Audio decoding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  
    private computeBasicStats(audioData: Float32Array) {
      let sum = 0;
      let sumSquares = 0;
      let min = Infinity;
      let max = -Infinity;
      
      for (let i = 0; i < audioData.length; i++) {
        const value = audioData[i];
        sum += value;
        sumSquares += value * value;
        min = Math.min(min, value);
        max = Math.max(max, value);
      }
      
      const mean = sum / audioData.length;
      const variance = (sumSquares / audioData.length) - (mean * mean);
      const rms = Math.sqrt(sumSquares / audioData.length);
      
      return {
        length: audioData.length,
        min: min,
        max: max,
        mean: mean,
        rms: rms,
        variance: variance
      };
    }
  
    private normalizeArray(array: Float32Array): Float32Array {
      const min = Math.min(...array);
      const max = Math.max(...array);
      const range = max - min;
      
      if (range === 0) {
        console.warn('Array has no variance, returning zeros');
        return new Float32Array(array.length);
      }
      
      const normalized = new Float32Array(array.length);
      for (let i = 0; i < array.length; i++) {
        normalized[i] = (array[i] - min) / range;
      }
      
      return normalized;
    }
  }