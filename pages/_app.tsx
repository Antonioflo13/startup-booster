import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@clayui/css/lib/css/atlas.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
