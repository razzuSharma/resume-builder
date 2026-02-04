import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./navbar/page";
import { Providers } from "./redux/provider";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Artisan - Build Professional Resumes",
  description: "Create stunning professional resumes with ease using Resume Artisan",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
