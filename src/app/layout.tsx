import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const noto = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Care Companion | ผู้ช่วยร่วมเดินทาง",
  description:
    "แพลตฟอร์มเชื่อมผู้ที่ต้องการผู้ช่วยร่วมเดินทางกับผู้ให้บริการอำนวยความสะดวกในการทำธุระ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${noto.variable} h-full`}>
      <body className={`${noto.className} flex min-h-full flex-col antialiased`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
