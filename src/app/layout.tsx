"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import RouteTransitionProvider from "@/providers/RouteTransitionProvider";
import Navbar from "@/components/shared/navbar";
import { CursorCircularTrail, CursorTrailArea, CursorTrailProvider } from "@/lib/cursor-trail-react";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScrollProvider>
          <RouteTransitionProvider>
            <CursorTrailProvider>
              <CursorTrailArea.div trail={<CursorCircularTrail color="black" backgroundColor="white" blendMode="difference" />}>
                <Navbar />
              </CursorTrailArea.div>
              {children}
            </CursorTrailProvider>
          </RouteTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
