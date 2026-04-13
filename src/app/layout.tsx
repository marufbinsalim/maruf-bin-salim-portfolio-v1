import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SmoothScrollProvider from "@/providers/SmoothScrollProvider";
import RouteTransitionProvider from "@/providers/RouteTransitionProvider";
import Navbar from "@/components/shared/navbar";
import { CursorEnhancerLayer, CursorEnhancerProvider } from "@/components/shared/cursorEnhancer";
import { CircleCursor, DotCursor } from "@/components/shared/cursorEnhancer/examples";

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
            <CursorEnhancerProvider>
              <CursorEnhancerLayer enhance={<CircleCursor size={15} color="black" backgroundColor="white" blendMode="difference" />}>
                <Navbar />
              </CursorEnhancerLayer>
              {children}
            </CursorEnhancerProvider>
          </RouteTransitionProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
