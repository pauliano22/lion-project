'use client';

// import Link from 'next/link';
import Image from 'next/image';
import { Shield, /*Zap, Users, */ Search, /*BookOpen,*/ Phone, Newspaper, AlertTriangle, CheckCircle, Clock, /*Globe,*/ Code } from 'lucide-react';
import AudioTester from '@/components/AudioTester';

// Add these missing component definitions
/* function FeatureCard({ icon, title, description, features }: {
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
} */

function ProtectionCard({ icon, title, description, examples }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
}) {
  return (
    <div className="bg-gray-dark border border-gold/20 rounded-lg p-6">
      <div className="text-gold mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gold">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gold">Common threats we detect:</p>
        <ul className="space-y-1">
          {examples.map((example, index) => (
            <li key={index} className="text-sm text-gray-400 flex items-start">
              <AlertTriangle className="w-4 h-4 text-red mr-2 mt-0.5 flex-shrink-0" />
              {example}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ComingSoonCard({ title, description, price, features, featured = false }: {
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
          MOST POPULAR
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-gold">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="text-3xl font-bold text-gold mb-4">{price}</div>
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-400 flex items-center">
            <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <button className="w-full bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
        <Clock className="w-4 h-4 inline mr-2" />
        Coming Soon
      </button>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Notify me when available
      </p>
    </div>
  );
}

// Smooth scroll function
const smoothScrollTo = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white scroll-smooth">
      {/* Sticky Navigation */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gold/20 px-1 py-1">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image 
              src="/images/2.png" 
              alt="Lion Project" 
              width={60}
              height={60}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-gold">Lion Project</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => smoothScrollTo('protection')}
              className="text-gray-300 hover:text-gold transition-colors"
            >
              Protection
            </button>
            <button 
              onClick={() => smoothScrollTo('how-it-works')}
              className="text-gray-300 hover:text-gold transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => smoothScrollTo('coming-soon')}
              className="text-gray-300 hover:text-gold transition-colors"
            >
              Products
            </button>
            <button 
              onClick={() => smoothScrollTo('developers')}
              className="text-gray-300 hover:text-gold transition-colors"
            >
              Developers
            </button>
          </nav>
          <button 
            onClick={() => smoothScrollTo('demo')}
            className="bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
          >
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
                alt="Lion Project - Protect Your Family from AI Deception" 
                width={250} 
                height={250}
                className="mx-auto rounded-full shadow-2xl"
                priority
              />
            </div>
            
            <div className="md:w-2/3 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Protect Your Family from{' '}
                <span className="gradient-text">AI Deception</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                Advanced AI detection that runs in the background, automatically alerting you to{' '}
                <span className="gradient-text">deepfake scams</span>,{' '}
                <span className="gradient-text">AI-generated news</span>, and{' '}
                <span className="gradient-text">voice cloning</span> attempts. Specially designed to protect older adults and 
                vulnerable family members from digital deception.
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                <button 
                  onClick={() => smoothScrollTo('demo')}
                  className="bg-gold text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-dark transition-colors flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Try Free Demo
                </button>
                <button 
                  onClick={() => smoothScrollTo('protection')}
                  className="border-2 border-gold text-gold px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold/10 transition-colors flex items-center justify-center"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  How It Protects
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
                Products complete & launching soon - Try our detection model free while we prepare for release
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Tester Section */}
      <section id="demo" className="py-20 px-4 bg-gray-dark/50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Test Our AI Detection Model
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Try our detection technology for free. Upload any audio file and we&apos;ll analyze it for AI generation signs. 
              This is the same technology that will power our background monitoring products.
            </p>
          </div>
          <AudioTester />
        </div>
      </section>

      {/* Protection Types Section */}
      <section id="protection" className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Comprehensive <span className="gradient-text">Digital Protection</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <ProtectionCard
              icon={<Phone className="h-8 w-8" />}
              title="Phone Call Protection"
              description="Real-time monitoring of incoming calls to detect voice cloning and deepfake attempts targeting your family."
              examples={[
                "Fake calls from 'grandchildren' asking for money",
                "Cloned voices of family members in distress",
                "AI-generated voices impersonating trusted contacts",
                "Emergency scam calls using familiar voices"
              ]}
            />
            <ProtectionCard
              icon={<Newspaper className="h-8 w-8" />}
              title="News & Media Monitoring"
              description="Background scanning of news feeds, social media, and videos to flag AI-generated content before it misleads."
              examples={[
                "Deepfake political speeches and statements",
                "AI-generated news anchors spreading misinformation",
                "Fake audio clips on social media platforms",
                "Manipulated celebrity endorsements and testimonials"
              ]}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-dark">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Always-On <span className="gradient-text">Protection</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gold">Background Monitoring</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Continuous Scanning</h4>
                    <p className="text-gray-300">Monitors phone calls, news feeds, and social media in real-time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">AI Detection Analysis</h4>
                    <p className="text-gray-300">Advanced neural networks identify deepfake patterns and anomalies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Instant Alerts</h4>
                    <p className="text-gray-300">Immediate notifications when suspicious content is detected</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-gold text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Family Protection</h4>
                    <p className="text-gray-300">Special modes for protecting elderly family members from sophisticated scams</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-black border border-gold rounded-lg p-6">
              <h4 className="text-gold font-bold mb-4">Detection Capabilities</h4>
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
                  <span className="text-gold">MP3, WAV, M4A, Phone Calls</span>
                </div>
                <div className="flex justify-between">
                  <span>Monitoring:</span>
                  <span className="text-gold">24/7 Background Protection</span>
                </div>
                <div className="flex justify-between">
                  <span>Platforms:</span>
                  <span className="text-gold">Windows, Mac, Chrome, iOS, Android</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section id="coming-soon" className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Choose Your <span className="gradient-text">Protection Level</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Our products are complete and ready for launch. We&apos;re finalizing security audits and preparing distribution. 
            Sign up to be notified when they become available.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <ComingSoonCard
              title="Desktop Guardian"
              description="Complete background monitoring for your computer and phone calls against deepfake scams"
              price="$5/mo"
              features={[
                "24/7 call monitoring & alerts",
                "News feed scanning",
                "Browser protection",
                "Family account management",
                "Emergency contact alerts"
              ]}
            />
            <ComingSoonCard
              title="Family Shield (Chrome)"
              description="Browser extension for web and social media protection against AI-generated news"
              price="Free"
              features={[
                "Social media scanning",
                "Video call protection", 
                "News article verification",
                "One-click reporting",
                "Elderly-friendly alerts"
              ]}
              featured
            />
            <ComingSoonCard
              title="Mobile Protector"
              description="On-the-go protection for calls and messages against voice cloning"
              price="$2/mo"
              features={[
                "Call screening & analysis",
                "Text message verification",
                "WhatsApp/SMS scanning",
                "GPS-based scam alerts",
                "Emergency contact integration"
              ]}
            />
          </div>
        </div>
      </section>

      {/* For Developers Section */}
      <section id="developers" className="py-16 px-4 bg-gray-dark/50">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Code className="w-12 h-12 text-gold mr-4" />
              <h2 className="text-4xl font-bold">
                For <span className="gradient-text">Developers</span>
              </h2>
            </div>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Integrate our powerful deepfake detection capabilities directly into your applications with our developer-friendly API.
            </p>

            <div className="bg-black border border-gold/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gold mb-4">API Documentation Coming Soon</h3>
              <p className="text-gray-300 mb-6">
                We&apos;re preparing comprehensive documentation for developers who want to integrate our AI detection technology 
                into their own applications. Our API will support real-time audio analysis, batch processing, and custom model configurations.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gold mb-3">What&apos;s Included:</h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      RESTful API with JSON responses
                    </li>
                    <li className="text-sm text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      Real-time and batch processing endpoints
                    </li>
                    <li className="text-sm text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      Multiple audio format support
                    </li>
                    <li className="text-sm text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      Confidence scoring and detailed analysis
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gold mb-3">Developer Resources:</h4>
                  <ul className="space-y-2">
                    <li className="text-sm text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      Code examples in Python, JavaScript, cURL
                    </li>
                    <li className="text-sm text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      SDK libraries for popular frameworks
                    </li>
                    <li className="text-sm text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      Interactive API playground
                    </li>
                    <li className="text-sm text-gray-300 flex items-center">
                      <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                      24/7 developer support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
          <p className="text-gray-300 mb-4">
            Protecting families from AI deception. Specially designed for older adults and vulnerable populations.
          </p>
          <p className="text-sm text-gray-500">
            Built with privacy and security in mind. Your data never leaves your device.
          </p>
        </div>
      </footer>
    </div>
  );
}