import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Fix for ONNX.js WebAssembly files
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Handle .wasm files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Add rule for .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Fix for ONNX.js in server-side rendering
    if (isServer) {
      config.externals.push('onnxruntime-web');
    }

    return config;
  },
  // Serve WASM files with correct MIME type
  async headers() {
    return [
      {
        source: '/(.*\\.wasm)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
        ],
      },
    ];
  },
};

export default nextConfig;