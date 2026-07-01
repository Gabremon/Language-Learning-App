import { Suspense } from "react";
import AuthPage from "./AuthPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <AuthPage />
    </Suspense>
  );
}
