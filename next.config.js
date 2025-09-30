import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

const pwaConfig = {
  dest: "public",
  disable: false,
  skipWaiting: true,
};

export default withPWA(pwaConfig)(nextConfig);
