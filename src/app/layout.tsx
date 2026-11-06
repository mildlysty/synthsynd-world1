import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.synthsyndworld.fun"),
  title: "Synthsynd World | The rails are live. Agents do the work.",
  description: "Discover, build and deploy AI agents, tools, prompts and skills on a unified creator marketplace.",
  
  // Open Graph (Facebook, Discord, iMessage, LinkedIn)
  openGraph: {
    title: "Synthsynd World | The rails are live. Agents do the work.",
    description: "Discover, build and deploy AI agents, tools, prompts and skills on a unified creator marketplace.",
    url: "https://www.synthsyndworld.fun",
    siteName: "Synthsynd World",
    images: [
      {
        url: "/og-image.png", 
        width: 1200,
        height: 630,
        alt: "Synthsynd World Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  
  // Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Synthsynd World | The rails are live. Agents do the work.",
    description: "Discover, build and deploy AI agents, tools, prompts and skills on a unified creator marketplace.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-[#030303]`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}