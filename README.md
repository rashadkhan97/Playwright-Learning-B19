# Playwright Practice — Batch 19

Personal learning repo for Playwright, built as part of the SDET Batch 19 course. This covers hands-on practice with Playwright's test runner, locators, assertions, config, and CI integration.

The repo is organized in parts, each one pushed as progress is made. This README is updated as new parts are added.

## Progress

- [x] **Part 1** — Project setup, config files, auth state, basic locators & actions
- [ ] Part 2 — (coming soon)
- [ ] Part 3 — (coming soon)
- [ ] Part 4 — (coming soon)

## Tech Stack

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- TypeScript
- GitHub Actions (CI)

## Project Structure

```
playwright-practice-b19/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI: runs tests on push/PR to main/master, uploads HTML report
├── tests/
│   ├── example.spec.ts           # default Playwright starter test (playwright.dev site)
│   └── practice.spec.ts          # practice tests: login, double click, right click, dialogs
├── playwright.config.ts          # main config — chromium project, baseURL, storageState
├── playwright-debug.config.ts    # debug config — headed, slowMo, single worker, html+json reporters
├── auth.json                     # saved login session (storageState) — gitignored
└── README.md
```

## Part 1 — Notes

What's covered so far:

- **Config setup**: `playwright.config.ts` with a `baseURL`, `trace: on-first-retry`, and a chromium project using a saved `storageState` (`auth.json`) so logged-in tests don't need to re-login every run.
- **Debug config**: a separate `playwright-debug.config.ts` for slower, headed, single-worker runs with `slowMo`, screenshots on failure, video on first retry, and both HTML + JSON reporters — useful when debugging a flaky or failing test step by step.
- **Locators & actions**: `getByRole` for textboxes/buttons/headings, `fill()`, `click()`, `dblclick()`, right-click via `click({ button: 'right' })`.
- **Assertions**: `expect(page).toHaveTitle(...)`, `expect(locator).toBeVisible()`, `expect(locator).toContainText(...)`.
- **Auth state reuse**: logging in once and persisting session via `page.context().storageState({ path: "auth.json" })`, then reusing it across tests via the config's `storageState`.
- **Dialog handling**: listening for `page.on("dialog", ...)` to capture and accept browser alerts triggered by double-click/right-click actions.
- **CI**: GitHub Actions workflow installs dependencies + browsers and runs `npx playwright test` on push/PR to `main`/`master`, uploading the HTML report as an artifact.

## Running Tests

```bash
npm install
npx playwright install

# run all tests (main config)
npx playwright test

# run with the debug config (headed, slowMo, single worker)
npx playwright test --config=playwright-debug.config.ts

# view the last HTML report
npx playwright show-report
```

> Note: tests use a relative `baseURL` (`http://localhost:3000`), so the target app needs to be running locally for `practice.spec.ts` to pass. `example.spec.ts` hits the public playwright.dev site directly.
