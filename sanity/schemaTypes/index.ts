import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./blockContent";
import { category } from "./category";
import { exam } from "./exam";
import { order } from "./order";
import { product } from "./product";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContent,
  category,
  exam,
  product,
  order,
];
