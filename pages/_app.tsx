import "@/styles/globals.css";
import "@photo-sphere-viewer/core/index.css";
import localFont from "next/font/local";
import type { AppProps } from "next/app";

const daxRegularFont = localFont({
  src: "./fonts/dax-regular.ttf",
  variable: "--font-dax-regular",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={daxRegularFont.variable}>
      <Component {...pageProps} />
    </main>
  );
}
