import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Itai Rotem | AI Engineer & Crypto Trader",
  description: "Building the Future - AI Engineer, Crypto Trader, and Web3 Builder. Explore my journey through the neural network of technology and finance.",
  keywords: ["AI Engineer", "Crypto Trader", "Web3", "Blockchain", "Machine Learning", "Full Stack Developer"],
  authors: [{ name: "Itai Rotem" }],
  openGraph: {
    title: "Itai Rotem | AI Engineer & Crypto Trader",
    description: "Building the Future - AI Engineer, Crypto Trader, and Web3 Builder.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Itai Rotem | AI Engineer & Crypto Trader",
    description: "Building the Future - AI Engineer, Crypto Trader, and Web3 Builder.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="antialiased">
        {children}
        {/* Noise overlay for texture */}
        <div className="noise-overlay" />
      </body>
    </html>
  );
}
