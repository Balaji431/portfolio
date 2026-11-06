# Portfolio Launch Checklist & Pre-Launch Actions

The following tasks are completed or pending before public launch of **balajidasetti.space**:

### Completed Items
- [x] **Real Resume Placed**: Verified real resume PDF at `/public/resume.pdf` (~378.6 KB).
- [x] **Real Projects Applied**: 4 projects active in `data/projects.ts` (`vstay`, `internship-hostel-app`, `mind-care`, `house-hunting`). Placeholder projects removed.
- [x] **Contact Details Configured**: Real email (`dasettisribalu@gmail.com`), GitHub (`https://github.com/Balaji431`), and LinkedIn (`https://www.linkedin.com/in/balaji-d-1675a9324`).
- [x] **About Paragraph Updated**: Real first-person bio applied in `#about`.
- [x] **Stack Section Updated**: Clean list matching resume tools with zero skill bars or years per tool.
- [x] **Port 3002 Configured**: Development and production server scripts standardized on port 3002.

### Remaining Pre-Launch Tasks
1. **Case Study Visual Assets**:
   - In `app/work/[slug]/page.tsx`, replace the placeholder aspect-video container with real screen recordings or screenshots of VStay, Smart Learned Tech hostel app, Mind Care, and House Hunting.
2. **"What broke" and "What I learned" Technical Stories**:
   - In `data/projects.ts`, replace the neutral TODO placeholders with your authentic debugging experiences.
3. **House Hunting Live URL**:
   - In `data/projects.ts`, add the real Neocities deployment URL to `house-hunting`.
4. **Remove `noindex` and `nofollow`**:
   - In `app/layout.tsx`, change `robots: { index: false, follow: false }` to `robots: { index: true, follow: true }`.
   - In `app/robots.ts`, change `disallow: '/'` to `allow: '/'` to enable public search engine indexing.
