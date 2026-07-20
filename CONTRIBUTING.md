# Contributing

Thank you for your interest in contributing to LeadPilot AI.

## How to contribute

1. Fork the repository.
2. Create a feature branch from `main`.
3. Follow the project workflow in `instruction.md`.
4. Update or add documentation when introducing changes.
5. Run the repository checks before submitting a pull request:
   - `pnpm install`
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm build`

## Code guidelines

- Use TypeScript and maintain strict typing.
- Use Zod for validation and React Hook Form for form handling.
- Prefer reusable components and shared services.
- Keep routes and data access aligned with the App Router.
- Avoid implementing new business features until the stabilization foundation is complete.

## Documents to review

- `README.md`
- `architecture.md`
- `PROJECT_STATUS.md`
- `sprint-001.md`
- `SPRINT-002-PLAN.md`

## Reporting issues

If you find a bug or security issue, please open an issue with a clear reproduction path and expected behavior. For security-sensitive issues, see `SECURITY.md`.
