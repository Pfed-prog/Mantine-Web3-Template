import '@/styles/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import { useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LayoutApp from '@/components/Layout';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [queryClient] = useState(() => new QueryClient());
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
  };

  const { chains, publicClient } = configureChains(
    [mainnet, polygon, optimism, arbitrum],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
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
        <Hydrate state={pageProps.dehydratedState} />
        <WagmiConfig config={wagmiConfig}>
          <Head>
            <title>Mantine next example</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            <link rel="shortcut icon" href="/favicon.svg" />
          </Head>

          <RainbowKitProvider chains={chains}>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
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
