// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === 'development', 
  skipWaiting: true
});

module.exports = withPWA({
  reactStrictMode: true
});
