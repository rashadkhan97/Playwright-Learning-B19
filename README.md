# Playwright Practice — Batch 19

Personal learning repo for Playwright, built as part of the SDET Batch 19 course. This covers hands-on practice with Playwright's test runner, locators, assertions, config, and CI integration.

The repo is organized in parts, each one pushed as progress is made. This README is updated as new parts are added.

## Progress

- [x] **Part 1** — Project setup, config files, auth state, basic locators & actions
- [x] **Part 2** — Tabs/windows, modals, date & time inputs, iframes
- [x] **Part 3** — Page Object Model (OOP), setup project for auth, faker test data, file upload
- [x] **Part 4** — Browser fixture (shared context/page), serial mode, test tags (`@smoke`)

## Tech Stack

- [Playwright Test](https://playwright.dev/) (`@playwright/test`)
- TypeScript
- [Faker](https://fakerjs.dev/) (`@faker-js/faker`) for random test data
- GitHub Actions (CI)

## Project Structure

```
playwright-practice-b19/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI: runs tests on push/PR to main/master, uploads HTML report
├── pages/                        # Page Object Models (POM)
│   ├── LoginPage.pom.ts          # login screen locators + login() flow
│   └── CreateUserPage.pom.ts     # add-user form locators + createUser(), UserModel interface
├── tests/                        # testDir — only these run with `npx playwright test`
│   ├── auth.setup.ts             # "setup" project: logs in once, saves auth.json
│   ├── user.spec.ts              # create-user test using the POM
│   └── browserFixture.spec.ts    # shared context/page, serial mode, @smoke tags
├── practices/                    # earlier learning specs (outside testDir, run by path)
│   ├── practice.spec.ts          # part 1-2: dialogs, tabs/windows, modal, date inputs, iframe
│   └── myuser.spec.ts            # add-user test before POM (skipped, kept for learning)
├── utils/
│   ├── randomNumber.ts           # generateRandomNumber() for unique phone numbers
│   └── suits.ts                  # SUITES tag constants (smoke = "@smoke")
├── resources/                    # images used for photo upload
├── playwright.config.ts          # main config — setup + chromium projects, baseURL, storageState
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

## Part 3 — Notes

What's covered:

- **Without OOP first**: `user.spec.ts` first wrote the add-user flow with raw locators in the test, then was refactored into a POM (the old version lives in `practices/myuser.spec.ts`).
- **Page Object Model**: each page is a class in `pages/*.pom.ts`. Locators are `readonly` properties built in the `constructor(page)`, and actions are methods (`login()`, `createUser()`). Tests only call methods, so a UI change is fixed in one place.
- **`UserModel` interface**: typed test data (`firstName`, `email`, `gender: 'Male' | 'Female'`, ...) passed into `createUser(user)` instead of many separate arguments.
- **Setup project for auth**: `tests/auth.setup.ts` runs first (the `setup` project in `playwright.config.ts`), logs in through `LoginPage`, and saves the session to `auth.json`. The `chromium` project `dependencies: ['setup']` and uses that `storageState`, so every test starts logged in. `login()` waits for the Profile heading so `auth.json` is never saved empty.
- **Random test data**: `faker` for names/emails and `generateRandomNumber()` for unique phone numbers, so repeated runs don't clash.
- **Form tricks**: keyboard-driven blood-group dropdown (`ArrowDown` + `Enter`), `pressSequentially` with a delay for the date field, `selectOption`, `check()` for radio/checkbox, `setInputFiles()` for photo upload.
- **Assertion**: `expect(page).toHaveURL("/dashboard/users")` after creating a user.

## Part 4 — Notes

What's covered:

- **Browser fixture / manual context**: in `browserFixture.spec.ts`, `test.beforeAll` uses the `browser` fixture to create one `browserContext` (with `storageState: 'auth.json'`) and one `page`, shared by every test. `afterAll` closes the context.
- **Serial mode**: `test.describe.configure({ mode: "serial" })` runs tests in order and skips the rest if one fails, which is needed because the tests share one page.
- **Tags**: `SUITES.smoke` (`"@smoke"`) from `utils/suits.ts` is attached with `test(name, { tag }, fn)` and selected with `--grep`.
- **Practice components revisited**: double-click with dialog capture, modal open/close, `datetime-local` input, typed React date picker, and iframe login via `frameLocator`.

## Running Tests

```bash
npm install
npx playwright install

# run all tests (main config)
npx playwright test

# run one file
npx playwright test tests/user.spec.ts

# run only tests tagged @smoke (keep the quotes — PowerShell treats a bare @smoke as splatting)
npx playwright test tests/browserFixture.spec.ts --grep "@smoke"

# run an older practice spec (outside testDir, so pass the path)
npx playwright test practices/practice.spec.ts

# run with the debug config (headed, slowMo, single worker)
npx playwright test --config=playwright-debug.config.ts

# view the last HTML report
npx playwright show-report
```

> Note: tests use a relative `baseURL` (`http://localhost:3000`), so the target app needs to be running locally for the tests to pass. `auth.json` is generated by the `setup` project on each run (it is gitignored).
