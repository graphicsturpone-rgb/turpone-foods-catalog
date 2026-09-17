import type { Metadata } from "next";
import { Poppins, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Turpone Foods",
  description: "Turpone Foods Catalog",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <Script src="https://unpkg.com/aos@2.3.1/dist/aos.js" strategy="afterInteractive" />
        <Script id="aos-init" strategy="lazyOnload">
          {`
            document.querySelectorAll("section, .elementor-section, .elementor-container, .e-con-boxed, .e-con-full").forEach(function(el) {
              el.setAttribute("data-aos", "fade-up");
            });
            setTimeout(function() {
              if (window.AOS) {
                window.AOS.init({ once: true, offset: 50, duration: 1500, easing: 'ease-out-cubic' });
              }
            }, 500);
          `}
        </Script>
      </body>
    </html>
  );
}
