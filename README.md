# Playwright Practice — Batch 19

Personal learning repo for Playwright, built as part of the SDET Batch 19 course. This covers hands-on practice with Playwright's test runner, locators, assertions, config, and CI integration.

The repo is organized in parts, each one pushed as progress is made. This README is updated as new parts are added.

## Progress

- [x] **Part 1** — Project setup, config files, auth state, basic locators & actions
- [x] **Part 2** — Tabs/windows, modals, date & time inputs, iframes
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
│   └── practice.spec.ts          # practice tests: login, dialogs, tabs/windows, modal, date inputs, iframe
├── playwright.config.ts          # main config — chromium project, baseURL, storageState
├── playwright-debug.config.ts    # debug config — headed, slowMo, single worker, html+json reporters
├── auth.json                     # saved login session (storageState) — gitignored
└── README.md
```

## Part 1 — Notes

What's covered:

- **Config setup**: `playwright.config.ts` with a `baseURL`, `trace: on-first-retry`, and a chromium project using a saved `storageState` (`auth.json`) so logged-in tests don't need to re-login every run.
- **Debug config**: a separate `playwright-debug.config.ts` for slower, headed, single-worker runs with `slowMo`, screenshots on failure, video on first retry, and both HTML + JSON reporters — useful when debugging a flaky or failing test step by step.
- **Locators & actions**: `getByRole` for textboxes/buttons/headings, `fill()`, `click()`, `dblclick()`, right-click via `click({ button: 'right' })`.
- **Assertions**: `expect(page).toHaveTitle(...)`, `expect(locator).toBeVisible()`, `expect(locator).toContainText(...)`.
- **Auth state reuse**: logging in once and persisting session via `page.context().storageState({ path: "auth.json" })`, then reusing it across tests via the config's `storageState`.
- **Dialog handling**: listening for `page.on("dialog", ...)` to capture and accept browser alerts triggered by double-click/right-click actions.
- **CI**: GitHub Actions workflow installs dependencies + browsers and runs `npx playwright test` on push/PR to `main`/`master`, uploading the HTML report as an artifact.

## Part 2 — Notes

What's covered:

- **New tab / new window**: `context.waitForEvent('page')` started *before* the click (otherwise the event can be missed), then `waitForLoadState()` and a URL assertion on the new page.
- **Modals**: locating by `#id` via `page.locator()`, checking `getByRole("dialog")` with `toBeVisible()` / `not.toBeVisible()`, and using `.first()` to pick between multiple "Close" buttons.
- **Date & time input**: filling `datetime-local` inputs with `2026-10-08T23:42` (24-hour format).
- **Read-only date picker**: removing the `readonly` attribute and setting the value via `elementHandle().evaluate()`, dispatching a `change` event so React picks up the new value.
- **Typed date picker**: clicking a placeholder-matched input, filling it in `MM/DD/YYYY`, and pressing `Enter` to confirm.
- **iframes**: using `page.frameLocator('iframe')` to reach elements inside an iframe, since they aren't reachable through `page` directly.

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

> Note: tests use a relative `baseURL` (`http://localhost:3000`), so the target app needs to be running locally for `practice.spec.ts` to pass.
