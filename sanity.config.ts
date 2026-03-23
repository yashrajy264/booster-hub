import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { ResendOrderEmailAction } from "./sanity/actions/resend-order-email";
import { schemaTypes } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "prepareup",
  title: "PrepareUp CMS",
  projectId: projectId || "missing-project-id",
  dataset,
  basePath: "/studio",
  plugins: [structureTool({ structure }), visionTool()],
  document: {
    actions: (prev, context) =>
      context.schemaType === "order" ? [ResendOrderEmailAction, ...prev] : prev,
  },
  schema: {
    types: schemaTypes,
  },
});
