import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "boosterhub",
  title: "BoosterHub CMS",
  projectId: projectId || "missing-project-id",
  dataset,
  basePath: "/",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
