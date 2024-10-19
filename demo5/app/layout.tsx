import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./custom.css";
import Header from "./components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title:
    "Securing the realm and autonomous adventure: DM-less D&D with Azure AI",
  description:
    "Explore autonomous adventures and secure campaigns with Azure AI, enabling DM-less Dungeons & Dragons (D&D) experiences. Harness AI-powered storytelling for seamless roleplaying, dynamic encounters, and immersive gameplay without a dungeon master.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen bg-parchment flex items-center justify-center p-4`}
      >
        <div className="w-full max-w-7xl medieval-container shadow-2xl flex flex-col h-full">
          <Header />
          <div className="flex-grow overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
