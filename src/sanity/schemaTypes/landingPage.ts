import { defineField, defineType } from "sanity";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    defineField({
      name: "language",
      type: "string",
      title: "Language",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Hungarian", value: "hu" },
          { title: "German", value: "de" },
          { title: "French", value: "fr" },
          { title: "Spanish", value: "es" },
          { title: "Russian", value: "ru" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "headline", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string" }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "version", type: "string" }),
    defineField({ name: "releaseNotesUrl", type: "url" }),
    defineField({
      name: "downloads",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Id",
              type: "string",
              options: {
                list: [
                  { title: "Archive.org Torrent", value: "archive-torrent" },
                  { title: "Public Torrent", value: "public-torrent" },
                  { title: "Archive.org Zip", value: "archive-zip" },
                  { title: "Windows (legacy)", value: "windows" },
                  { title: "Linux (legacy)", value: "linux" },
                  { title: "macOS (legacy)", value: "mac" },
                ],
              },
            },
            { name: "title", type: "string" },
            { name: "description", type: "string" },
            { name: "url", type: "url" },
            { name: "size", type: "string" },
            { name: "checksumSha256", type: "string" },
          ],
          preview: {
            select: { title: "title", subtitle: "platform" },
          },
        },
      ],
    }),
    defineField({
      name: "screenshots",
      title: "Screenshots (Media)",
      type: "array",
      of: [
        {
          type: "image",
          fields: [{ name: "alt", type: "string", title: "Alt text" }],
        },
      ],
    }),
    defineField({
      name: "videos",
      title: "Videos (Media)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "url", type: "url" },
          ],
        },
      ],
    }),
    defineField({ name: "trailerUrl", type: "url" }),
    defineField({
      name: "features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "blurb", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "requirements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "links",
      type: "object",
      fields: [
        { name: "github", type: "url" },
        { name: "wiki", type: "url" },
        { name: "issues", type: "url" },
        { name: "youtube", type: "url" },
        { name: "troubleshooting", type: "url" },
        { name: "credits", type: "url" },
        { name: "legal", type: "url" },
      ],
    }),
    defineField({
      name: "credits",
      type: "array",
      of: [{ type: "text" }],
    }),
  ],
  preview: {
    select: { title: "headline", subtitle: "language" },
  },
});
