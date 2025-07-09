"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/login');
    }, [router]);

    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
}
