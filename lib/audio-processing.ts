// lib/audio-processing.ts - FIXED VERSION with real mel-spectrogram

export class AudioFeatureExtractor {
    private readonly SAMPLE_RATE = 22050;
    private readonly N_MELS = 128;
    private readonly HOP_LENGTH = 512;
    private readonly N_FFT = 2048;
    private readonly MAX_LEN = 128;
    private readonly DURATION = 5.0; // 5 seconds like Python
  
    async extractMelSpectrogram(audioFile: File): Promise<Float32Array | null> {
      try {
        console.log('🎵 Starting REAL mel-spectrogram extraction...');
        
        // Step 1: Decode and resample audio to match Python
        const audioBuffer = await this.decodeAudioFile(audioFile);
        const audioData = await this.resampleTo22050(audioBuffer);
        
        // Step 2: Trim/pad to 5 seconds (like Python duration=5.0)
        const targetLength = this.SAMPLE_RATE * this.DURATION;
        const processedAudio = this.trimOrPadAudio(audioData, targetLength);
        
        // Step 3: Extract REAL mel-spectrogram
        const melSpectrogram = this.computeMelSpectrogram(processedAudio);
        
        // Step 4: Convert to dB scale (like Python librosa.power_to_db)
        const melSpectrogramDb = this.powerToDb(melSpectrogram);
        
        // Step 5: Pad/truncate to fixed size (128x128)
        const features = this.resizeSpectrogram(melSpectrogramDb, this.N_MELS, this.MAX_LEN);
        
        // Debug output to match Python
        console.log('🔍 JavaScript Feature Debug Info');
        console.log(`Length: ${features.length}`);
        console.log(`Min: ${Math.min(...features).toFixed(6)}`);
        console.log(`Max: ${Math.max(...features).toFixed(6)}`);
        console.log(`Mean: ${(features.reduce((a, b) => a + b, 0) / features.length).toFixed(6)}`);
        
        // Sample values at same indices as Python
        console.log('Sample values:');
        console.log(`[1000]: ${features[1000]?.toFixed(6) || 'N/A'}`);
        console.log(`[5000]: ${features[5000]?.toFixed(6) || 'N/A'}`);
        console.log(`[10000]: ${features[10000]?.toFixed(6) || 'N/A'}`);
        console.log(`[15000]: ${features[15000]?.toFixed(6) || 'N/A'}`);
        
        const first10 = Array.from(features.slice(0, 10)).map(v => v.toFixed(6));
        console.log(`First 10: [${first10.join(', ')}]`);
        
        return features;
        
      } catch (error) {
        console.error('❌ Mel-spectrogram extraction failed:', error);
        return null;
      }
    }
  
    private async decodeAudioFile(audioFile: File): Promise<AudioBuffer> {
      const arrayBuffer = await audioFile.arrayBuffer();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      
      try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        return audioBuffer;
      } finally {
        await audioContext.close();
      }
    }
  
    private async resampleTo22050(audioBuffer: AudioBuffer): Promise<Float32Array> {
      // If already 22050 Hz, just return the data
      if (audioBuffer.sampleRate === this.SAMPLE_RATE) {
        return audioBuffer.getChannelData(0);
      }
      
      // Create offline context for resampling
      const offlineContext = new OfflineAudioContext(
        1, // mono
        Math.floor(audioBuffer.duration * this.SAMPLE_RATE),
        this.SAMPLE_RATE
      );
      
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(offlineContext.destination);
      source.start();
      
      const resampledBuffer = await offlineContext.startRendering();
      return resampledBuffer.getChannelData(0);
    }
  
    private trimOrPadAudio(audioData: Float32Array, targetLength: number): Float32Array {
      if (audioData.length === targetLength) {
        return audioData;
      }
      
      const result = new Float32Array(targetLength);
      
      if (audioData.length > targetLength) {
        // Trim to target length
        result.set(audioData.slice(0, targetLength));
      } else {
        // Pad with zeros
        result.set(audioData);
        // Remaining values are already zeros due to Float32Array initialization
      }
      
      return result;
    }
  
    private computeMelSpectrogram(audioData: Float32Array): Float32Array[] {
      // This is a simplified mel-spectrogram implementation
      // For production, you'd want to use a proper audio processing library
      
      const hopLength = this.HOP_LENGTH;
      const nFft = this.N_FFT;
      const nFrames = Math.floor((audioData.length - nFft) / hopLength) + 1;
      
      // Create mel filter bank
      const melFilters = this.createMelFilterBank();
      
      // Compute STFT
      const spectrogram: Float32Array[] = [];
      
      for (let frame = 0; frame < nFrames; frame++) {
        const start = frame * hopLength;
        const end = Math.min(start + nFft, audioData.length);
        
        // Extract frame
        const frameData = new Float32Array(nFft);
        for (let i = 0; i < end - start; i++) {
          frameData[i] = audioData[start + i];
        }
        
        // Apply window (Hann window)
        for (let i = 0; i < nFft; i++) {
          frameData[i] *= 0.5 * (1 - Math.cos(2 * Math.PI * i / (nFft - 1)));
        }
        
        // Compute FFT magnitude
        const fftMagnitudes = this.computeFFTMagnitude(frameData);
        
        // Apply mel filters
        const melFrame = new Float32Array(this.N_MELS);
        for (let mel = 0; mel < this.N_MELS; mel++) {
          let sum = 0;
          for (let freq = 0; freq < fftMagnitudes.length; freq++) {
            sum += fftMagnitudes[freq] * melFilters[mel][freq];
          }
          melFrame[mel] = Math.max(sum, 1e-10); // Prevent log(0)
        }
        
        spectrogram.push(melFrame);
      }
      
      return spectrogram;
    }
  
    private createMelFilterBank(): Float32Array[] {
      // Simplified mel filter bank creation
      const filters: Float32Array[] = [];
      const nFreqs = this.N_FFT / 2 + 1;
      
      // Create mel scale points
      const melMin = this.hzToMel(0);
      const melMax = this.hzToMel(this.SAMPLE_RATE / 2);
      const melPoints = [];
      
      for (let i = 0; i <= this.N_MELS + 1; i++) {
        const mel = melMin + (melMax - melMin) * i / (this.N_MELS + 1);
        melPoints.push(this.melToHz(mel));
      }
      
      // Convert to FFT bin indices
      const binPoints = melPoints.map(hz => Math.floor((this.N_FFT + 1) * hz / this.SAMPLE_RATE));
      
      // Create triangular filters
      for (let mel = 0; mel < this.N_MELS; mel++) {
        const filter = new Float32Array(nFreqs);
        const left = binPoints[mel];
        const center = binPoints[mel + 1];
        const right = binPoints[mel + 2];
        
        for (let freq = left; freq < center; freq++) {
          if (center !== left) {
            filter[freq] = (freq - left) / (center - left);
          }
        }
        
        for (let freq = center; freq < right; freq++) {
          if (right !== center) {
            filter[freq] = (right - freq) / (right - center);
          }
        }
        
        filters.push(filter);
      }
      
      return filters;
    }
  
    private hzToMel(hz: number): number {
      return 2595 * Math.log10(1 + hz / 700);
    }
  
    private melToHz(mel: number): number {
      return 700 * (Math.pow(10, mel / 2595) - 1);
    }
  
    private computeFFTMagnitude(frameData: Float32Array): Float32Array {
      // Simplified FFT - for production use a proper FFT library
      const n = frameData.length;
      const result = new Float32Array(n / 2 + 1);
      
      for (let k = 0; k < result.length; k++) {
        let real = 0;
        let imag = 0;
        
        for (let n_idx = 0; n_idx < n; n_idx++) {
          const angle = -2 * Math.PI * k * n_idx / n;
          real += frameData[n_idx] * Math.cos(angle);
          imag += frameData[n_idx] * Math.sin(angle);
        }
        
        result[k] = Math.sqrt(real * real + imag * imag);
      }
      
      return result;
    }
  
    private powerToDb(spectrogram: Float32Array[]): Float32Array {
      // Convert power spectrogram to dB scale (like librosa.power_to_db)
      const flattened = new Float32Array(spectrogram.length * spectrogram[0].length);
      let idx = 0;
      
      // Find max value for reference
      let maxVal = 0;
      for (const frame of spectrogram) {
        for (const val of frame) {
          maxVal = Math.max(maxVal, val * val); // Power = magnitude^2
        }
      }
      
      // Convert to dB with -80 dB floor (like librosa default)
      for (const frame of spectrogram) {
        for (const val of frame) {
          const power = val * val;
          let db = 10 * Math.log10(Math.max(power / maxVal, 1e-8));
          db = Math.max(db, -80); // Apply -80 dB floor
          flattened[idx++] = db;
        }
      }
      
      return flattened;
    }
  
    private resizeSpectrogram(features: Float32Array, nMels: number, maxLen: number): Float32Array {
      const targetSize = nMels * maxLen;
      const result = new Float32Array(targetSize);
      
      // Simple resize - for production you might want better interpolation
      const sourceFrames = features.length / nMels;
      
      for (let mel = 0; mel < nMels; mel++) {
        for (let frame = 0; frame < maxLen; frame++) {
          const sourceFrame = Math.min(Math.floor(frame * sourceFrames / maxLen), sourceFrames - 1);
          const sourceIdx = sourceFrame * nMels + mel;
          const targetIdx = frame * nMels + mel;
          
          if (sourceIdx < features.length) {
            result[targetIdx] = features[sourceIdx];
          } else {
            result[targetIdx] = -80; // Pad with silence (like Python)
          }
        }
      }
      
      return result;
    }
  }