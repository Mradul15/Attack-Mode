import type { Metadata } from "next";
import AmbientBackgroundWrapper from "./components/global/ambient/AmbientBackgroundWrapper";
import PageTransitionWrapper from "./components/global/PageTransitionWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Attack Mode",
  description: "Incident management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AmbientBackgroundWrapper />
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
      </body>
    </html>
  );
}
