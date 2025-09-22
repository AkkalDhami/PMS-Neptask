"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function WaitingInvite() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Fetch user info (optional)
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin  w-12 h-12" />
          <p className=" text-lg">
            Loading your dashboard...
          </p>
        </div>
      ) : (
        <div className="max-w-xl bg-white dark:bg-slate-900 rounded-2xl p-10 shadow-lg flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Hello {userName || "there"}!
          </h1>
          <p className=" text-lg">
            You have successfully signed up as a{" "}
            <span className="font-semibold">Member</span>.
          </p>
          <p className="text-slate-500 dark:text-slate-400">
            You are currently waiting for an invitation from an organization to
            join. Once an admin sends you an invite, you’ll be able to access
            the workspace.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2">
              Refresh Status
            </Button>
            <Button
              variant="default">
              Need Help?
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
