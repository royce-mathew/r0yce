import {
  ComputedFields,
  defineDocumentType,
  defineNestedType,
  DocumentType,
  LocalDocument,
  makeSource,
} from "contentlayer2/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode, { LineElement } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const computedFields: ComputedFields = {
  slug: {
    type: "string",
    resolve: (doc: LocalDocument) => `/${doc._raw.flattenedPath}`,
  },
  slugAsParams: {
    type: "string",
    resolve: (doc: LocalDocument) =>
      doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

const Label = defineNestedType(() => ({
  name: "Label",
  fields: {
    text: {
      type: "string",
      description: "The text of the label",
      required: true,
    },
    className: {
      type: "string",
      description: "Tailwind classes to add to the label",
      required: false,
    },
  },
}));

export const Project: DocumentType = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the Project",
      required: true,
    },
    date: {
      type: "date",
      description: "Last Modified Date",
      required: false,
    },
    description: {
      type: "string",
      description: "The description of the Project",
      required: true,
    },
    label: {
      type: "nested",
      of: Label,
      required: false,
    },
    toc: {
      type: "boolean",
      description: "Enable Table of Contents",
      required: false,
    },
    imageSrc: {
      type: "string",
      description: "Source URL of the image",
      required: false,
    },
    important: {
      type: "boolean",
      description: "Whether to give the project more space",
      required: false,
    },
  },
  computedFields: computedFields,
}));

export const Base: DocumentType = defineDocumentType(() => ({
  name: "Base",
  filePathPattern: `main/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the File",
      required: true,
    },
    date: {
      type: "date",
      description: "Last Modified Date",
      required: false,
    },
  },
}));

export default makeSource({
  contentDirPath: "./src/content",
  documentTypes: [Project, Base],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "one-dark-pro",
          onVisitLine(node: LineElement) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node: LineElement) {
            node.properties.className?.push("line--highlighted");
          },
          onVisitHighlightedWord(node: LineElement) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
    ],
  },
});
