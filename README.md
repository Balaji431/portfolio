# Balaji Dasetti — Personal Portfolio Website

A warm editorial personal portfolio website for Balaji Dasetti, Junior Full Stack Developer based in Chennai, India. Built with Next.js (App Router, strict TypeScript), Tailwind CSS v4, GSAP with ScrollTrigger, Lenis smooth scrolling, and Google Fonts (`Instrument Serif`, `DM Sans`, and `JetBrains Mono`).

---

## 1. Quick Start & Local Development

### Prerequisites
- Node.js 18.18+ (tested on Node.js 24)
- npm 10+

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# The site is live at http://localhost:3002

# Run production build (TypeScript strict check & static export)
npm run build

# Start production server (runs on port 3002)
npm run start
```

---

## 2. How to Add a Project

All project content is stored in a single typed configuration file: [`data/projects.ts`](file:///c:/portfolio/data/projects.ts). Adding a new project is a simple 10-line change:

```typescript
// Open data/projects.ts and append a new object to the `projects` array:
{
  slug: 'new-project-slug',
  title: 'Project Title',
  summary: 'One-line summary describing the project responsibility and stack.',
  role: 'Your Role (e.g. Full Stack Developer)',
  timeline: '2026',
  stack: ['Flutter', 'PHP 8.2', 'MySQL', 'Docker'],
  built: 'Detailed scope of what you built and architectural choices.',
  broke: 'Real-world debugging problem and how it was resolved.',
  learned: 'Key takeaway and technical insight gained from the build.',
},
```

Next.js automatically statically generates the route at `/work/[new-project-slug]` with dynamic metadata and links it on the home page.

---

## 3. How to Customize Colors & Typography

### Design Tokens (CSS Variables)
Colors are defined in [`app/globals.css`](file:///c:/portfolio/app/globals.css) and bound directly into Tailwind CSS v4's `@theme`:

```css
:root {
  --bg: #F4EFE6;       /* Warm light paper */
  --ink: #1A1A1A;      /* Primary text */
  --mute: #6B645A;     /* Secondary text */
  --line: #D9D1C2;     /* Hairline borders */
  --accent: #E8542A;   /* Editorial terracotta */
}

.dark {
  --bg: #1A1713;       /* Warm dark charcoal */
  --ink: #EFE8DA;      /* Cream text */
  --mute: #A39A8A;     /* Muted cream */
  --line: #3A342B;     /* Dark border */
  --accent: #FF7A4D;   /* Vibrant terracotta */
}
```

### Fonts
Configured in [`app/fonts.ts`](file:///c:/portfolio/app/fonts.ts) via `next/font/google`:
- **Headings & Hero**: `Instrument Serif` (weights: 400, italic)
- **Body**: `DM Sans` (weights: 400, 500, 700)
- **Tags & Metadata**: `JetBrains Mono` (weights: 400, 500)

---

## 4. Deploying to Vercel

1. Push your code to your GitHub repository.
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Leave the default settings (Next.js is auto-detected).
5. Click **"Deploy"**. Vercel will build and publish your site with edge caching and zero configuration.

---

## 5. Connecting Your Custom Domain (`balajidasetti.space`)

1. In your Vercel Project Dashboard, navigate to **Settings** → **Domains**.
2. Enter `balajidasetti.space` and click **Add**.
3. Vercel will display the required DNS records (typically an `A` record pointing to Vercel's IP and/or a `CNAME` for `www`).
4. **Important**: Copy the exact DNS records that Vercel shows directly in its dashboard into your domain registrar's DNS settings (such as Namecheap, GoDaddy, Cloudflare, or Porkbun). Do not guess or copy generic DNS records.
5. Once DNS propagation finishes (typically 5–30 minutes), Vercel will automatically provision a free SSL certificate.

---

## 6. Pre-Launch Replacements
Please review [`TODO.md`](file:///c:/portfolio/TODO.md) for the complete prioritized list of replacements before public launch (removing placeholder projects, adding real contact links, updating resume, and removing `noindex`).
