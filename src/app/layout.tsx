import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prompt Overflow",
  description: "A hacker-themed prompt engineering game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="scanlines"></div>
        <nav className="global-nav">
          <div className="nav-container">
            <Link href="/" className="nav-logo">
              <span className="blink-cursor">SYS_ROOT:/home/</span>
            </Link>
            <div className="nav-links">
              <Link href="/attack" className="nav-link">[ ATTACK ]</Link>
              <Link href="/defend" className="nav-link">[ DEFEND ]</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
