import type { Metadata } from "next";
import { Georama, Lato } from "next/font/google";
import "./globals.css";

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
  return (
    <html lang="en">
      <body className={`${georama.variable} ${lato.variable} font-lato`}>
        {children}
      </body>
    </html>
  );
}
