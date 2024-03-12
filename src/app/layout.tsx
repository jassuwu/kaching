import type { Metadata } from "next";
import { Georama, Lato } from "next/font/google";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { config } from "@/config";
import { headers } from "next/headers";
import Web3ModalProvider from "@/context";

const georama = Georama({ subsets: ["latin"], variable: "--font-georama" });
const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "kaching",
  description: "Crypto payment gateway prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={`${georama.variable} ${lato.variable} font-lato`}>
        <Web3ModalProvider initialState={initialState}>
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  );
}
