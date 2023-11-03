import "@/styles/styles.css";
import "@rainbow-me/rainbowkit/styles.css";

import { useState } from "react";
import Head from "next/head";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps as NextAppProps } from "next/app";
import type { NextComponentType } from "next";

import LayoutApp from "@/components/Layout";

type AppProps<P = any> = NextAppProps & {
  pageProps: P;
  ColorScheme: ColorScheme;
  Component: NextComponentType & {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  };
} & Omit<NextAppProps<P>, "pageProps">;

export default function App({ Component, ColorScheme, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [colorScheme, setColorScheme] = useState<ColorScheme>(ColorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
  };

  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [publicProvider()],
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return (
    <MantineProvider theme={{ colorScheme }}>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>
          <Head>
            <title>Mantine next example</title>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
            />
            <link rel="shortcut icon" href="/favicon.svg" />
          </Head>

          <RainbowKitProvider chains={chains}>
            <ColorSchemeProvider
              colorScheme={colorScheme}
              toggleColorScheme={toggleColorScheme}
            >
              <LayoutApp>
                <Component {...pageProps} />
              </LayoutApp>
              <Notifications />
            </ColorSchemeProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </MantineProvider>
  );
}
