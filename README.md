# Campus Compass

Build the frontend for the "CampSolver" public website — a transparency site accessible without login, showcasing campus issue reporting and resolutions. Assume a public-read REST API + Socket.IO public namespace already exist and are reachable at an env-configured base URL.

TECH STACK

- Next.js (latest, App Router)

- Tailwind CSS

- Server-rendered where it helps (issues list, stats) for fast first paint + SEO

- Socket.IO client for live updates

- SWR or React Query for data fetching with a polling fallback (refetchInterval 30-60s) if the socket disconnects

ENV VARIABLES (never hardcode)

NEXT_PUBLIC_API_BASE_URL

NEXT_PUBLIC_SOCKET_URL

PAGES

1. Home — hero explaining CampSolver, live counters (issues resolved, avg resolution time, active departments), CTA buttons to Public Dashboard and How It Works

2. About CampSolver — mission, how issues stay accountable, a clear privacy statement listing what is NEVER published (student name/email/phone, exact GPS location, internal comments)

3. How It Works — step-by-step visual: student reports → admin reviews → department resolves → public dashboard reflects approved status

4. Public Issues Dashboard — filterable/searchable grid of public issues (filters: category, priority, status, location; pagination)

5. Resolved Issues / Campus Improvements — before/after cards for issues flagged as campus improvements

6. Statistics & Impact — charts: issues by category, resolution rate, avg resolution time, monthly trend, most-improved locations

COMPONENTS

Public Issue Card — shows exactly:

- Issue title

- Category

- Description

- General campus location (never exact GPS)

- Priority level (color-coded: LOW=blue, MEDIUM=amber, HIGH=red)

- Current status (color-coded pill, with text/icon — never color alone)

- Date reported

- Last updated date

- Image, only if present in the API response (backend already filters for approval)

Campus Improvement Card — shows exactly:

- Problem before resolution (text)

- Before image (if present)

- Resolution description

- After image

- Date resolved

REAL-TIME BEHAVIOR

- On the Public Dashboard and Statistics pages, connect to the Socket.IO public namespace and listen for: issueCreated, issueUpdated, issueStatusChanged, issueResolved, issuePublicVisibilityChanged

- Update lists/cards in place without a full page reload

- If the socket disconnects, fall back to periodic polling of the same data via REST

NON-FUNCTIONAL REQUIREMENTS

- SEO: proper metadata, Open Graph tags, sitemap.xml, semantic HTML

- Accessibility: color never the sole indicator of status/priority

- No login walls anywhere on this site

- Responsive across mobile/tablet/desktop

- Skeleton loaders while data fetches; graceful empty states ("No public issues yet")

Build clean, componentized, production-style code. Include a .env.example with placeholder values only.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ecba9c4e-560c-452e-ad38-aef8719a3038).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
