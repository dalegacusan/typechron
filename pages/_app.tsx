import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import PageLayout from "../components/page-layout/page-layout";
import AuthUserProvider from "../providers/authUserProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider>
        <AuthUserProvider>
          <PageLayout>
            <Component {...pageProps} />
          </PageLayout>
        </AuthUserProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
