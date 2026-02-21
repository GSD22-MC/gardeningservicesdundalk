import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    modified: z.coerce.date().optional(),
    featuredImage: z.string().optional(),
    servicePillar: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

const reviewsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    author: z.string().optional(),
    text: z.string(),
    rating: z.number().min(1).max(5).default(5),
    date: z.coerce.date().optional(),
    source: z.string().default('Google Review'),
    featured: z.boolean().default(false),
  }),
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    description: z.string(),
    icon: z.string().optional(),
    image: z.string().optional(),
    order: z.number().default(0),
  }),
});

const areasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    county: z.string().default('County Louth'),
    description: z.string().optional(),
  }),
});

const serviceAreasCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    date: z.coerce.date().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  reviews: reviewsCollection,
  services: servicesCollection,
  areas: areasCollection,
  'service-areas': serviceAreasCollection,
};
