import { Suspense } from "react";
import { APP_MARK } from "@/lib/brand";
import AuthPage from "./AuthPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-paper">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-200 bg-white text-xl font-bold text-brand-700 shadow-sm">
              {APP_MARK}
            </div>
            <p className="text-sm text-stone-500">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthPage />
    </Suspense>
  );
}
