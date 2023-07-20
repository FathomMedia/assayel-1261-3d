import "@/styles/globals.css";
import "@photo-sphere-viewer/core/index.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
