"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Download, ExternalLink, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";

type Props = {
  previewUrl: string;
  productTitle: string;
  defaultExpanded?: boolean;
};

export function PdfSamplePreview({ previewUrl, productTitle, defaultExpanded = false }: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const baseViewerParams = "toolbar=0&navpanes=0&scrollbar=0&view=FitH";
  const collapsedSrc = `${previewUrl}#${baseViewerParams}&page=1`;
  const expandedSrc = `${previewUrl}#${baseViewerParams}`;

  function handlePrint() {
    const popup = window.open(previewUrl, "_blank", "noopener,noreferrer");
    if (!popup) return;

    // Print trigger can fail on some viewers; users can still print from the opened tab.
    popup.onload = () => {
      try {
        popup.focus();
        popup.print();
      } catch {
        // no-op
      }
    };
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-md">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 p-3">
        <a
          href={previewUrl}
          download
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "inline-flex gap-2")}
        >
          <Download className="size-4" aria-hidden />
          Download sample
        </a>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
          <Printer className="size-4" aria-hidden />
          Print
        </Button>
        <a
          href={previewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex gap-2")}
        >
          <ExternalLink className="size-4" aria-hidden />
          Open in new tab
        </a>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="ml-auto gap-2"
          aria-expanded={expanded}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <ChevronUp className="size-4" aria-hidden /> : <ChevronDown className="size-4" aria-hidden />}
          {expanded ? "Show less" : "Show more"}
        </Button>
      </div>

      <div
        className={cn(
          "relative overflow-hidden transition-[height] duration-300 motion-reduce:transition-none",
          expanded ? "h-[70vh] min-h-[520px]" : "h-[22rem] sm:h-[28rem]",
        )}
      >
        {!expanded ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-card via-card/80 to-transparent" />
        ) : null}
        <iframe
          title={`PDF preview - ${productTitle}`}
          src={expanded ? expandedSrc : collapsedSrc}
          className="h-full w-full bg-muted/30"
          loading="lazy"
        />
      </div>
    </div>
  );
}

export function PdfPreviewToolbar(props: Props) {
  return <PdfSamplePreview {...props} />;
}

export function PdfPreviewFrame(props: Props) {
  return <PdfSamplePreview {...props} />;
}
