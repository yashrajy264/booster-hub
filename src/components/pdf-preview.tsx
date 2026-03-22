"use client";

import { useState } from "react";
import { ExternalLink, Maximize2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = {
  previewUrl: string;
  productTitle: string;
};

export function PdfPreviewToolbar({ previewUrl, productTitle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Maximize2 className="size-4" aria-hidden />
        Full screen
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[95vh] max-w-[95vw] flex-col gap-0 p-0 sm:max-w-[95vw]">
          <DialogHeader className="sr-only">
            <DialogTitle>Preview: {productTitle}</DialogTitle>
          </DialogHeader>
          <iframe
            title={`PDF preview — ${productTitle}`}
            src={`${previewUrl}#view=FitH`}
            className="min-h-[80vh] w-full flex-1 rounded-b-lg border-0 bg-muted/20"
          />
        </DialogContent>
      </Dialog>
      <a
        href={previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex gap-2")}
      >
        <ExternalLink className="size-4" aria-hidden />
        Open in new tab
      </a>
    </div>
  );
}

export function PdfPreviewFrame({
  previewUrl,
  productTitle,
  className,
}: Props & { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card shadow-md",
        className,
      )}
    >
      <iframe
        title={`PDF preview — ${productTitle}`}
        src={`${previewUrl}#view=FitH`}
        className="aspect-[3/4] min-h-[min(70vh,520px)] w-full bg-muted/30"
        loading="lazy"
      />
    </div>
  );
}
