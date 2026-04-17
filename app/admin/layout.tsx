"use client";

import { ReactNode } from "react";
import AdminSidebar from "../components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* CONTENT */}
      <div className="flex-1 md:ml-64 p-6 bg-gray-50 min-h-screen">
        {children}
      </div>

    </div>
  );
}