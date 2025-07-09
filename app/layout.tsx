import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QuoteProvider } from "@/contexts/QuoteContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shiv Watches - Wholesale Watch Accessories & Clocks',
  description: 'Your trusted wholesale partner for watches, clocks, and home appliances at competitive prices.',
  icons: {
    icon: "/images/fevicon.png",
  },
    keywords: [
   "wholesale watches",
 "watch accessories wholesale",
  "wall clocks wholesale",
   "wrist watches supplier",
    "table clocks wholesale",
     "Ajanta wall clocks",
      "ORPAT table clocks",
       "Seizaiken button batteries",
        "Bluetooth speakers wholesale",
         "home appliances wholesale", 
         "luxury watches India", 
         "silent wall clocks",
          "leather watch straps combo",
           "watch batteries in bulk", 
           "digital alarm clocks",
            "analog wrist watches",
             "clock repair Delhi",
              "clock repair pickup service", 
              "wholesale watches Delhi", 
              "wholesale clocks India",
               "Shiv Watches", 
               "trusted watch supplier India"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <QuoteProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster position="top-right" />
              <Analytics />
              <SpeedInsights />
            </QuoteProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}