import { Kode_Mono } from 'next/font/google';
import './globals.css';
import ClientWrapper from '@/app/ClientWrapper';
import Footer from '@/lib/components/Footer';
import Image from 'next/image';

const kodeMono = Kode_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* You can add additional head content here if needed */}
      </head>
      <body className={`${kodeMono.className} crt overflow-x-hidden overscroll-none min-h-screen flex flex-col`}>
        {/* fix background below content */}
        <div
          className="fixed inset-0 -z-10 bg-cover"
          style={{ backgroundImage: 'url("/grain.jpg")' }}
        />
        {/* Main area grows to fill remaining space */}
        <main className="flex-grow">
          <ClientWrapper>{children}</ClientWrapper>
        </main>
        {/* Footer sits flush */}
        <Footer />
      </body>
    </html>
  );
}