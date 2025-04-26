"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeaderJobSeekers from "@/components/Header/indexjobseekers";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { Roboto } from "next/font/google";
import { usePathname } from "next/navigation";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

import "../globals.css";
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
  display: 'swap',
});

import ToasterContext from "../context/ToastContext";
import { UserProvider } from "../context/UserContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isJobSeeker = pathname === "/jobseekers";
    // const stripePromise = loadStripe(data.publishableKey);


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`dark:bg-black ${roboto.variable} font-sans`}>
        <UserProvider>
          <div className="h-100vh">
          {/* <Elements stripe={stripePromise}> */}
            
          <ThemeProvider
              enableSystem={false}
              attribute="class"
              defaultTheme="light"
            >
              {!isJobSeeker && <Header />}
              {isJobSeeker && <HeaderJobSeekers />}
              <ToasterContext />
              <div>
                {children}
              </div>
              <Footer />
              <ScrollToTop />
            </ThemeProvider>
            {/* </Elements> */}
       </div>
       </UserProvider>
      </body>
    </html>
  );
}
