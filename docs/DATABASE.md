# Database — MongoDB Collections

Defined in `apps/api/src/models/*.ts` (Mongoose), typed in `packages/types/src/index.ts`, validated on
write via `packages/schemas` (Zod). All collections use `{ timestamps: true }`.

| Collection | Purpose | Key fields |
|---|---|---|
| `Product` | The 8 flagship products | `slug` (unique), `category` (enum of project types), `techStack[]`, `coverImage` (optional — empty renders a brand-gradient placeholder instead of a broken image), `caseStudyUrl`/`liveDemoUrl`/`githubUrl`, `featured`, `order`, `published`. Text-indexed on name/tagline/description for search. |
| `CareerRole` | Open job listings | `slug` (unique), `department`, `employmentType` (enum), `responsibilities[]`, `requirements[]`, `published`. |
| `Application` | Job applications | `roleId` (ref `CareerRole`), `resumeUrl`/`coverLetterUrl` (uploaded via `multer`, served from `/uploads`), `experienceYears`, `skills[]`, `status` (pipeline enum: new → reviewing → interviewing → offered/rejected/hired). |
| `Contact` | Consultation requests | `budget`/`projectType` (enums), `message`, `status` (new/contacted/qualified/closed). |
| `Admin` | Dashboard users | `email` (unique), `passwordHash` (bcrypt, `select: false` by default), `role` (super-admin/editor/recruiter). |
| `AnalyticsEvent` | Event log | `type` (page-view/contact-submit/application-submit/product-view/gallery-visit), `path`, freeform `meta`. Indexed on `{type, createdAt}`. Ingestion endpoint is a follow-up phase. |
| `Media` | Uploaded asset registry | `filename`, `url`, `mimeType`, `size`, `category`. |
| `Setting` | Key/value config store | `key` (unique), freeform `value` — for things like homepage content overrides. |

## Seeding an admin user

```
pnpm --filter @houseofmusa/api seed:admin you@company.com "a-strong-password" "Your Name"
```

Upserts by email, so it's safe to re-run.

## Seeding placeholder products

```
pnpm --filter @houseofmusa/api seed:products
```

Upserts 8 placeholder products (one per category) by slug — see `apps/api/src/scripts/seedProducts.ts`.
Replace via the admin Products CRUD once real product content exists.
