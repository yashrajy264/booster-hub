import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { getSanityConfig } from "./env";

const { projectId, dataset } = getSanityConfig();

const builder =
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }) : null;

/** Build a Sanity image URL; returns null if unconfigured or missing source. */
export function urlForImage(source: SanityImageSource | null | undefined) {
  if (!builder || !source) return null;
  return builder.image(source);
}
