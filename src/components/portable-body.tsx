import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="my-3 first:mt-0">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-8 font-heading text-xl font-medium tracking-tight first:mt-0">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 font-heading text-lg font-medium tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-foreground/20 pl-4 text-muted-foreground">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 list-disc space-y-1 pl-5">{children}</ul>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
};

export function PortableBody({ value }: { value: unknown }) {
  if (!value || !Array.isArray(value)) return null;
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-foreground">
      <PortableText value={value as never} components={components} />
    </div>
  );
}
