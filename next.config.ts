// next.config.ts - Fixed for audio processing and WASM support
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Add WASM support for Essentia.js and other audio libraries
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    
    // Handle WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    // Handle audio files
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|flac|m4a)$/,
      type: 'asset/resource',
    });

    // Resolve fallbacks for Node.js modules in browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        events: false,
        net: false,
        dns: false,
        tls: false,
        assert: false,
      };
    }

    // Handle CommonJS modules
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    };

    return config;
  },
  
  // Required for modern JavaScript features and WASM
  experimental: {
    esmExternals: true,
  },
  
  // Moved from experimental (Next.js 15+ change)
  serverExternalPackages: ['essentia.js'],

  // Enable static file serving for models
  async headers() {
    return [
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },

  // Optimize for audio processing
  poweredByHeader: false,
  compress: true,
  
  // Handle ONNX and WASM files in public directory
  async rewrites() {
    return [
      {
        source: '/models/:path*',
        destination: '/models/:path*',
      },
    ];
  },
};

export default nextConfig;