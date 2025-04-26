"use client";

import { Suspense, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard/Dashboard";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { requireEmployerAccess } from "@/utils/authUtils";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    requireEmployerAccess(router);
  }, [router]);

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13B5CF]"></div>
      </div>
    }>
      <Dashboard />
    </Suspense>
  );
}
