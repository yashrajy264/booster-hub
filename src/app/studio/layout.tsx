import { NextStudioLayout } from "next-sanity/studio";
import type { ReactNode } from "react";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div data-sanity-studio-root className="min-h-0 min-w-0 flex-1">
      <NextStudioLayout>{children}</NextStudioLayout>
    </div>
  );
}
