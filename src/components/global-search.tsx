"use client";

import Image from "next/image";
import Link from "next/link";
import { FolderOpen, GraduationCap, Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { CatalogProductItem } from "@/components/catalog-product-card";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

type SearchCategoryHit = {
  _id: string;
  title: string;
  slug?: string | null;
  coverImage?: SanityImageSource | null;
};

type SearchExamHit = {
  _id: string;
  title: string;
  slug?: string | null;
  categorySlug?: string | null;
  categoryTitle: string | null;
  logoImage?: SanityImageSource | null;
  coverImage?: SanityImageSource | null;
};

type SearchResponse = {
  categories?: SearchCategoryHit[];
  exams?: SearchExamHit[];
  products?: CatalogProductItem[];
  error?: string;
};

function thumb(cover: SanityImageSource | null | undefined) {
  if (!cover) return null;
  return urlForImage(cover)?.width(120).height(80).fit("crop").auto("format").url() ?? null;
}

const emptyPayload = {
  categories: [] as SearchCategoryHit[],
  exams: [] as SearchExamHit[],
  products: [] as CatalogProductItem[],
};

/** Matches site header / icon stroke (thin, consistent UI) */
const ICON_STROKE = 1.25;

export function GlobalSearch({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState(emptyPayload);
  const [error, setError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (query: string) => {
    const t = query.trim();
    if (t.length < 2) {
      setPayload(emptyPayload);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(t)}`);
      const data = (await res.json()) as SearchResponse;
      if (!res.ok) {
        setError(data.error ?? "Search failed");
        setPayload(emptyPayload);
        return;
      }
      setPayload({
        categories: data.categories ?? [],
        exams: data.exams ?? [],
        products: data.products ?? [],
      });
    } catch {
      setError("Search failed");
      setPayload(emptyPayload);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void runSearch(q);
    }, 320);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, runSearch]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const isDark = variant === "dark";
  const totalHits =
    payload.categories.length + payload.exams.length + payload.products.length;

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <label htmlFor={id} className="sr-only">
        Search PDF packs
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border px-4 py-2.5 shadow-sm transition-colors",
          isDark
            ? "border-zinc-700 bg-zinc-900/80 focus-within:border-emerald-500/50"
            : "border-border bg-background/90 focus-within:border-primary/40",
        )}
      >
        <Search
          className={cn("size-5 shrink-0", isDark ? "text-zinc-500" : "text-muted-foreground")}
          strokeWidth={ICON_STROKE}
          aria-hidden
        />
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="search"
          enterKeyHint="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search packs, exams, categories…"
          autoComplete="off"
          className={cn(
            "min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground",
            isDark ? "text-zinc-100 placeholder:text-zinc-500" : "text-foreground",
          )}
          role="combobox"
          aria-expanded={open && q.trim().length >= 2}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
        />
        {q.length > 0 ? (
          <button
            type="button"
            aria-label="Clear search"
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
              isDark ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            onClick={() => {
              setQ("");
              setOpen(false);
              inputRef.current?.focus();
            }}
          >
            <X className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
          </button>
        ) : null}
        {loading ? (
          <Loader2 className={cn("size-4 shrink-0 animate-spin", isDark ? "text-emerald-400" : "text-primary")} />
        ) : null}
      </div>

      {open && q.trim().length >= 2 ? (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-2 max-h-[min(70vh,28rem)] overflow-y-auto rounded-2xl border shadow-xl",
            isDark
              ? "border-zinc-700 bg-zinc-950/95 backdrop-blur-xl"
              : "border-border bg-popover text-popover-foreground",
          )}
        >
          {error ? (
            <p className="px-4 py-6 text-sm text-destructive">{error}</p>
          ) : totalHits === 0 && !loading ? (
            <p className={cn("px-4 py-8 text-center text-sm", isDark ? "text-zinc-400" : "text-muted-foreground")}>
              No categories, exams, or PDF packs match that search.
            </p>
          ) : (
            <div className={cn("divide-y py-1", isDark ? "divide-zinc-800" : "divide-border/60")}>
              {payload.categories.length > 0 ? (
                <div className="px-1 pb-1">
                  <p
                    className={cn(
                      "px-3 pb-2 pt-2 text-xs font-medium uppercase tracking-wide",
                      isDark ? "text-zinc-500" : "text-muted-foreground",
                    )}
                  >
                    Categories
                  </p>
                  <ul className="space-y-0.5">
                    {payload.categories
                      .filter((c) => Boolean(c.slug))
                      .map((c) => {
                      const href = `/${c.slug}`;
                      const img = thumb(c.coverImage ?? undefined);
                      return (
                        <li key={c._id} role="option">
                          <Link
                            href={href}
                            className={cn(
                              "flex gap-3 rounded-xl px-3 py-2.5 transition-colors",
                              isDark ? "hover:bg-zinc-800/80" : "hover:bg-accent",
                            )}
                            onClick={() => setOpen(false)}
                          >
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                              {img ? (
                                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                              ) : (
                                <span className="flex h-full items-center justify-center">
                                  <FolderOpen
                                    className={cn("size-6", isDark ? "text-zinc-600" : "text-primary/35")}
                                    aria-hidden
                                  />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className={cn(
                                  "text-xs font-medium uppercase tracking-wide",
                                  isDark ? "text-zinc-500" : "text-muted-foreground",
                                )}
                              >
                                Category
                              </p>
                              <p
                                className={cn("font-medium leading-snug", isDark ? "text-zinc-100" : "text-foreground")}
                              >
                                {c.title}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {payload.exams.length > 0 ? (
                <div className="px-1 pb-1">
                  <p
                    className={cn(
                      "px-3 pb-2 pt-2 text-xs font-medium uppercase tracking-wide",
                      isDark ? "text-zinc-500" : "text-muted-foreground",
                    )}
                  >
                    Exams
                  </p>
                  <ul className="space-y-0.5">
                    {payload.exams
                      .filter((e) => Boolean(e.slug) && Boolean(e.categorySlug))
                      .map((e) => {
                      const href = `/${e.categorySlug}/${e.slug}`;
                      const img = thumb(e.logoImage ?? e.coverImage ?? undefined);
                      const meta = e.categoryTitle ?? "";
                      return (
                        <li key={e._id} role="option">
                          <Link
                            href={href}
                            className={cn(
                              "flex gap-3 rounded-xl px-3 py-2.5 transition-colors",
                              isDark ? "hover:bg-zinc-800/80" : "hover:bg-accent",
                            )}
                            onClick={() => setOpen(false)}
                          >
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                              {img ? (
                                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                              ) : (
                                <span className="flex h-full items-center justify-center">
                                  <GraduationCap
                                    className={cn("size-6", isDark ? "text-zinc-600" : "text-primary/35")}
                                    aria-hidden
                                  />
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              {meta ? (
                                <p
                                  className={cn(
                                    "text-xs font-medium uppercase tracking-wide",
                                    isDark ? "text-zinc-500" : "text-muted-foreground",
                                  )}
                                >
                                  {meta}
                                </p>
                              ) : null}
                              <p
                                className={cn("font-medium leading-snug", isDark ? "text-zinc-100" : "text-foreground")}
                              >
                                {e.title}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              {payload.products.length > 0 ? (
                <div className="px-1 pb-1">
                  <p
                    className={cn(
                      "px-3 pb-2 pt-2 text-xs font-medium uppercase tracking-wide",
                      isDark ? "text-zinc-500" : "text-muted-foreground",
                    )}
                  >
                    PDF packs
                  </p>
                  <ul className="space-y-0.5">
                    {payload.products.map((p) => {
                      const href =
                        p.categorySlug && p.examSlug
                          ? `/${p.categorySlug}/${p.examSlug}/${p.slug}`
                          : `/p/${p.slug}`;
                      const img = thumb(p.coverImage ?? undefined);
                      const meta =
                        p.categoryTitle && p.examTitle
                          ? `${p.categoryTitle} · ${p.examTitle}`
                          : p.examTitle || p.categoryTitle || "";
                      return (
                        <li key={p._id} role="option">
                          <Link
                            href={href}
                            className={cn(
                              "flex gap-3 rounded-xl px-3 py-2.5 transition-colors",
                              isDark ? "hover:bg-zinc-800/80" : "hover:bg-accent",
                            )}
                            onClick={() => setOpen(false)}
                          >
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                              {img ? (
                                <Image src={img} alt="" fill className="object-cover" sizes="56px" />
                              ) : (
                                <span className="flex h-full items-center justify-center font-heading text-xs text-primary/40">
                                  PDF
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              {meta ? (
                                <p
                                  className={cn(
                                    "text-xs font-medium uppercase tracking-wide",
                                    isDark ? "text-zinc-500" : "text-muted-foreground",
                                  )}
                                >
                                  {meta}
                                </p>
                              ) : null}
                              <p
                                className={cn("font-medium leading-snug", isDark ? "text-zinc-100" : "text-foreground")}
                              >
                                {p.title}
                              </p>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
