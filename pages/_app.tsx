import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
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
        <ModalsProvider>
          <AuthUserProvider>
            <PageLayout>
              <Component {...pageProps} />
            </PageLayout>
          </AuthUserProvider>
        </ModalsProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
