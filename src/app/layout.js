import { Kode_Mono } from 'next/font/google';
import "./globals.css";
import ClientWrapper from "@/app/ClientWrapper";
import Footer from "@/lib/components/Footer"; 
import Image from "next/image";

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
      <body className={kodeMono.className}>
        <div>
          <div style={{ 
            backgroundImage: 'url("/grain.jpg")', 
            backgroundSize: 'cover',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}></div>
          
          <ClientWrapper>
            {/* add header code here instead perhaps */}
            {children}
            <Footer /> {/* Add this line */}
          </ClientWrapper>
        </div>
      </body>
    </html>
  );
}

