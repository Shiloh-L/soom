import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {ClerkProvider} from '@clerk/nextjs';
import {Toaster} from '@/components/ui/toaster';
import '@stream-io/video-react-sdk/dist/css/styles.css';

export const metadata: Metadata = {
  title: 'SOOM',
  description: 'Video calling app',
  icons: {
    icon: '/icons/logo.svg',
  },
};

const inter = Inter({subsets: ['latin']});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang='en'>
      <ClerkProvider appearance={{
        layout: {
          logoImageUrl: '/icons/logo.svg',
          socialButtonsPlacement: 'bottom',
        },
        variables: {
          colorText: '#fff',
          colorPrimary: '#0E78F9',
          colorBackground: '#1c1f2e',
          colorInputText: '#fff',
          colorInputBackground: '#252a41',
          colorNeutral: '#fff',
        },
      }}>
        <body className={`${inter.className} bg-dark-2`}>
        {children}
        <Toaster />
        </body>
      </ClerkProvider>
      </html>
  );
}
