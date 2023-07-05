import { AppShell } from '@mantine/core';
import React from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: JSX.Element;
}

const LayoutApp = ({ children }: LayoutProps) => {
  const links = [{ label: 'Home', link: '/' }];
  return (
    <AppShell
      header={<Navbar links={links} />}
      styles={{
        main: {
          paddingTop: 0,
          paddingRight: 0,
          paddingLeft: 0,
          paddingBottom: 0,
          minHeight: 0,
        },
      }}
    >
      {children}
    </AppShell>
  );
};

export default LayoutApp;
