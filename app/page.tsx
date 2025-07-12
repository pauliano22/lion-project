import Link from 'next/link';
import { Shield, Download, Zap, Users, ArrowRight, Play } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header */}
      <header className="border-b border-gray-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-gold-red rounded-full"></div>
            <span className="text-xl font-bold gradient-text">Lion Project</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-gold transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-gold transition-colors">How It Works</Link>
            <Link href="#download" className="text-gray-300 hover:text-gold transition-colors">Download</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-gold transition-colors">Pricing</Link>
          </nav>
          <button className="bg-gold text-black px-4 py-2 rounded-lg font-semibold hover:bg-gold-dark transition-colors">
            Try Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Protect Yourself from{' '}
            <span className="gradient-text">AI Voice Deception</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Advanced deepfake detection suite that identifies AI-generated voices in real-time. 
            Safeguard your conversations, verify audio authenticity, and stay ahead of voice fraud.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gold text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-dark transition-colors flex items-center justify-center">
              <Play className="mr-2 h-5 w-5" />
              Try Live Demo
            </button>
            <button className="border border-gold text-gold px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold/10 transition-colors flex items-center justify-center">
              <Download className="mr-2 h-5 w-5" />
              Download Suite
            </button>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section id="demo" className="py-16 px-4 bg-gray-dark">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Test Audio Files</span> Instantly
          </h2>
          <div className="max-w-4xl mx-auto">
            <AudioTester />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Complete <span className="gradient-text">Protection Suite</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Desktop Monitor"
              description="Background monitoring for system audio. Real-time detection with system tray alerts."
              features={["Real-time monitoring", "System tray integration", "Audio capture", "Alert notifications"]}
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Chrome Extension"
              description="Web audio deepfake detection. Protect yourself while browsing and in video calls."
              features={["Web audio capture", "Real-time alerts", "Browser integration", "Video call protection"]}
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Mobile App"
              description="Portable audio verification tool. Verify authenticity anywhere, anytime."
              features={["File upload", "Real-time recording", "Portable verification", "Cross-platform"]}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-dark">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Powered by <span className="gradient-text">Advanced AI</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gold">How Detection Works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Audio Analysis</h4>
                    <p className="text-gray-300">Convert audio to mel-spectrograms for deep analysis</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">AI Detection</h4>
                    <p className="text-gray-300">Custom CNN model trained on thousands of voice samples</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Real-time Results</h4>
                    <p className="text-gray-300">Get instant feedback with 90%+ accuracy in under 2 seconds</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-black border border-gold rounded-lg p-6">
              <h4 className="text-gold font-bold mb-4">Technical Specifications</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Detection Accuracy:</span>
                  <span className="text-gold">90%+</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Speed:</span>
                  <span className="text-gold">&lt; 2 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>False Positive Rate:</span>
                  <span className="text-gold">&lt; 5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Supported Formats:</span>
                  <span className="text-gold">MP3, WAV, M4A</span>
                </div>
                <div className="flex justify-between">
                  <span>Platforms:</span>
                  <span className="text-gold">Windows, Mac, Linux, Chrome, iOS, Android</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">
            Choose Your <span className="gradient-text">Protection</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <DownloadCard
              title="Desktop App"
              description="Background monitoring for your computer"
              price="$29.99"
              features={["Real-time monitoring", "System tray alerts", "Audio capture", "Windows/Mac/Linux"]}
              downloadLink="#"
            />
            <DownloadCard
              title="Chrome Extension"
              description="Web protection for your browser"
              price="Free"
              features={["Web audio detection", "Video call protection", "Browser integration", "Real-time alerts"]}
              downloadLink="#"
              featured
            />
            <DownloadCard
              title="Mobile App"
              description="Portable verification tool"
              price="$4.99"
              features={["File upload", "Real-time recording", "Portable verification", "iOS & Android"]}
              downloadLink="#"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-dark py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-gold-red rounded-full"></div>
            <span className="text-lg font-bold gradient-text">Lion Project</span>
          </div>
          <p className="text-gray-300">
            Protecting authenticity in the age of AI. Built with privacy and security in mind.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, features }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="bg-gray-dark border border-gold/20 rounded-lg p-6 hover:border-gold/40 transition-colors">
      <div className="text-gold mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Download Card Component
function DownloadCard({ title, description, price, features, downloadLink, featured = false }: {
  title: string;
  description: string;
  price: string;
  features: string[];
  downloadLink: string;
  featured?: boolean;
}) {
  return (
    <div className={`border rounded-lg p-6 ${
      featured 
        ? 'border-gold bg-gold/5 transform scale-105' 
        : 'border-gray-dark bg-gray-dark'
    }`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="text-3xl font-bold mb-4 text-gold">{price}</div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
            {feature}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
        featured
          ? 'bg-gold text-black hover:bg-gold-dark'
          : 'border border-gold text-gold hover:bg-gold/10'
      }`}>
        {price === 'Free' ? 'Add to Chrome' : 'Download Now'}
      </button>
    </div>
  );
}

// Audio Tester Component (placeholder for now)
function AudioTester() {
  return (
    <div className="bg-black border border-gold rounded-lg p-8">
      <h3 className="text-2xl font-bold text-gold mb-6 text-center">
        🎤 Test Your Audio File
      </h3>
      <div className="border-2 border-dashed border-gold/30 rounded-lg p-12 text-center">
        <div className="text-gold mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-lg mb-2">Drop your audio file here or click to browse</p>
        <p className="text-sm text-gray-400">Supports MP3, WAV, M4A files</p>
        <button className="mt-4 bg-gold text-black px-6 py-2 rounded-lg font-semibold hover:bg-gold-dark transition-colors">
          Choose File
        </button>
      </div>
      <div className="mt-6 text-center text-sm text-gray-400">
        <p>Files are processed locally and never stored on our servers</p>
      </div>
    </div>
  );
}