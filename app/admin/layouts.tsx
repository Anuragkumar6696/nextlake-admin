"use client";

import { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* MOBILE TOP BAR SPACER */}
        <div className="md:hidden h-16" />

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
