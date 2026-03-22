import { redirect } from "next/navigation";

/** Canonical catalog URL is `/browse`; keep `/catalog` as a stable alias for links and SEO. */
export default function CatalogAliasPage() {
  redirect("/browse");
}
