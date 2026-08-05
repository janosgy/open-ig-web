import { setRequestLocale } from "next-intl/server";
import { BridgeShell } from "@/components/BridgeShell";
import { getLandingContent } from "@/lib/content";
import type { Locale } from "@/i18n/routing";

/**
 * Shared bridge chrome (status bar, content frame, communicator).
 * Section pages render as children inside the content panel.
 */
export default async function BridgeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getLandingContent(locale as Locale);

  return (
    <main className="h-dvh max-w-full overflow-hidden">
      <BridgeShell content={content}>{children}</BridgeShell>
    </main>
  );
}
