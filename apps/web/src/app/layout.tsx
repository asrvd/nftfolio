import "./globals.css";
import { TrpcProvider } from "@/src/utils/trpc/trpc-provider";
import { Toaster } from "react-hot-toast";
import NavBar from "../components/navbar";
import Footer from "../components/footer";
import { ThemeProvider } from "../components/theme-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        {/* tRPC provider */}
        <TrpcProvider> 
          {/* next-themes provider */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center bg-background">
              <NavBar />
              {children}
              <Footer />
              {/* react-hot-toast */}
              <Toaster
                position="top-center"
                gutter={8}
                toastOptions={{
                  duration: 5000,
                }}
              />
            </main>
          </ThemeProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
