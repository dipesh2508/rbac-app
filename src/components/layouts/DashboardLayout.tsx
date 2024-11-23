 'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LuUsers, LuShieldCheck, LuLayoutDashboard, LuMenu } from "react-icons/lu";
import { useState } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LuLayoutDashboard,
  },
  {
    title: "Users",
    href: "/users",
    icon: LuUsers,
  },
  {
    title: "Roles",
    href: "/roles",
    icon: LuShieldCheck,
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white text-gray-900 shadow-soft transition-transform duration-200 ease-in-out lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary-500" />
              <span className="text-xl font-semibold text-gray-900">RBAC Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start space-x-3 px-3 py-6",
                    isActive && "bg-primary-50 text-primary-600",
                    !isActive && "hover:bg-gray-50 hover:text-gray-900"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-primary-500" : "text-gray-400"
                    )} />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center bg-white shadow-soft">
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <LuMenu className="h-6 w-6" />
            </Button>
            <div className="ml-4 font-semibold text-gray-900">
              {navItems.find((item) => item.href === pathname)?.title || "Dashboard"}
            </div>
            <div className="flex items-center space-x-4">
              {/* Add profile dropdown here if needed */}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-4rem)] bg-gray-50 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}