<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

- `pnpm dev` - Start dev server (http://localhost:3000)
- `pnpm build` - Production build
- `pnpm lint` - Run ESLint

## Tech Stack

- Next.js 16.2.4 (App Router)
- React 19.2.4
- Tailwind CSS v4 (PostCSS config in postcss.config.mjs)
- shadcn/ui components
- pnpm package manager (not npm/yarn)

## Notes

- TypeScript 5, no typecheck script in package.json
- No test framework configured
- ESLint uses flat config (eslint.config.mjs)