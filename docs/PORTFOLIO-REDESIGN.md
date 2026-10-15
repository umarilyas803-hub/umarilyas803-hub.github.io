# Portfolio redesign and search foundation

## Changes

- Shared ivory, ink and indigo editorial styling across the portfolio, services, reviews and nine demos. Existing project-specific interfaces and event handlers remain intact.
- Homepage introduces the offer through product previews, with direct paths to work, services and client reviews.
- Services enquiry form prepares an email with the selected service and project brief. Sending requires the visitor's email app.
- Accessible client review form supports 1–5 stars, project context, written feedback and explicit publication consent.
- Reviews use an email handoff. There is no server submission, automatic email delivery or private review database on GitHub Pages.
- Approved public reviews are read from `reviews.json`. Only include name, project, rating, review, approved and consent; never include an email, personal contact details or confidential project data. The JSON is public. Verify the project and permission before adding a review. Add all genuine consented feedback fairly, regardless of sentiment. No fake ratings or aggregate-rating markup.

## Search and answer content

- Retained existing canonical URLs, Search Console verification, social metadata and project URLs.
- Clarified nine unique project descriptions and added visible, concise project summaries that distinguish prototypes from connected services.
- Added breadcrumb structured data to project pages and Service entities for the actual service categories.
- Added the reviews URL to the sitemap. Kept crawl access open in robots.txt.
- Added internal links among services, project examples, owner information, reviews and contact.
- Descriptive server-delivered HTML remains accessible without JavaScript. JSON-LD matches the visible scope; no invented awards, customers, addresses or rating claims were added.
- Existing FAQ content is useful for readers; FAQ markup is not a promise of Google rich results.
- Google states that established SEO practices also apply to its AI features; special AI files or special schema are not required: https://developers.google.com/search/docs/appearance/ai-features
- Search rankings, indexing, AI citations and conversion improvements are not guaranteed. No external links, directory submissions, search indexing requests or account changes were performed.

## Checks

Run:

```sh
node scripts/check-html.mjs
node scripts/check-site.mjs
node scripts/check-feedback.mjs
```

The checks cover metadata, local links and fragment targets, duplicate IDs, JSON-LD validity, JavaScript syntax, public review privacy, invalid review handling and safe mailto encoding. GitHub Actions runs the same checks.

Chromium browser checks passed at 320, 390, 768 and 1440 pixels across 13 content pages. Verified no horizontal document overflow, broken images or browser JavaScript errors. Reviewed homepage, reviews and provider dashboard screenshots. Tested review and enquiry email preparation, the mobile menu, pause-motion control and key actions in all nine project demos. No measured Core Web Vitals or Lighthouse score is claimed.

The reproducible browser script is `scripts/check-browser.cjs`. It requires Playwright. Set `BROWSER_EXECUTABLE_PATH` if using an existing Chromium executable; optionally set `QA_SCREENSHOTS` to an existing output directory. The script starts its own local static server.

## Release and follow-up

1. Review the rendered desktop/mobile pages, particularly navigation, long headlines and project demo layouts.
2. Confirm every project interaction still matches its documented scope.
3. Try the final send step with an actual email app; browser checks verify preparation only. No success message implies automatic delivery.
4. Merge only after visual approval, then check GitHub Pages deployment.
5. Inspect the sitemap and changed URLs in Search Console after release. Monitor indexing and real query/click data over time before making further search decisions.
6. If durable private review storage and moderation are required, choose a backend and authentication model separately; do not publish secrets or emulate an admin login in client-side JavaScript.

## Complete visual implementation

The final pass replaces the old homepage hero and both flagship heroes, creates custom imagery for all nine project scenes, adds visual service cards and a dedicated search-visibility page, applies consistent navigation and footers, and introduces pausable motion. `docs/DESIGN-ASSETS.md` records the asset briefs. Social previews, responsive image variants and the image sitemap are included. The visual approach follows the chosen design boards while retaining real project scope and existing working demo controls.

## Accessibility pass

Axe checks for WCAG 2 A/AA rules were run on all 13 content pages. Observed contrast failures in muted text/status palettes were corrected, the chart-range selector was labelled and breadcrumb links were underlined. The final automated run reported no violations for the checked rules. This is an automated check, not a certification or a substitute for assistive-technology testing.
