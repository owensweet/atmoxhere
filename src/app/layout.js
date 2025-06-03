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

  // const charLength = 2000;

  // const [chars, setChars] = useState('');

  // const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ'

  // useEffect(() => {
  //   const generateChars = () => {
  //     let result = '';
  //     for (let i = 0; i < charLength; i++)
  //     {
  //       result += matrixChars[Math.floor(Math.random() * matrixChars.length)];
  //     }
  //     return result;
  //   };

  //   setChars(generateChars());

  //   const interval = setInterval(() => {
  //     setChars(generateChars());
  //   }, 150);

  //   return () => clearInterval(interval);

  // }, []);

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
        className={kodeMono.className}
      >
        {/* add header code here instead perhaps */}
        {/* <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="w-full h-full text-green-400 opacity-35 text-xs leading-tight break-all whitespace-pre-wrap p-2">
            {chars}
          </div>
        </div> */}
        {children}
      </body>
    </html>
  );
}
