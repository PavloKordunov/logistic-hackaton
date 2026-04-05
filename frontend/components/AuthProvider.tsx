"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token && pathname !== "/") {
      router.push("/");
    } else if (token && pathname === "/") {
      router.push("/dashboard");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
