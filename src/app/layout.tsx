import type { Metadata } from "next";
import "@/app/globals.css";
import ToastProvider from "@/components/utils/toast-provider";

import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Calipso | Dashboard",
  description: "Le Dashboard de Calipso",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`${inter.className} light`}>
	<head>
		<link rel="stylesheet" href="https://kit.fontawesome.com/a31e608af5.css" crossOrigin="anonymous" />
	</head>
      <body>
	  	<ToastProvider />
        {children}
      </body>
    </html>
  );
}
