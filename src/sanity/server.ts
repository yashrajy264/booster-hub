import { createClient, type ClientConfig, type SanityClient } from "next-sanity";
import { getSanityConfig } from "./env";

const apiVersion = "2024-01-01";

/** Read-only server client (token optional for public dataset reads). */
export function getServerSanityClient(): SanityClient | null {
  const { projectId, dataset, isConfigured } = getSanityConfig();
  if (!isConfigured || !projectId) {
    return null;
  }
  const config: ClientConfig = {
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_READ_TOKEN,
    perspective: "published",
  };
  return createClient(config);
}

/** Mutations — orders, webhooks. Requires SANITY_API_WRITE_TOKEN. */
export function getWriteSanityClient(): SanityClient | null {
  const { projectId, dataset, isConfigured } = getSanityConfig();
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!isConfigured || !projectId || !token) {
    return null;
  }
  const config: ClientConfig = {
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  };
  return createClient(config);
}
