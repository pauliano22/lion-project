'use client';

import { useState } from 'react';
import { Shield, Search, Phone, Newspaper, AlertTriangle, CheckCircle, Clock, Code, ChevronDown, ExternalLink, MessageSquare, Send, User, Heart, Monitor, Laptop, Terminal, Smartphone, Apple, Computer, Mail, Copy, Globe, Lock } from 'lucide-react';
import Image from 'next/image';
import AudioTester from '@/components/AudioTester';

interface ProtectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
}

function ProtectionCard({ title, description, examples }: ProtectionCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 hover:border-orange-500/40 transition-all duration-500 group shadow-lg shadow-orange-500/5">

      <h3 className="text-2xl font-light mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">{title}</h3>
      <p className="text-gray-300 mb-6 font-light leading-relaxed">{description}</p>
      <div className="space-y-3">
        <p className="text-sm font-light text-orange-400">Common threats we detect:</p>
        <ul className="space-y-2">
          {examples.map((example, index) => (
            <li key={index} className="text-sm text-gray-400 flex items-start font-light">
              <AlertTriangle className="w-4 h-4 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              {example}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

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
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) return;
    setIsSubmittingFeedback(true);

    // Simulate submission
    setTimeout(() => {
      setFeedbackSubmitted(true);
      setFeedback('');
      setIsSubmittingFeedback(false);
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-orange-500/20">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo with red circle and white shield */}
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 tracking-wider">
              Lion Project
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <button onClick={() => smoothScrollTo('protection')} className="text-gray-300 hover:text-orange-400 transition-colors font-light">
              Protection
            </button>
            <button onClick={() => smoothScrollTo('how-it-works')} className="text-gray-300 hover:text-orange-400 transition-colors font-light">
              How it Works
            </button>
            <button onClick={() => smoothScrollTo('products')} className="text-gray-300 hover:text-orange-400 transition-colors font-light">
              Products
            </button>
            <button onClick={() => smoothScrollTo('developers')} className="text-gray-300 hover:text-orange-400 transition-colors font-light">
              Developers
            </button>
          </nav>

          <button
            onClick={() => smoothScrollTo('demo')}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-light hover:from-orange-400 hover:to-red-400 transition-all duration-300 shadow-lg shadow-orange-500/25"
          >
            Try Demo
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 pb-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero1.webp')",
            }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Additional gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center space-y-8 max-w-5xl mx-auto">

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-extralight leading-tight">
                See through <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-light">AI deception</span>
              </h1>
              <p className="text-xl lg:text-2xl text-white font-light leading-relaxed mx-auto max-w-3xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-light">Lion Project</span> catches deepfakes and fake news while you browse.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => smoothScrollTo('demo')}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-light text-lg hover:from-orange-400 hover:to-red-400 transition-all duration-300 flex items-center shadow-lg shadow-orange-500/25"
              >
                <Search className="w-5 h-5 mr-3" />
                Try Demo
              </button>
              <button
                onClick={() => window.open("https://chromewebstore.google.com/detail/lion-project-ai-detector/bgcjkaplennpginekckeaomkkidhifdg", "_blank")}
                className="bg-black/30 border border-orange-500/50 text-orange-400 px-8 py-4 rounded-xl font-light text-lg hover:bg-orange-500/10 transition-all duration-300 flex items-center backdrop-blur-sm"
              >
                <Shield className="w-5 h-5 mr-3" />
                Chrome Extension
              </button>
            </div>

            {/* Platform Icons */}
            <div className="flex flex-col items-center space-y-4 pt-4">
              <span className="text-gray-300 font-light text-sm">Available on:</span>
              <div className="flex space-x-4">
                <Monitor className="w-6 h-6 text-gray-300 hover:text-orange-400 transition-colors" />
                <Apple className="w-6 h-6 text-gray-300 hover:text-orange-400 transition-colors" />
                <Computer className="w-6 h-6 text-gray-300 hover:text-orange-400 transition-colors" />
                <Smartphone className="w-6 h-6 text-gray-300 hover:text-orange-400 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => smoothScrollTo('how-it-works')}
            className="text-orange-400 hover:text-orange-300 transition-colors p-2"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Protection Types */}
      <section id="protection" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extralight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">AI Detection</span> Made Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our software runs quietly in the background and alerts you instantly when AI-generated content is detected.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            <ProtectionCard
              icon={<Phone className="h-12 w-12" />}
              title="Phone Call Alerts"
              description="Get notified when AI voices are detected on your calls."
              examples={[
                "Fake family emergency calls",
                "Cloned voices asking for money",
                "AI impersonators"
              ]}
            />
            <ProtectionCard
              icon={<Newspaper className="h-12 w-12" />}
              title="Media Monitoring"
              description="Spot AI-generated content in news, social media, and videos."
              examples={[
                "Deepfake videos",
                "AI-generated news",
                "Fake audio clips"
              ]}
            />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Real-time Protection",
                desc: "Continuous monitoring across all your devices"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Universal Coverage",
                desc: "Works with any app, browser, or platform"
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Privacy First",
                desc: "Your data never leaves your device"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900/30 to-black/30 backdrop-blur-sm border border-orange-500/10 rounded-2xl p-6 text-center hover:border-orange-500/30 transition-all duration-500"
              >
                <div className="text-orange-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-light text-orange-400 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-300 font-light">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extralight mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Only</span> Background Protection
            </h2>
            <p className="text-xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
              Competitors charge $13-$700/month for single tools. They can&apos;t touch our prices.
            </p>
          </div>

          {/* Price Comparison */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-8 mb-16 shadow-lg shadow-orange-500/5">
            <h3 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-12 text-center">
              Unmatched Pricing
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="border border-red-500/30 rounded-2xl p-6 text-center bg-red-500/5">
                <h4 className="text-lg font-light text-red-400 mb-2">Competitors</h4>
                <div className="text-3xl font-extralight text-red-400 mb-2">$13-$700</div>
                <p className="text-gray-300 text-sm font-light">per month, per tool</p>
              </div>

              <div className="border border-orange-500 rounded-2xl p-6 text-center bg-orange-500/5">
                <h4 className="text-lg font-light text-orange-400 mb-2">Individual Lion Products</h4>
                <div className="text-3xl font-extralight text-orange-400 mb-2">$0-$2.99</div>
                <p className="text-gray-300 text-sm font-light">per month</p>
              </div>

              <div className="border border-orange-500 rounded-2xl p-6 text-center bg-orange-500/5">
                <h4 className="text-lg font-light text-orange-400 mb-2">Complete Lion Suite</h4>
                <div className="text-3xl font-extralight text-orange-400 mb-2">$4.99</div>
                <p className="text-gray-300 text-sm font-light">per month (best value)</p>
              </div>

              <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 text-center">
                <h4 className="text-lg font-light text-green-400 mb-2">You Save</h4>
                <div className="text-3xl font-extralight text-green-400 mb-2">95%+</div>
                <p className="text-gray-300 text-sm font-light">vs competitors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gradient-to-b from-transparent to-orange-500/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extralight mb-6">
              Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Protection Level</span>
            </h2>
            <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
              Our Chrome extension and desktop apps are now live! Mobile app launching soon.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Desktop Guardian */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-8 hover:border-orange-500/40 transition-all duration-500 shadow-lg shadow-orange-500/5">
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl overflow-hidden border border-orange-500/20 mb-6">
                <Image
                  src="/images/desktop-guardian.png"
                  alt="Desktop Guardian - Lion Project desktop application protecting computer calls and apps"
                  width={400}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-light mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                Desktop Guardian
              </h3>
              <p className="text-gray-300 mb-4 font-light">Protects calls and apps on your computer</p>

              <div className="text-center mb-6">
                <span className="text-3xl font-extralight text-orange-400">Free</span>
                <span className="text-sm text-gray-400 block font-light">during beta</span>
                <span className="text-sm text-gray-500 font-light">$2.99/mo after launch</span>
              </div>

              <ul className="space-y-3 mb-8 font-light">
                {[
                  "Phone calls through your computer",
                  "Desktop video call protection (Zoom, Teams)",
                  "Audio from any desktop application",
                  "Real-time deepfake detection (under 2s)",
                  "Smart alert system & logging"
                ].map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-orange-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                {[
                  {
                    icon: <Monitor className="w-4 h-4" />,
                    label: "Windows",
                    link: "https://github.com/pauliano22/deepfake-audio-m2/releases/download/v1.1.2/Lion-AI-Detection-Windows.exe"
                  },
                  {
                    icon: <Laptop className="w-4 h-4" />,
                    label: "macOS",
                    link: "https://github.com/pauliano22/deepfake-audio-m2/releases/download/v1.1.2/Lion-AI-Detection-macOS"
                  },
                  {
                    icon: <Terminal className="w-4 h-4" />,
                    label: "Linux",
                    link: "https://github.com/pauliano22/deepfake-audio-m2/releases/download/v1.1.2/Lion-AI-Detection-Linux"
                  }
                ].map((platform: { icon: React.ReactNode; label: string; link: string }, index: number) => (
                  <a
                    key={index}
                    href={platform.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full bg-gray-700/50 hover:bg-gray-600/50 text-white py-3 px-4 rounded-xl transition-colors border border-orange-500/20 hover:border-orange-500/40 font-light"
                  >
                    {platform.icon}
                    <span className="ml-2">{platform.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Family Shield - Featured */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8 hover:border-orange-400 transition-all duration-500 shadow-lg shadow-orange-500/20 relative">
              <div className="absolute top-4 right-4 bg-black text-red-400 px-3 py-1 rounded-full border-2 border-red text-xs font-light">
                Popular
              </div>

              {/* Product Image */}
              <div className="h-48 bg-black rounded-2xl overflow-hidden border border-orange-500/30 mb-6">
                <Image
                  src="/images/family-shield.svg"
                  alt="Family Shield - Lion Project Chrome extension protecting browser content"
                  width={400}
                  height={192}
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>

              <h3 className="text-2xl font-light mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 text-center">
                Family Shield
              </h3>
              <p className="text-gray-300 mb-4 font-light text-center">Scans everything you see in your browser</p>

              <div className="text-center mb-6">
                <span className="text-3xl font-extralight text-orange-400">Free</span>
              </div>

              <ul className="space-y-3 mb-8 font-light">
                {[
                  "Social media feeds (Facebook, Twitter, etc)",
                  "YouTube and video content scanning",
                  "News article verification",
                  "Web-based video calls",
                  "One-click reporting"
                ].map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-orange-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="https://chromewebstore.google.com/detail/lion-project-ai-detector/bgcjkaplennpginekckeaomkkidhifdg"
                className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-xl font-light hover:from-orange-400 hover:to-red-400 transition-all duration-300 shadow-lg shadow-orange-500/25"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="w-5 h-5 mr-2" />
                Install Extension
              </a>
            </div>

            {/* Mobile Protector - Coming Soon */}
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-8 opacity-75 hover:opacity-90 transition-all duration-500 shadow-lg shadow-orange-500/5">
              {/* Product Image */}
              <div className="h-48 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl overflow-hidden border border-orange-500/20 mb-6">
                <Image
                  src="/images/mobile-protector.png"
                  alt="Mobile Protector - Lion Project mobile app for phone protection (coming soon)"
                  width={400}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>

              <h3 className="text-2xl font-light mb-3 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                Mobile Protector
              </h3>
              <p className="text-gray-300 mb-4 font-light">Monitors apps and calls on your phone</p>

              <div className="text-center mb-6">
                <span className="text-3xl font-extralight text-orange-400">$2.99</span>
                <span className="text-sm text-gray-400 block font-light">/month</span>
              </div>

              <ul className="space-y-3 mb-8 font-light">
                {[
                  "TikTok, Instagram, Snapchat scanning",
                  "Phone call screening & analysis",
                  "WhatsApp & messaging apps",
                  "Mobile video calls (FaceTime, etc)",
                  "Real-time mobile alerts"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-4 h-4 text-orange-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className="flex items-center justify-center w-full bg-gray-600 text-gray-300 py-4 px-6 rounded-xl cursor-not-allowed border border-gray-500 font-light"
                disabled
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Coming Soon
              </button>

              <p className="text-xs text-gray-400 mt-4 text-center font-light">
                iOS & Android • Launching Q2 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gradient-to-b from-orange-500/5 to-transparent">
        <div className="container mx-auto px-6">
          <AudioTester />
        </div>
      </section>

      {/* Developers Section */}
      <section id="developers" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <Code className="w-12 h-12 text-orange-400 mr-4" />
                <h2 className="text-4xl lg:text-5xl font-extralight">
                  For <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Developers</span>
                </h2>
              </div>
              <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
                Integrate our powerful deepfake detection capabilities directly into your applications with our developer-friendly API.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Live API Demo */}
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 shadow-lg shadow-orange-500/5">
                <h3 className="text-2xl font-light text-orange-400 mb-4">Try the API Live</h3>
                <p className="text-gray-300 mb-6 font-light leading-relaxed">
                  Test our deepfake detection API directly in your browser. Upload audio files and see real-time results.
                </p>
                <a
                  href="https://huggingface.co/spaces/pauliano22/deepfake-audio-detector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-light hover:from-orange-400 hover:to-red-400 transition-all duration-300 shadow-lg shadow-orange-500/25"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Live API Demo
                </a>
              </div>

              {/* API Specs */}
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 shadow-lg shadow-orange-500/5">
                <h3 className="text-2xl font-light text-orange-400 mb-4">API Specifications</h3>
                <div className="space-y-3 font-light">
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
            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 mb-8 shadow-lg shadow-orange-500/5">
              <h3 className="text-2xl font-light text-orange-400 mb-6">Code Examples</h3>

              <div className="space-y-6">
                {/* Python Example */}
                <div>
                  <h4 className="font-light text-orange-400 mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Python
                  </h4>
                  <div className="bg-black/50 border border-gray-700/50 rounded-xl p-4 relative overflow-x-auto">
                    <button
                      onClick={() => navigator.clipboard.writeText(`from gradio_client import Client, handle_file

client = Client("pauliano22/deepfake-audio-detector")
result = client.predict(
    audio=handle_file('path/to/audio.wav'),
    api_name="/predict"
)
print(result)`)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-orange-400 transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-gray-300 text-sm leading-relaxed font-light whitespace-pre-wrap break-words">
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
                <div>
                  <h4 className="font-light text-orange-400 mb-3 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    JavaScript
                  </h4>
                  <div className="bg-black/50 border border-gray-700/50 rounded-xl p-4 relative overflow-x-auto">
                    <button
                      onClick={() => navigator.clipboard.writeText(`import { Client } from "@gradio/client";

const client = await Client.connect(
  "pauliano22/deepfake-audio-detector"
);
const result = await client.predict("/predict", { 
  audio: audioFile 
});
console.log(result.data);`)}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-orange-400 transition-colors"
                      title="Copy code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <pre className="text-gray-300 text-sm leading-relaxed font-light whitespace-pre-wrap break-words">
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
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 shadow-lg shadow-orange-500/5">
                <h4 className="font-light text-orange-400 mb-4">API Features</h4>
                <ul className="space-y-3">
                  {[
                    "Real-time audio deepfake detection",
                    "Multiple audio format support (WAV, MP3, M4A)",
                    "Confidence scoring and detailed analysis",
                    "RESTful API with JSON responses",
                    "Hosted on Hugging Face for reliability"
                  ].map((feature, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-center font-light">
                      <CheckCircle className="w-4 h-4 text-orange-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-6 shadow-lg shadow-orange-500/5">
                <h4 className="font-light text-orange-400 mb-4">Getting Started</h4>
                <ul className="space-y-3">
                  {[
                    "No API key required - free to use",
                    "Python, JavaScript, and cURL examples",
                    "Best results with 3-10 second audio clips",
                    "Clear speech recordings recommended",
                    "Gradio client libraries available"
                  ].map((feature, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-center font-light">
                      <CheckCircle className="w-4 h-4 text-orange-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <p className="text-gray-300 mb-6 font-light">
                Ready to integrate deepfake detection into your application?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://huggingface.co/spaces/pauliano22/deepfake-audio-detector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center border-2 border-orange-500 text-orange-400 px-6 py-3 rounded-xl font-light hover:bg-orange-500/10 transition-all duration-300"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Try Live Demo
                </a>
                <button
                  onClick={() => window.open('mailto:thelionprojectai@gmail.com?subject=API Integration Support', '_blank')}
                  className="inline-flex items-center bg-gray-700/50 text-white px-6 py-3 rounded-xl font-light hover:bg-gray-600/50 transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-orange-500/5 to-red-500/5 border border-orange-500/20 rounded-3xl p-8 shadow-lg shadow-orange-500/5">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <User className="w-8 h-8 text-orange-400" />
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <h4 className="text-2xl font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 mb-4">
                Built by a Cornell CS Student
              </h4>
              <p className="text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
                The Lion Project is a passion project created to help protect families from AI.<br /><br />
                I&apos;m constantly working to improve the accuracy and user experience. <br /><br />Your feedback
                helps make these tools better for everyone!
              </p>
            </div>

            <div className="max-w-md mx-auto">
              {feedbackSubmitted ? (
                <div className="text-center p-6 bg-green-900/20 border border-green-500/50 rounded-2xl">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 font-light">Thank you for your feedback!</p>
                  <p className="text-green-300 text-sm mt-1 font-light">Your input helps improve these tools.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-orange-400/60" />
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Share your thoughts, suggestions, or report issues..."
                      className="w-full bg-black/30 border border-orange-500/30 rounded-2xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none resize-none h-24 text-sm font-light"
                      maxLength={500}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-light">
                      {feedback.length}/500
                    </div>
                  </div>

                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={!feedback.trim() || isSubmittingFeedback}
                    className="w-full bg-gradient-to-r from-orange-500/80 to-red-500/80 hover:from-orange-500 hover:to-red-500 text-white font-light py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25"
                  >
                    {isSubmittingFeedback ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Feedback</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 font-light">
                  You can also reach out via email or social media for detailed discussions!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-500/20 py-12 bg-gradient-to-t from-orange-500/5 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-light text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Lion Project
            </span>
          </div>
          <p className="text-gray-300 mb-6 font-light leading-relaxed">
            Protecting families from AI deception. Specially designed for older adults and vulnerable populations.
          </p>
          <p className="text-sm text-gray-500 mb-6 font-light">
            Built with privacy and security in mind. Your data never leaves your device.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400 font-light">
            <span>&copy; 2025 Lion Project</span>
            <span>|</span>
            <a href="/privacy-policy" className="hover:text-orange-400 transition-colors">
              Privacy Policy
            </a>
            <span>|</span>
            <a href="/terms" className="hover:text-orange-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}