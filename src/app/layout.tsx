import type { ReactNode } from "react";

/** Root shell — locale-specific `<html lang>` lives in `[locale]/layout`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
