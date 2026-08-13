# AGENTS.md

## Purpose

Shared operating rules for AI coding agents working in this repository.

Codex reads this file directly.
Claude Code should import this file from `CLAUDE.md`.

## Core Rules

- Keep changes scoped to the current task.
- Do not edit unrelated files or perform broad refactors unless explicitly requested.
- Do not delete files or large blocks of code without approval.
- Prefer existing project patterns, helpers, services, components, hooks, and utilities before introducing new abstractions.
- Prefer simple, explicit, maintainable code.
- If requirements are unclear, ask one concise question before editing.
- If the user provides files, folders, logs, stack traces, screenshots, or test names, start from those.
- If no files are provided but an active editor file is available, inspect it first as a starting point.
- If no relevant file context is available, use fast search to identify the smallest relevant code area.
- Before editing any file, read its current contents again because the user may have modified it after the agent last viewed it.
- Do not format code unless formatting is explicitly requested or required by the exact change being made.
- Do not scan the whole repository by default.

## CLI Commands

- The user runs CLI commands such as install, build, dev server, lint, typecheck, tests, migrations, and dependency updates.
- Agents should not run those commands directly.
- When verification or setup is needed, print the exact command for the user to run and explain what the command checks or changes.
- Do not claim verification passed unless the user provides the command output or the result is otherwise visible.
- If a command cannot or should not be run, state that clearly and provide the next best manual check.

## Default Conventions

- Do not add dependencies unless clearly necessary and approved.
- Preserve existing API request and response shapes unless a contract change is approved.
- Validate inputs at system boundaries.
- Use consistent error handling with the existing project style.
- Add or update tests for changed behavior when practical.
- Test behavior rather than implementation details.
- Do not suppress lint, type, build, or test failures without explaining why.
- Do not change UI styling, CSS classes, layout, spacing, colors, or visual design unless the task explicitly requires it.

## Code Organization

- Keep imports organized and remove unused imports.
- Use the project formatter and linter.
- Remove temporary `console.log`, debug logs, and commented-out code before the commit-ready phase.
- Keep files focused on one responsibility.
- Max 250 lines per frontend file by default.
- Max 500 lines per backend file by default.
- Max 50 lines per function by default.
- Consider splitting a child component or child function into a separate file when it is longer than 80 lines.
- Use arrow functions for frontend functions and handlers.
- Avoid long parameter lists. Prefer a single object parameter with a named interface or type.
- Keep public exports intentional. Do not export helpers unless they are reused outside the module.

## Helpers

- Follow code reuse and DRY principles.
- Do not extract helper functions unless the user explicitly requests or approves the extraction.
- Before creating a helper, check related `utils`, `helpers`, shared modules, or existing local helpers to avoid duplicating logic.
- Extract helpers only when the same pattern appears in at least two places in the file, or when the helper logic requires a meaningful transformation step.
- Keep helper names short and specific, using simple prefixes such as `map`, `get`, `to`, `build`, `parse`, or `transform`.
- Helpers should have explicit return types.
- Add a short comment before a helper only when the purpose, reuse reason, or transformation is not obvious from its name.
- Keep helpers private to the module unless they are reused outside the module.

Example:

```ts
// Use simple transformations directly when they are used once.
const displayName = name.trim() || "Unknown";

// Consider a helper only when the same logic appears in at least two places
// or when the transformation becomes meaningful enough to name.
const trimName = (value: string): string => value.trim();
```

## Naming

- Use descriptive names.
- Avoid single-character names such as `p`, `t`, or `i`, except in very small local scopes where the meaning is obvious.
- Variables and functions use `camelCase`.
- Constants use `UPPER_SNAKE_CASE`.
- Types, interfaces, classes, and components use `PascalCase`.
- File names must follow the existing project convention.
- Common accepted file naming styles are `PascalCase`, `camelCase`, or `kebab-case`.
- Prefer the dominant style already used in the same folder or module.
- Keep exported symbol names and file names consistent when the project convention expects it.
- Follow existing semantic suffix patterns in the folder or module, such as `.service`, `.controller`, `.repository`, `.repoImpls`, `.schema`, `.dto`, `.types`, `.constants`, `.utils`, `.path`, or `.route`.
- Do not introduce a new file naming style or suffix pattern unless explicitly requested.

## Immutability

- Do not mutate React state, props, Zustand/Redux state, TanStack Query cache data, function inputs, or shared objects directly.
- Use immutable updates with `map`, `filter`, `reduce`, `flatMap`, spread, or object/array copying.
- When updating nested objects, copy every changed level to preserve existing fields.
- Avoid mutating accumulators in `reduce`; return a new accumulator.
- Use mutation only for clearly justified performance-sensitive code outside React rendering paths.

## JavaScript / TypeScript Syntax

- Use modern ES6+ syntax by default.
- Prefer `const`; use `let` only when reassignment is required.
- Do not use `var`.
- Prefer destructuring when it improves readability.
- Prefer template literals over string concatenation for interpolation.
- Prefer arrow functions for callbacks and frontend functions/handlers.
- Do not chain `.map().filter()` to reshape nested data or remove empty mapped results. Use `flatMap` instead and add a short comment explaining why `flatMap` is needed.
- Use `Boolean(array.length)` when converting array length into an explicit boolean value. Prefer this over `!!array.length`.
- For simple `if` / `else` branches with only one short action, keep each branch on one line when it stays readable.

Example:

```ts
const visibleItems = groups.flatMap((group) =>
  group.items.filter((item) => item.visible),
);

const hasVisibleItems = Boolean(visibleItems.length);

if (shouldDebug) console.log("debug value", value);

if (isValid) submitForm();
else showValidationError();
```

## TypeScript

- `strict` and `strictNullChecks` are expected.
- Add explicit return types for backend service/controller methods, helper/util functions, React Query hooks, and functions with multiple arguments or mixed data shapes.
- Do not require explicit return types for React components, inline callbacks, or simple local functions when TypeScript inference is clear.
- Prefer `unknown` over `any`.
- Avoid `any` unless the boundary is truly untyped and the usage is justified.
- Avoid type assertions with `as` unless there is a clear reason.
- Do not use `@ts-ignore` without a short justification.
- Prefer `interface` for object shapes and exported contracts.
- Use `type` for unions, mapped types, utility types, and composition.
- Use discriminated unions for variants.
- Prefer string literal unions or `as const` objects/arrays over TypeScript `enum`.
- Use `enum` only when the project already uses enums consistently, or when a runtime enum object is explicitly useful.
- Avoid `const enum` unless the project build setup explicitly supports it.
- Use `as const` for literal objects and arrays when literal inference matters.
- Handle `null` and `undefined` with optional chaining, type guards, or explicit checks.
- Avoid nested indexed access types deeper than one level. Use named intermediate types instead.

Example:

```ts
type UserName = User["name"];
type UserNameTest = UserName["test"];
```

## Fallback Logic

- Implement at most one fallback layer by default.
- Treat default values, cached data, retry sources, inferred values, and alternative APIs as fallback logic.
- Do not add a second fallback layer unless explicitly approved.
- Do not hide errors by silently falling back to unrelated data.
- Do not change business behavior through fallback logic without approval.
- If fallback affects API behavior, auth, permissions, payment, or persisted data, ask for approval first.
- If a second fallback layer appears necessary, stop and explain the missing failure case, why it is needed, the added maintenance risk, and the simpler alternative.

## Approval Gates

Ask for approval before:

- Changing database schema or migrations
- Changing public API request/response shape
- Changing authentication or authorization behavior
- Changing payment behavior
- Changing secrets handling
- Changing deployment, CI/CD, or infrastructure
- Adding major dependencies
- Changing broad architecture or module boundaries
- Changing UI styling, CSS classes, layout, spacing, colors, or visual design
- Deleting files or large blocks of code
- Modifying generated files by hand

## Multi-Step Requests

- Execute multiple requested actions in order unless safety requires stopping.
- Do not skip earlier requested steps.
- Keep refactors within the requested step and scope.
- If a requested step requires approval, stop and ask before continuing.

For prompts like "review this feature, fix issues, then refactor":

1. Review against the stated requirements first.
2. Report the issues found.
3. Fix only confirmed issues.
4. Refactor only within the touched or explicitly requested scope.
5. Ask the user to run relevant verification commands.

## Verification

After code changes:

- Inspect affected files and nearby call sites.
- Identify the smallest relevant verification first.
- Prefer lint, typecheck, build, or tests based on the changed area.
- For TypeScript changes, check declarations, types, nullability, generics, and data shapes.
- Ask the user to run backend tests when backend behavior changes or backend tests are available.
- Frontend tests are optional unless already relevant or explicitly requested.
- Report verification commands as pending user-run commands unless output has been provided.
