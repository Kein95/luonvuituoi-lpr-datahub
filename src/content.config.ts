import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const datasets = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/datasets" }),
  schema: z.object({
    name: z.string(),
    country: z.string(),
    size: z.string(),
    frames: z.string(),
    access: z.enum(["public", "license", "license-edu", "license-staff"]),
    task: z.string(),
    annotation: z.string(),
    year: z.number(),
    source_url: z.string().url().nullable(),
    notes: z.string().optional(),
    description: z.string().optional(),
    classes: z.number().optional(),
    resolution: z.string().optional(),
    bibtex: z.string().optional(),
    paper_url: z.string().url().optional(),
    download_url: z.string().url().optional(),
    license_type: z.string().optional(),
    sample_images: z.array(z.string()).optional(),
  }),
});

const sota = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/sota" }),
  schema: z.object({
    dataset_id: z.string(),
    metric: z.string(),
    metric_label: z.string(),
    results: z.array(
      z.object({
        method: z.string(),
        paper: z.string(),
        venue: z.string(),
        year: z.number(),
        accuracy: z.number(),
        params_m: z.number().nullable().optional(),
        code_url: z.string().url().optional(),
        notes: z.string().optional(),
      })
    ),
  }),
});

export const collections = { datasets, sota };
