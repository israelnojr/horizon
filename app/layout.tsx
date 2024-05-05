import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({ subsets: ["latin"], weight: ['400', '700'], variable: '--font-ibm-plex-serif' });

export const metadata: Metadata = {
  title: `Online Business Banking For Startups & Personal Banking | ${process.env.APP_NAME}`,
  description: "Confidently perform all your financial operations with software built from a powerful online banking core. Scale with business bank accounts & debit, and credit cards.",
  icons:{
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${inter.variable} ${ibmPlexSerif.variable} `}>{children}</body>
    </html>
  );
}
