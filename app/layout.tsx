import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prox | Vulcan OmniPro 220 Expert",
  description: "Multimodal AI reasoning agent for the Vulcan OmniPro 220 welder.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
