/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Handle WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle ONNX Runtime Web
    if (!isServer) {
      // Client-side: externalize ONNX runtime to avoid bundling issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      
      // Don't bundle ONNX WASM files
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
      });
      
      // Ignore ONNX WASM imports that cause issues
      config.module.rules.push({
        test: /onnxruntime-web/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      });
    }

    // Server-side: externalize onnxruntime to prevent bundling
    if (isServer) {
      config.externals.push('onnxruntime-node', 'onnxruntime-web');
    }

    return config;
  },
  // Handle static files
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
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
};

export default nextConfig;