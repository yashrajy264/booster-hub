import { createClient, type ClientConfig, type SanityClient } from "next-sanity";
import { getSanityConfig } from "./env";

const apiVersion = "2024-01-01";

export function getPublicSanityClient(): SanityClient | null {
  const { projectId, dataset, isConfigured } = getSanityConfig();
  if (!isConfigured || !projectId) {
    return null;
  }
  const config: ClientConfig = {
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
  };
  return createClient(config);
}
