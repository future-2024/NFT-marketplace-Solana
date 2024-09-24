// src/app/layout.tsx

import './globals.css';
import { ThemeProvider } from './context/ThemeContext';
import NavBar from './components/Navbar';
import { Inter as FontSans, Old_Standard_TT as FontSerif } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from './Providers';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "700"], // Specify the weights for Inter
});

const fontSerif = FontSerif({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"], // Specify the weights for Old Standard TT
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSerif.variable}>
      <body className={cn("min-h-screen bg-background font-serif antialiased")}>
        <Providers>
          <ThemeProvider>
            <NavBar />
            <main className="content-with-navbar-padding">
              {children}
            </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
