// 1. Import utilities from `astro:content`
import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";

// 2. Define your collection(s)
const blogCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    title: z.string(),
    snippet: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.string().transform((str) => new Date(str)),
    author: z.string().default("Helix Programing Language Team"),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});

const docsCollection = defineCollection({
  schema: docsSchema(),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
  docs: docsCollection,
};
