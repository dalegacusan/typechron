import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import PageLayout from "../components/page-layout/page-layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </MantineProvider>
  );
}

export default MyApp;
