import "@/styles/globals.css";

import { type Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Intania Room Booking",
  description: "Intania Room Booking by ESC",
  icons: [{ rel: "icon", url: "/logo.svg", type: "image/svg+xml" }],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${plexThai.variable} h-full antialiased`}>
      <body className="min-h-full">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
