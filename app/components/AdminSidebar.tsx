"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  LogOut,
  Menu,
  X,
  Mail,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Leads",
    href: "/admin/leads",
    icon: Users,
  },
  {
    name: "Enquire Leads",
    href: "/admin/enquireLead",
    icon: Mail,
  },
  {
    name: "Property",
    href: "/admin/property",
    icon: Home,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("adminAuth");
    router.push("/login");
  };

  return (
    <>
      {/* ================= MOBILE TOP BAR ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <span className="font-extrabold text-xl tracking-wide">
            Admin Panel
          </span>

          <button
            onClick={() => setOpen((p) => !p)}
            className="p-2 rounded-lg hover:bg-white/20 transition"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`transition-all duration-300 overflow-hidden bg-white text-gray-800 ${
            open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="px-4 py-4 space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl transition text-lg font-semibold
                    ${
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-5 py-3 rounded-xl
              text-red-600 hover:bg-red-50 transition font-semibold text-lg"
            >
              <LogOut size={20} />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* ================= DESKTOP SIDEBAR ================= */}
{/* ================= DESKTOP SIDEBAR ================= */}
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:flex-col w-64 bg-white border-r shadow-lg z-40">
      {/* HEADER */}
      <div className="px-6 py-6 bg-gradient-to-r from-purple-600 to-indigo-500 text-white">
        <h2 className="text-2xl font-extrabold tracking-wide">Admin Panel</h2>
        <p className="text-sm mt-1 font-medium text-gray-200">
          Shivaksh Management
        </p>
      </div>

      {/* NAVIGATION (SCROLLABLE) */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 rounded-xl transition text-lg font-semibold
                ${
                  active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT (STICKY BOTTOM) */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3
          rounded-xl border text-red-600 font-semibold text-lg
          hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>

    </>
  );
}
