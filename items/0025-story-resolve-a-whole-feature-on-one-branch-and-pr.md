---
id: 25
type: story
title: Resolve a whole feature on one branch and PR
status: ready
assignee: claude
size: M
labels: [workflow]
created: 2026-10-26T16:20
updated: 2026-10-26T16:20
---
## Description
When `/resolve` or `/next` picks up a feature, Claude does all of its stories on one branch `scrawl/<feature id>-<slug>` and opens one PR. It also fills in missing acceptance criteria and creates missing stories instead of stopping.

- Children are items with `parent: <feature>` that aren't done, wontfix or proposed. Proposed children are skipped (not yet accepted).
- Each story in rank order: `doing` → one commit `#N ...` → `review` with a summary line. Commit and push after each story, so a rerun of `/resolve <feature>` picks up where it stopped (it skips stories already in review).
- One PR at the end. Its title starts with every id (`#3 #4 #5 Title`), so a squash merge ships every card. All cards get the PR link, and the feature goes to `review`.
- If the work stops halfway, push the branch, leave the feature in `doing` with a note saying where it stopped, and don't open the PR yet.
- Empty Acceptance on any item being resolved: write 2-5 criteria from the description, note "Added acceptance criteria" in Activity, and carry on.
- Feature with no stories: create the stories it needs (`parent`, `size`, acceptance, Activity "Created by /resolve #N"), then implement them. If it needs more than 6 new stories, stop and ask first: it's probably two features.
- A single story is resolved exactly as today.

Change `.claude/commands/resolve.md`, `next.md` and the CLAUDE.md protocol, then run `node tools/bundle.mjs` so the Hook up Claude templates carry the new rules.

## Acceptance
- [ ] Resolving a feature implements all its non-proposed open stories on one branch with one commit per story
- [ ] One PR at the end, titled with every id, and every card in review with the PR link
- [ ] Missing acceptance criteria are filled in and work continues
- [ ] A feature with no stories gets them created (and stops to ask if more than 6 are needed)
- [ ] templates.js is regenerated with the new rules

## Activity
- 2026-10-26 16:20 · claude · Created from the feature-workflow assessment. Decisions from me: skip proposed children; stop and ask above 6 new stories.
