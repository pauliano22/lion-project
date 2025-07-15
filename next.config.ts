/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    // Handle WebAssembly files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    // Exclude ONNX WebAssembly files from being parsed as JS
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    });

    // Ignore ONNX Runtime WebAssembly files during bundling
    config.module.rules.push({
      test: /onnxruntime-web.*\.wasm$/,
      type: 'asset/resource',
    });

    // Don't try to parse .wasm files
    config.module.noParse = [
      ...(config.module.noParse || []),
      /\.wasm$/,
    ];

    // Client-side: prevent bundling of server-only packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },
  // Don't try to optimize WASM files
  images: {
    unoptimized: true,
  },
};

export default nextConfig;