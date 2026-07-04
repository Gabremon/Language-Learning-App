"use client";

import { useEffect, useState } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/admin/status")
      .then((res) => (res.ok ? res.json() : { isAdmin: false }))
      .then((data: { isAdmin?: boolean }) => {
        if (!cancelled) {
          setIsAdmin(Boolean(data.isAdmin));
          setChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false);
          setChecked(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { isAdmin, checked };
}
