# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint code quality checks
- `pnpm commit` - Create conventional commits using commitizen
- `pnpm prepare` - Install git hooks (Husky)

## Project Architecture

This is a **Next.js 15 App Router** application with TypeScript, built as a starter template for 302.AI applications.

### Core Architecture Patterns

- **App Router Structure**: Uses Next.js 15 App Router with `src/app/[locale]/` for internationalized routes
- **Global Layout System**: The root layout (`src/app/[locale]/layout.tsx`) wraps the entire application with provider components in a specific order:
  - AppTheme (theme management)
  - AppJotai (state management)
  - NextIntlClientProvider (i18n)
  - AppClient (client-side setup)
  - AppTooltip (tooltip provider)
  - Plus global components: AppAuth, AppChat, AppClickMonitor, AppMessage

### State Management

- **Jotai**: Primary state management using atomic approach
- Store structure in `src/stores/`:
  - `config_store.ts` - Application configuration state
  - `language_store.ts` - Language/locale state
  - Central store exported from `src/stores/index.ts`

### Internationalization (i18n)

- **next-intl**: Handles internationalization
- Supported locales: `zh` (Chinese), `en` (English), `ja` (Japanese)
- Default locale: `en`
- Messages stored in `/messages/[locale].json`
- Routing configuration in `src/i18n/routing.ts`
- SEO metadata generated per locale in layout

### API Structure

- API routes organized in `src/api/`:
  - `auth.ts` - Authentication endpoints
  - `normal.ts` - Standard API endpoints
  - Re-exported through `src/api/index.ts`

### Environment Configuration

- **@t3-oss/env-nextjs**: Type-safe environment variable validation
- Configuration in `src/env.ts`
- Validates both server and client environment variables
- Key variables include 302.AI API endpoints, authentication URLs, and feature flags

### Component Organization

- **Global Components**: App-wide providers and layout components in `src/components/global/`
- **UI Components**: Radix UI-based components in `src/components/ui/` (shadcn/ui style)
- **Form Components**: React Hook Form implementations in `src/components/forms/`
- **Common Components**: Reusable components in `src/components/common/`

### Key Libraries & Tools

- **Styling**: TailwindCSS v4 with CSS-first configuration
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: ky for API requests
- **Theme**: next-themes for dark/light mode
- **Code Quality**: ESLint, Prettier, Husky, Commitlint
- **Package Manager**: pnpm (required - version 8.0+)

### Path Aliases

- `@/*` maps to `./src/*`
- `@/public/*` maps to `./public/*`

### Build Configuration

- **Standalone Output**: Configured for Docker deployment (`output: "standalone"`)
- **Typed Routes**: Experimental typed routes enabled for type safety
- **Image Optimization**: Remote patterns configured for 302.ai file server
- React Strict Mode disabled

## Framework Versions

- **React**: 19.0.0 with latest React hooks (useActionState, etc.)
- **Next.js**: 15.1.8 with async APIs (headers, cookies, params as Promises)
- **Tailwind CSS**: 4.0.0-alpha.39 with CSS-first configuration

### Migration Notes

#### Tailwind CSS v4
- Uses CSS-first configuration in `src/styles/globals.css` with `@import "tailwindcss"`
- CSS variables defined in `@theme` block instead of `tailwind.config.ts`
- PostCSS configuration updated to use `@tailwindcss/postcss` plugin
- Color references use CSS variable format: `bg-[var(--color-background)]`

#### Next.js 15
- `headers()`, `cookies()`, and `params` are now async and return Promises
- Must await these APIs: `const hostname = (await headers()).get("host")`
- Layout params typed as `Promise<{ locale: string }>`

#### React 19
- Compatible with new React hooks and concurrent features
- Type definitions updated with pnpm overrides for `@types/react` and `@types/react-dom`