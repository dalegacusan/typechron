import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import PageLayout from "../components/page-layout/page-layout";
import AuthUserProvider from "../providers/authUserProvider";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Typechron</title>
        <meta name="title" content="Typechron" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="A fast-paced single player game where you type as many words as you can within 10 seconds."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://typechron.vercel.app/" />
        <meta property="og:title" content="Typechron" />
        <meta
          property="og:description"
          content="A fast-paced single player game where you type as many words as you can within 10 seconds."
        />
        <meta property="og:image" content="/typechron-banner.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://typechron.vercel.app/" />
        <meta property="twitter:title" content="Typechron" />
        <meta
          property="twitter:description"
          content="A fast-paced single player game where you type as many words as you can within 10 seconds."
        />
        <meta property="twitter:image" content="/typechron-banner.png" />

        <link rel="shortcut icon" href="/typechron-icon.png" />
      </Head>
      <MantineProvider
        theme={{ colorScheme: "dark" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider>
          <ModalsProvider>
            <AuthUserProvider>
              <PageLayout>
                <Component {...pageProps} />
              </PageLayout>
            </AuthUserProvider>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
