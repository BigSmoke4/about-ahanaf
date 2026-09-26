---
title: Example Work
banner: /works/example/banner.jpg
year: 2026
role: Design / Development
tags: [Interactive, Example Tag]
link: https://example.com
---

> **This is a work detail template.** Copy this file to `src/content/works/<slug>.md`, where
> `<slug>` must match the `slug` of a work item in `src/data/works.js`. That work will then
> render as full details when clicked; otherwise the details page shows a unified placeholder.
> This file's slug is `example`, not corresponding to any work,
> so it won't appear online — for reference only.

## Subheading

Body supports standard Markdown: **bold**, *italic*, [external link](https://example.com), and lists:

- Point one
- Point two
- Point three

## Images and Videos

Media placed in `public/works/<slug>/`, referenced with `/works/...` absolute path (`public/works/` default
not in git, see `.gitignore`):

![Example image](/works/example/1.jpg)

<video src="/works/example/demo.mp4" autoplay muted loop playsinline></video>

---

Available frontmatter fields (all optional):

| Field | Description |
| --- | --- |
| `title` | Detail title (fallback to work name in works.js if missing) |
| `banner` | Top banner image path (gradient placeholder if missing) |
| `year` | Year |
| `role` | Role / responsibility |
| `tags` | Tag array, e.g., `[Interactive, Tiger Roar Award]` |
| `link` | External link, renders as "Visit site" button |
