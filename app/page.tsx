import Link from 'next/link';
import Image from 'next/image';
import { Shield, Zap, Users, Search, BookOpen } from 'lucide-react';
import AudioTester from '@/components/AudioTester';

// Add these missing component definitions
function FeatureCard({ icon, title, description, features }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="bg-gray-dark border border-gold/20 rounded-lg p-6">
      <div className="text-gold mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gold">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-400 flex items-center">
            <span className="text-gold mr-2">•</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DownloadCard({ title, description, price, features, featured = false }: {
  title: string;
  description: string;
  price: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div className={`bg-gray-dark border rounded-lg p-6 ${featured ? 'border-gold scale-105' : 'border-gold/20'}`}>
      {featured && (
        <div className="bg-gold text-black text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
          RECOMMENDED
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-gold">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="text-3xl font-bold text-gold mb-4">{price}</div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-400 flex items-center">
            <span className="text-gold mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      <button className="w-full bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors">
        Download
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="border-b border-gold/20 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold text-gold">The Lion Project</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-gold transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-gray-300 hover:text-gold transition-colors">How it Works</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-gold transition-colors">Pricing</Link>
          </nav>
          <button className="bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors">
            Try Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <Image 
                src="/images/2.png" 
                alt="Lion Project - Protect Yourself from AI Voice Deception" 
                width={500} 
                height={500}
                className="mx-auto rounded-full shadow-2xl"
                priority
              />
            </div>
            
            <div className="md:w-2/3 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Protect Yourself from{' '}
                <span className="gradient-text">AI Voice Deception</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Advanced AI detection technology that identifies deepfake audio with 90%+ accuracy. 
                Safeguard yourself from voice cloning scams and fraudulent calls.
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                <button className="bg-gold text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-dark transition-colors flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Try Detection Now
                </button>
                <button className="border-2 border-gold text-gold px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold/10 transition-colors flex items-center justify-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Tester Section */}
      <section className="py-20 px-4 bg-gray-dark/50">
        <div className="container mx-auto">
          <AudioTester />
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
                    <h4 className="font-semibold">Result & Confidence</h4>
                    <p className="text-gray-300">Get instant results with confidence scoring</p>
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
            />
            <DownloadCard
              title="Chrome Extension"
              description="Web protection for your browser"
              price="Free"
              features={["Web audio detection", "Video call protection", "Browser integration", "Real-time alerts"]}
              featured
            />
            <DownloadCard
              title="Mobile App"
              description="Portable verification tool"
              price="$4.99"
              features={["File upload", "Real-time recording", "Portable verification", "iOS & Android"]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-dark py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image 
              src="/images/2.png" 
              alt="Lion Project" 
              width={32} 
              height={32}
              className="rounded-full"
            />
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