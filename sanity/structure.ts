import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("PrepareUp")
    .items([
      S.listItem()
        .title("Catalog")
        .id("catalog")
        .child(
          S.list()
            .title("Catalog")
            .items([
              S.listItem()
                .title("Categories")
                .schemaType("category")
                .child(S.documentTypeList("category").title("Categories")),
              S.listItem()
                .title("Exams")
                .schemaType("exam")
                .child(S.documentTypeList("exam").title("Exams")),
              S.listItem()
                .title("PDF products")
                .schemaType("product")
                .child(S.documentTypeList("product").title("PDF products")),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title("Orders")
        .schemaType("order")
        .child(S.documentTypeList("order").title("Orders")),
    ]);
