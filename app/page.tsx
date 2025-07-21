'use client';

import Image from 'next/image';
import { Shield, Search, Phone, Newspaper, AlertTriangle, CheckCircle, Clock, Code, ChevronDown, ArrowRight, ExternalLink } from 'lucide-react';
import AudioTester from '@/components/AudioTester';

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

function ComingSoonCard({ title, description, price, features, featured = false, available = false, downloadLink = null }: {
  title: string;
  description: string;
  price: string;
  features: string[];
  featured?: boolean;
  available?: boolean;
  downloadLink?: string | null;
}) {
  return (
    <div className={`bg-gray-dark border rounded-lg p-6 ${featured ? 'border-gold' : 'border-gold/20'}`}>
      {featured && (
        <div className="bg-gold text-black text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
          NOW AVAILABLE!
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
      {available && downloadLink ? (
        <a
          href={downloadLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center group"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Install Extension
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
      ) : (
        <button className="w-full bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
          <Clock className="w-4 h-4 inline mr-2" />
          Coming Soon
        </button>
      )}
      {!available && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Notify me when available
        </p>
      )}
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
            <span className="text-xl text-gold">Lion Project</span>
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

      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex flex-col justify-center items-center relative px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/3">
              <Image
                src="/images/2.png"
                alt="Lion Project - Protect Your Family from AI Deception"
                width={300}
                height={300}
                className="mx-auto rounded-full shadow-2xl"
                priority
              />
            </div>

            <div className="md:w-2/3 text-center md:text-left">
              {/* Lion Project Title */}
              <div className="mb-6">
                <div className="inline-flex items-center space-x-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-yellow-500 rounded-full"></div>
                  <span className="text-lg md:text-xl font-bold text-gold tracking-wide uppercase">
                    The Lion Project
                  </span>
                  <div className="w-1 h-8 bg-gradient-to-b from-gold to-yellow-500 rounded-full"></div>
                </div>
                <div className="h-0.5 bg-gradient-to-r from-gold/60 to-transparent w-full max-w-md mx-auto md:mx-0"></div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Protection from{' '}
                <span className="gradient-text">AI</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                No more worrying about{' '}
                <span className="gradient-text">scams</span>,{' '}
                <span className="gradient-text">fake news</span>, or{' '}
                <span className="gradient-text">voice cloning</span>
              </p>

              {/* Main CTA buttons */}
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-start mb-8">
                <button
                  onClick={() => smoothScrollTo('demo')}
                  className="bg-gold text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold-dark transition-colors flex items-center justify-center group"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Try Free Demo
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => smoothScrollTo('protection')}
                  className="border-2 border-gold text-gold px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gold/10 transition-colors flex items-center justify-center"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  How It Works
                </button>
              </div>

              {/* Status indicator */}
              <div className="inline-flex items-center text-sm text-gray-400 bg--900/50 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Products ready - launching soon
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - moved higher */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => smoothScrollTo('demo')}
            className="text-gold hover:text-gold-dark transition-colors"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4 bg-gray-dark">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            The <span className="gradient-text">Only</span> Background Protection
          </h2>
          <p className="text-center text-gray-300 mb-16 max-w-3xl mx-auto">
            Competitors charge $13-$700/month for single tools. They can&apos;t touch our prices.
          </p>
          {/* Price Comparison */}
          <div className="bg-gradient-to-r from-gold/10 to-yellow-500/10 border border-gold/30 rounded-xl p-8 mb-16 text-center">
            <h3 className="text-3xl font-bold text-gold mb-8">Unmatched Pricing</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h4 className="text-lg font-bold text-red-400 mb-2">Competitors</h4>
                <div className="text-3xl font-bold text-red-400 mb-2">$13-$700</div>
                <p className="text-gray-300 text-sm">per month, per tool</p>
              </div>

              <div className="bg-gold/20 border border-gold rounded-lg p-6">
                <h4 className="text-lg font-bold text-gold mb-2">Individual Lion Products</h4>
                <div className="text-3xl font-bold text-gold mb-2">$0-$2.99</div>
                <p className="text-gray-300 text-sm">per month</p>
              </div>

              <div className="bg-gold/30 border-2 border-gold rounded-lg p-6">
                <h4 className="text-lg font-bold text-gold mb-2">Complete Lion Suite</h4>
                <div className="text-3xl font-bold text-gold mb-2">$4.99</div>
                <p className="text-gray-300 text-sm">per month (best value)</p>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <h4 className="text-lg font-bold text-green-400 mb-2">You Save</h4>
                <div className="text-3xl font-bold text-green-400 mb-2">95%+</div>
                <p className="text-gray-300 text-sm">vs competitors</p>
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
            Our Chrome extension is now live! Desktop and mobile apps launching soon.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <ComingSoonCard
              title="Desktop Guardian"
              description="Protects calls and apps on your computer"
              price="$2.99/mo"
              features={[
                "Phone calls through your computer",
                "Desktop video call protection (Zoom, Teams)",
                "Audio from any desktop application",
                "Family account management",
                "Emergency contact alerts"
              ]}
            />
            <ComingSoonCard
              title="Family Shield (Chrome)"
              description="Scans everything you see in your browser"
              price="Free"
              features={[
                "Social media feeds (Facebook, Twitter, etc)",
                "YouTube and video content scanning",
                "News article verification",
                "Web-based video calls",
                "One-click reporting"
              ]}
              featured
              available={true}
              downloadLink="https://chromewebstore.google.com/detail/lion-project-ai-detector/bgcjkaplennpginekckeaomkkidhifdg?authuser=0&hl=en&pli=1"
            />
            <ComingSoonCard
              title="Mobile Protector"
              description="Monitors apps and calls on your phone"
              price="$2.99/mo"
              features={[
                "TikTok, Instagram, Snapchat scanning",
                "Phone call screening & analysis",
                "WhatsApp & messaging apps",
                "Mobile video calls (FaceTime, etc)",
                "Real-time mobile alerts"
              ]}
            />
          </div>
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
              description="Real-time call monitoring to detect voice cloning and deepfake attempts."
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
              description="Notify you of AI-generated content in news feeds, social media, and videos."
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
      {/* Audio Tester Section */}
      <section id="demo" className="py-20 px-4 bg-gray-dark/50">
        <div className="container mx-auto">
          <AudioTester />
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
          <p className="text-sm text-gray-500 mb-4">
            Built with privacy and security in mind. Your data never leaves your device.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
            <span>&copy; 2025 Lion Project</span>
            <span>|</span>
            <a href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="/terms" className="hover:text-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}