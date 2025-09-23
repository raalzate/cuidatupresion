import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: "public",
  disable: false,
  skipWaiting: true,
})(nextConfig);
