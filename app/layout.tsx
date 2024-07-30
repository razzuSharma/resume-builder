import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./navbar/page";
import { Providers } from "./redux/provider";
import Footer from "./components/Footer";
import { PDFViewer } from "@react-pdf/renderer";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Artisan",
  description: "Created via NextJS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PDFViewer>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </PDFViewer>
      </body>
    </html>
  );
}
