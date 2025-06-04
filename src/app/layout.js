import { Kode_Mono } from 'next/font/google';
import "./globals.css";

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
	  </head>
      <body
        className={kodeMono.className + " crt"}
      >
        <div className="scanlines"></div>
        {/* add header code here instead perhaps */}
        {children}
        <div className="scanlines2"></div>
      </body>
    </html>
  );
}
