# Portfolio Launch Checklist & Pre-Launch Actions

The following tasks are completed or pending before public launch of **balajidasetti.space**:

### Completed Items
- [x] **Real Resume Placed**: Verified real resume PDF at `/public/resume.pdf` (updated with House Hunting removed).
- [x] **Real Projects Applied**: 3 projects active in `data/projects.ts` (`vstay`, `internship-hostel-app`, `mind-care`). House Hunting and placeholder projects removed.
- [x] **VStay Case Study Completed**: Added real SIMATS VStay screenshot (`/public/vstay-screenshot.jpg`) and authentic "What broke" & "What I learned" security hardening stories in `data/projects.ts`.
- [x] **Smart Learned Tech Internship Completed**: Added Smart Learn Ed Tech Certificate of Achievement (`/public/internship-certificate.jpg`) and authentic multi-paragraph "What broke" & "What I learned" stories in `data/projects.ts`.
- [x] **Mind Care Case Study Completed**: Added 3 Android screenshots (`/public/mindcare-welcome.png`, `/public/mindcare-home.jpg`, `/public/mindcare-journal.jpg`) and authentic "What broke" & "What I learned" mobile release stories in `data/projects.ts`.
- [x] **Contact Details Configured**: Real email (`dasettisribalu@gmail.com`), GitHub (`https://github.com/Balaji431`), and LinkedIn (`https://www.linkedin.com/in/balaji-d-1675a9324`).
- [x] **About Paragraph Updated**: Real first-person bio applied in `#about`.
- [x] **Stack Section Updated**: Clean list matching resume tools with zero skill bars or years per tool.
- [x] **Port 3002 Configured**: Development and production server scripts standardized on port 3002.

### Remaining Pre-Launch Tasks
1. **Remove `noindex` and `nofollow`**:
   - In `app/layout.tsx`, change `robots: { index: false, follow: false }` to `robots: { index: true, follow: true }`.
   - In `app/robots.ts`, change `disallow: '/'` to `allow: '/'` to enable public search engine indexing.
