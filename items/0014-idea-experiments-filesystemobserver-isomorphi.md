---
id: 14
type: feature
title: Experiments: FileSystemObserver, isomorphic-git, AGENTS.md
status: done
assignee: claude
rank: n
labels: [phase-4]
created: 2026-10-25T13:30
updated: 2026-10-27T00:24
shipped: a6d122b
---
## Description
Replace polling with FileSystemObserver where available; read `.git` directly; share the protocol with other LLM tools via AGENTS.md; recent-projects list.

## Acceptance
- [x] Live updates (#45), AGENTS.md (#46) and recent projects (#47) are built
- [x] Reading .git with isomorphic-git is left out; the git hooks keep doing that job

## Activity
- 2026-10-25 13:30 · claude · Created from the plan
- 2026-10-26 23:48 · me · Handed to Claude (Claude's tray)
- 2026-10-27 00:10 · claude · Assessed the experiments: FileSystemObserver, AGENTS.md and a recent-projects list earn it; isomorphic-git does not (a heavy library for what the hooks already provide). Agreed with me to build the three, so this idea becomes a feature.
- 2026-10-27 00:10 · claude · Picked up on branch scrawl/14-experiments, as a whole feature. Created stories #45-#47 and will do them in order.
- 2026-10-27 00:17 · claude · Done as a whole feature on scrawl/14-experiments: #45 live updates with FileSystemObserver, #46 AGENTS.md from Hook up Claude, #47 recent projects, one commit each. isomorphic-git left out as agreed.
- 2026-10-27 00:17 · claude · PR: https://github.com/atulprakash1/scrawl/pull/21
- 2026-10-27 00:24 · scrawl · Shipped: a6d122b is on main
