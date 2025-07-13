/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this block to configure ESLint
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. It's recommended to run ESLint
    // as a separate step in your CI/CD pipeline.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
