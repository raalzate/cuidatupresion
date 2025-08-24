// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="description" content="EduPrompt: App PWA educativa con LLM y prompt engineering." />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
