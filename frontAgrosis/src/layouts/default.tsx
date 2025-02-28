import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Header } from "@/components/Header";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="relative flex h-screen">
      <Navbar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-col flex-grow transition-all duration-300" style={{ marginLeft: isSidebarOpen ? "250px" : "70px" }}>
        <Header isSidebarOpen={isSidebarOpen} />
        <main className="container mx-auto max-w-7xl px-6 flex-grow pt-20">{children}</main>
      </div>
    </div>
  );
}
