'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Shield, Search, Phone, Newspaper, AlertTriangle, CheckCircle, Clock, Code, ChevronDown, ArrowRight, ExternalLink, MessageSquare, Send, User, Heart, Monitor, Laptop, Terminal, Smartphone, Apple, Computer, Mail, Copy } from 'lucide-react';
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

function ComingSoonCard({ title, description, price, features, featured = false, available = false, downloadLink = null, buttonText = null, smartDownload = false }: {
  title: string;
  description: string;
  price: string;
  features: string[];
  featured?: boolean;
  available?: boolean;
  downloadLink?: string | null;
  buttonText?: string | null;
  smartDownload?: boolean;
}) {
  const getDownloadLink = () => {
    if (!smartDownload || !available) return downloadLink;

    // Detect operating system
    const userAgent = navigator.userAgent;
    const isMac = userAgent.includes('Mac');
    const isWindows = userAgent.includes('Win');

    if (isMac) {
      return '/Lion-AI-Detection'; // macOS version
    } else if (isWindows) {
      return '/Lion-AI-Detection.exe'; // Windows version
    } else {
      // Default to Windows for other platforms
      return '/Lion-AI-Detection.exe';
    }
  };

  const getButtonText = () => {
    if (!smartDownload) return buttonText || "Install Extension";

    const userAgent = navigator.userAgent;
    const isMac = userAgent.includes('Mac');
    const isWindows = userAgent.includes('Win');

    if (isMac) {
      return "Download for macOS";
    } else if (isWindows) {
      return "Download for Windows";
    } else {
      return "Download App";
    }
  };

  return (
    <div className={`bg-gray-dark border rounded-lg p-6 flex flex-col ${featured ? 'border-gold' : 'border-gold/20'}`}>
      {featured && (
        <div className="bg-gold text-black text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
          NOW AVAILABLE!
        </div>
      )}
      <h3 className="text-xl font-bold mb-2 text-gold">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <div className="text-3xl font-bold text-gold mb-4">{price}</div>
      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-gray-400 flex items-center">
            <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        {available && (downloadLink || smartDownload) ? (
          <a
            href={getDownloadLink() || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors flex items-center justify-center group"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {getButtonText()}
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
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;

    setIsSubmittingFeedback(true);

    try {
      // Using your Formspree form endpoint
      const formspreeResponse = await fetch('https://formspree.io/f/xgvzaojq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'feedback@lionproject.com', // From field for organization
          message: `Lion Project Feedback - Home Page

Feedback: ${feedback}

Submitted: ${new Date().toLocaleString()}
Page: Home Page
User Agent: ${navigator.userAgent}`,
          subject: 'Lion Project Website Feedback',
          _replyto: 'noreply@lionproject.com'
        })
      });

      if (formspreeResponse.ok) {
        console.log('Feedback sent successfully to thelionproject@gmail.com via Formspree!');
        setFeedbackSubmitted(true);
        setFeedback('');

        // Reset success message after 3 seconds
        setTimeout(() => setFeedbackSubmitted(false), 3000);
      } else {
        throw new Error('Formspree submission failed');
      }

    } catch (error) {
      console.error('Failed to submit feedback via Formspree, trying mailto fallback:', error);

      // Fallback: Open user's email client with pre-filled content
      const subject = encodeURIComponent('Lion Project Feedback - Home Page');
      const body = encodeURIComponent(
        `Hi,\n\nI have feedback about the Lion Project:\n\n${feedback}\n\nSubmitted: ${new Date().toLocaleString()}\nPage: Home Page\n\nThanks!`
      );
      const mailtoLink = `mailto:thelionproject@gmail.com?subject=${subject}&body=${body}`;

      // Open mailto link
      window.open(mailtoLink, '_self');

      // Show success message since we opened their email client
      setFeedbackSubmitted(true);
      setFeedback('');
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

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
      <section className="min-h-screen flex flex-col justify-center items-center relative px-4 pb-16 md:pb-0">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
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

              {/* Updated Hook - Option 2 (Empowerment-based) */}
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                See through <span className="gradient-text">AI deception</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                Real-time protection for your family against deepfakes and AI scams
              </p>

              {/* All options as small buttons */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => smoothScrollTo('demo')}
                    className="text-sm bg-gray-800/50 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700/50 transition-colors flex items-center border-1 border-gold"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Demo
                  </button>
                  <button
                    onClick={() => window.open("https://chromewebstore.google.com/detail/lion-project-ai-detector/bgcjkaplennpginekckeaomkkidhifdg?authuser=0&hl=en&pli=1", "_blank")}
                    className="text-sm bg-gray-800/50 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700/50 transition-colors flex items-center border border-gray-600"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Chrome extension
                  </button>
                  <a
                    href="#coming-soon"
                    onClick={(e) => { e.preventDefault(); smoothScrollTo('coming-soon'); }}
                    className="text-sm bg-gray-800/50 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700/50 transition-colors flex items-center border border-gray-600"
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    Windows
                  </a>
                  <a
                    href="#coming-soon"
                    onClick={(e) => { e.preventDefault(); smoothScrollTo('coming-soon'); }}
                    className="text-sm bg-gray-800/50 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700/50 transition-colors flex items-center border border-gray-600"
                  >
                    <Apple className="w-4 h-4 mr-2" />
                    macOS
                  </a>
                  <a
                    href="#coming-soon"
                    onClick={(e) => { e.preventDefault(); smoothScrollTo('coming-soon'); }}
                    className="text-sm bg-gray-800/50 text-gray-300 px-4 py-2 rounded-md hover:bg-gray-700/50 transition-colors flex items-center border border-gray-600"
                  >
                    <Computer className="w-4 h-4 mr-2" />
                    Linux
                  </a>
                </div>
              </div>

              {/* Status indicator */}
              <div className="inline-flex items-center text-sm text-gray-400 bg-gray-900/50 px-4 py-2 rounded-full mb-8 md:mb-0">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Chrome extension free forever • Desktop apps free during beta
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - responsive positioning */}
        <div className="absolute bottom-8 md:bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => smoothScrollTo('demo')}
            className="text-gold hover:text-gold-dark transition-colors p-2"
          >
            <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
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
          <div className="bg-gray border border-gold/30 rounded-xl p-8 mb-16 text-center">
            <h3 className="text-3xl font-bold text-gold mb-8">Unmatched Pricing</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="border border-red-500/30 rounded-lg p-6">
                <h4 className="text-lg font-bold text-red-400 mb-2">Competitors</h4>
                <div className="text-3xl font-bold text-red-400 mb-2">$13-$700</div>
                <p className="text-gray-300 text-sm">per month, per tool</p>
              </div>

              <div className="border border-gold rounded-lg p-6">
                <h4 className="text-lg font-bold text-gold mb-2">Individual Lion Products</h4>
                <div className="text-3xl font-bold text-gold mb-2">$0-$2.99</div>
                <p className="text-gray-300 text-sm">per month</p>
              </div>

              <div className="border border-gold rounded-lg p-6">
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
            Our Chrome extension and desktop apps are now live! Mobile app launching soon.
          </p>
          <div className="grid md:grid-cols-3 gap-8">

            {/* Desktop Guardian - Multi-Platform */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/50 hover:border-yellow-400 transition-all">
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">Desktop Guardian</h3>
              <p className="text-gray-300 mb-4">Protects calls and apps on your computer</p>
              <div className="text-3xl font-bold mb-6">
                <span className="text-yellow-400">Free</span>
                <span className="text-sm text-gray-400 block">during beta</span>
                <span className="text-sm text-gray-500">$2.99/mo after launch</span>
              </div>

              <ul className="text-left mb-8 space-y-2">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Phone calls through your computer
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Desktop video call protection (Zoom, Teams)
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Audio from any desktop application
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Real-time deepfake detection (under 2s)
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Smart alert system & logging
                </li>
              </ul>

              <div className="space-y-3">
                <h4 className="font-semibold text-yellow-400 mb-3">Download for Your Platform:</h4>

                <a
                  href="https://github.com/pauliano22/deepfake-audio-m2/releases/latest/download/Lion-AI-Detection-Windows.exe"
                  className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors border border-yellow-500/30 hover:border-yellow-400/50"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Windows (30.5 MB)
                </a>

                <a
                  href="https://github.com/pauliano22/deepfake-audio-m2/releases/latest/download/Lion-AI-Detection-macOS"
                  className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors border border-yellow-500/30 hover:border-yellow-400/50"
                >
                  <Laptop className="w-4 h-4 mr-2" />
                  macOS (17.6 MB)
                </a>

                <a
                  href="https://github.com/pauliano22/deepfake-audio-m2/releases/latest/download/Lion-AI-Detection-Linux"
                  className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors border border-yellow-500/30 hover:border-yellow-400/50"
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Linux (44.1 MB)
                </a>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Hosted securely on GitHub Releases • Open source code available
              </p>
            </div>

            {/* Chrome Extension - Featured with enhanced styling */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border-2 border-yellow-400 hover:border-yellow-300 transition-all">
              <div className="flex items-center mb-2">
                <h3 className="text-2xl font-bold text-yellow-400">Family Shield</h3>
                <span className="ml-2 text-xs bg-red-600/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                  Popular
                </span>
              </div>
              <p className="text-gray-300 mb-4">Scans everything you see in your browser</p>
              <div className="text-3xl font-bold mb-6">
                <span className="text-yellow-400">Free</span>
              </div>

              <ul className="text-left mb-8 space-y-2">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Social media feeds (Facebook, Twitter, etc)
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  YouTube and video content scanning
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  News article verification
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Web-based video calls
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  One-click reporting
                </li>
              </ul>

              <a
                href="https://chromewebstore.google.com/detail/lion-project-ai-detector/bgcjkaplennpginekckeaomkkidhifdg?authuser=0&hl=en&pli=1"
                className="flex items-center justify-center w-full bg-gray-700 hover:bg-gray-600 text-white py-4 px-6 rounded-lg transition-colors border border-yellow-400 hover:border-yellow-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="w-5 h-5 mr-2" />
                Install Extension
              </a>

              <p className="text-xs text-gray-400 mt-4">
                Available on Chrome Web Store • 1-click install
              </p>
            </div>

            {/* Mobile App - Coming Soon */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-500/50 hover:border-yellow-400 transition-all opacity-75">
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">Mobile Protector</h3>
              <p className="text-gray-300 mb-4">Monitors apps and calls on your phone</p>
              <div className="text-3xl font-bold mb-6">
                <span className="text-yellow-400">$2.99</span>
                <span className="text-sm text-gray-400 block">/month</span>
              </div>

              <ul className="text-left mb-8 space-y-2">
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  TikTok, Instagram, Snapchat scanning
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Phone call screening & analysis
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  WhatsApp & messaging apps
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Mobile video calls (FaceTime, etc)
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-400 mr-2">✓</span>
                  Real-time mobile alerts
                </li>
              </ul>

              <button
                className="flex items-center justify-center w-full bg-gray-600 text-gray-300 py-4 px-6 rounded-lg cursor-not-allowed border border-gray-500"
                disabled
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Coming Soon
              </button>

              <p className="text-xs text-gray-400 mt-4">
                iOS & Android • Launching Q2 2025
              </p>
            </div>
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
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Code className="w-12 h-12 text-gold mr-4" />
              <h2 className="text-4xl font-bold">
                For <span className="gradient-text">Developers</span>
              </h2>
            </div>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Integrate our powerful deepfake detection capabilities directly into your applications with our developer-friendly API.
            </p>

            {/* API Demo and Documentation */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Live API Demo */}
              <div className="bg-black border border-gold/20 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-gold mb-4">Try the API Live</h3>
                <p className="text-gray-300 mb-4">
                  Test our deepfake detection API directly in your browser. Upload audio files and see real-time results.
                </p>
                <a
                  href="https://huggingface.co/spaces/pauliano22/deepfake-audio-detector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Live API Demo
                </a>
              </div>

              {/* API Specifications */}
              <div className="bg-black border border-gold/20 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-gold mb-4">API Specifications</h3>
                <div className="text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Endpoint:</span>
                    <span className="text-gray-300">/predict</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Method:</span>
                    <span className="text-gray-300">POST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Formats:</span>
                    <span className="text-gray-300">WAV, MP3, M4A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response:</span>
                    <span className="text-gray-300">JSON with confidence scores</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <div className="bg-black border border-gold/20 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-gold mb-6">Code Examples</h3>

              <div className="space-y-6">
                {/* Python Example */}
                <div className="text-left">
                  <h4 className="font-semibold text-gold mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Python
                  </h4>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 relative">
                    <button
                      onClick={() => navigator.clipboard.writeText(`from gradio_client import Client, handle_file

client = Client("pauliano22/deepfake-audio-detector")
result = client.predict(
    audio=handle_file('path/to/audio.wav'),
    api_name="/predict"
)
print(result)`)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gold transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-gray-300 text-sm leading-relaxed">
                      {`from gradio_client import Client, handle_file

client = Client("pauliano22/deepfake-audio-detector")
result = client.predict(
    audio=handle_file('path/to/audio.wav'),
    api_name="/predict"
)
print(result)`}
                    </pre>
                  </div>
                </div>

                {/* JavaScript Example */}
                <div className="text-left">
                  <h4 className="font-semibold text-gold mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    JavaScript
                  </h4>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 relative">
                    <button
                      onClick={() => navigator.clipboard.writeText(`import { Client } from "@gradio/client";

const client = await Client.connect(
  "pauliano22/deepfake-audio-detector"
);
const result = await client.predict("/predict", { 
  audio: audioFile 
});
console.log(result.data);`)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gold transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-gray-300 text-sm leading-relaxed">
                      {`import { Client } from "@gradio/client";

const client = await Client.connect(
  "pauliano22/deepfake-audio-detector"
);
const result = await client.predict("/predict", { 
  audio: audioFile 
});
console.log(result.data);`}
                    </pre>
                  </div>
                </div>

                {/* cURL Example */}
                <div className="text-left">
                  <h4 className="font-semibold text-gold mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    cURL
                  </h4>
                  <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 relative">
                    <button
                      onClick={() => navigator.clipboard.writeText(`curl -X POST \\
  https://pauliano22-deepfake-audio-detector.hf.space/gradio_api/call/predict \\
  -H "Content-Type: application/json" \\
  -d '{"data": [{"path": "audio.wav", "meta": {"_type": "gradio.FileData"}}]}'`)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gold transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-gray-300 text-sm leading-relaxed">
                      {`curl -X POST \\
  https://pauliano22-deepfake-audio-detector.hf.space/gradio_api/call/predict \\
  -H "Content-Type: application/json" \\
  -d '{"data": [{"path": "audio.wav", "meta": {"_type": "gradio.FileData"}}]}'`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Features and Resources */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black border border-gold/20 rounded-lg p-6">
                <h4 className="font-semibold text-gold mb-4">API Features</h4>
                <ul className="space-y-3 text-left">
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    Real-time audio deepfake detection
                  </li>
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    Multiple audio format support (WAV, MP3, M4A)
                  </li>
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    Confidence scoring and detailed analysis
                  </li>
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    RESTful API with JSON responses
                  </li>
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    Hosted on Hugging Face for reliability
                  </li>
                </ul>
              </div>

              <div className="bg-black border border-gold/20 rounded-lg p-6">
                <h4 className="font-semibold text-gold mb-4">Getting Started</h4>
                <ul className="space-y-3 text-left">
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    No API key required - free to use
                  </li>
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    Python, JavaScript, and cURL examples
                  </li>
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    Best results with 3-10 second audio clips
                  </li>
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    Clear speech recordings recommended
                  </li>
                  <li className="text-sm text-gray-300 flex items-center">
                    <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                    Gradio client libraries available
                  </li>
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center">
              <p className="text-gray-300 mb-4">
                Ready to integrate deepfake detection into your application?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://huggingface.co/spaces/pauliano22/deepfake-audio-detector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border-2 border-gold text-gold px-6 py-3 rounded-lg font-semibold hover:bg-gold/10 transition-colors"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Try Live Demo
                </a>
                <button
                  onClick={() => window.open('mailto:thelionprojectai@gmail.com?subject=API Integration Support', '_blank')}
                  className="inline-flex items-center bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get Support
                </button>
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