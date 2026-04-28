import { Kode_Mono } from 'next/font/google';
import './globals.css';
import ClientWrapper from '@/app/ClientWrapper';
import Footer from '@/lib/components/Footer';
import Image from 'next/image';
import Script from 'next/script';

const kodeMono = Kode_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata = {
  title: "Atmoxhere",
  description: "Website for Atmoxhere",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="darkreader-lock" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
	    />
      {/* Google Analytics Scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S2E36N7VVC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S2E36N7VVC');
          `}
        </Script>
      </head>
      
      <body className={`${kodeMono.className} crt overflow-x-hidden overscroll-none min-h-screen flex flex-col`}>
        <div className="scanlines"></div>
        <main className="flex-grow"> {/*dont know what flew-grow is for and if it works with the footer properly */}
          <ClientWrapper>{children}<div className="h-152 pointer-events-none z-0" /></ClientWrapper>
          
        </main>
        <Footer />
        <div className="scanlines2"></div>
      </body>
    </html>
  );
}