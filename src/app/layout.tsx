import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/theme/themeProvider";
import { ThemeToggle } from "@/theme/themeToggle";
import Providers from "./providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Where to Watch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
          <main className="relative flex min-h-screen flex-col items-center bg-white dark:bg-gray-950">
            <div className="mt-4 px-4 left-0 flex items-center justify-between gap-4 w-full">
              <Link href="/">
                <div className="cursor-pointer w-fit">
                  <Image
                    priority
                    width={470 / 1.5}
                    height={86 / 1.5}
                    src="/logo.png"
                    alt="logo"
                  />
                </div>
              </Link>
              <ThemeToggle />
            </div>
            <div className="w-full max-w-5xl flex flex-col items-center justify-center">
              <Providers>{children}</Providers>
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
