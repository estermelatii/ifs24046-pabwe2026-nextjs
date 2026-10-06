"use client";

import LostFoundLayout from "@/features/lostFounds/layouts/LostFoundLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LostFoundLayout>{children}</LostFoundLayout>;
}
