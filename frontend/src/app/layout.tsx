// src/app/layout.tsx
'use client'; // Mark as client component

import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import './globals.css';
import { usePathname } from 'next/navigation';  // Import usePathname

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current pathname
  const noSidebarRoutes = ['/login', '/signin']; // Define routes without sidebar

  const showSidebar = !noSidebarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={showSidebar ? 'with-sidebar' : ''}>  {/* Apply class conditionally */}
        <UserProvider>
          <SidebarProvider>
            {showSidebar && <AppSidebar />}
            <main className="main-content">
              {showSidebar && <SidebarTrigger />}
              {children}
            </main>
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}
