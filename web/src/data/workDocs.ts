// Work detail content specification: one markdown file per work, placed in src/content/works/<slug>.md
//
// frontmatter (between ---) fields (all optional):
//   title   Title (fallback to work name in list if missing)
//   banner  Top banner image path (e.g., /works/guqin/banner.jpg; gradient placeholder if missing)
//   year    Year
//   role    Role / responsibility
//   tags    Tag array: [Interactive, Tiger Roar Award]
//   link    External link（“Visit site”按钮）
// Body (after frontmatter) write markdown: text / image ![](...) / video <video src=...>.
//
// Resources (images/videos) placed in public/works/, referenced with /works/... absolute path.
// List (works.ts item) linked to md here via `slug`; items without slug still use placeholder details.

export interface WorkDoc {
  slug: string
  title?: string
  banner?: string
  year?: string
  role?: string
  tags?: string[]
  link?: string
  body: string
}

// Inline all md as raw strings at build time
const files = import.meta.glob('../content/works/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Minimal frontmatter parsing (key: value, arrays use [a, b]) — avoid introducing Buffer-dependent libraries
function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>
  body: string
} {
  const m = /^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/.exec(raw)
  if (!m) return { data: {}, body: raw }
  const data: Record<string, string | string[]> = {}
  for (const line of m[1].split('\n')) {
    const mm = /^([A-Za-z0-9_-]+)\s*:\s*(.*)$/.exec(line.trim())
    if (!mm) continue
    const rawVal = mm[2].trim()
    let val: string | string[]
    if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
      val = rawVal
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    } else {
      val = rawVal.replace(/^['"]|['"]$/g, '')
    }
    data[mm[1]] = val
  }
  return { data, body: m[2].trim() }
}

const docs: Record<string, WorkDoc> = {}
for (const path in files) {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const { data, body } = parseFrontmatter(files[path])
  docs[slug] = { slug, ...data, body } as WorkDoc
}

export function getWorkDoc(slug?: string): WorkDoc | null {
  return slug ? docs[slug] || null : null
}
