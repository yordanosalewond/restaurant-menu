import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
type AppLayoutProps = {
  children: React.ReactNode;
};
export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Toaster richColors position="top-center" />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}