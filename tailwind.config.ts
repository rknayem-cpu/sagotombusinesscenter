/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Eta true thakle deploy-er somoy ESLint error thakleo build hobe
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript error thakleo build ignore korbe (jodi dorkar hoy)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
