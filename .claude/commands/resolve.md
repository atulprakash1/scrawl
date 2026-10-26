---
description: Pick up a Scrawl item, implement it on a branch, open a PR, and move it to review
argument-hint: <item number>
---
Resolve Scrawl item #$ARGUMENTS, following the "Scrawl work tracking" rules in CLAUDE.md.
Never commit to or push `main`. The user merges PRs on GitHub.

1. Sync: `sh .scrawl/hooks/scrawl-sync`. This pulls merged PRs from GitHub into `main` and saves the
   board (its own `scrawl-board` branch). If it prints a warning, tell me.
2. Find the item file: `.scrawl/items/` file whose name starts with the number padded to 4 digits
   (e.g. #42 → `0042-*.md`). Read it fully, including Activity comments from `me`.
   Open every file it links under `.scrawl/attachments/<id>/` (screenshots, samples, logs).
   If it has a `parent`, skim the parent item's Description for context.
   **If it is a feature, follow "Resolving a feature" below instead of steps 3-8.**
3. Pick it up: set `status: doing`, `assignee: claude`, update `updated:`, append an Activity line
   (`· claude · Picked up on branch scrawl/$ARGUMENTS-<slug>. <one-line plan>`). Save the file, then
   `git switch -c scrawl/$ARGUMENTS-<slug> main` (short slug from the title). The board isn't on any
   code branch, so switching never touches it.
   If the Acceptance section is empty, write 2-5 `- [ ]` criteria that follow from the Description,
   append `· claude · Added acceptance criteria; correct them at review if I guessed wrong.`, and carry on.
4. Make a short plan, then implement. Keep scope to the Description and Acceptance criteria.
   Anything else you notice becomes a new item, not extra work.
5. Verify: run the tests if the project has them, otherwise check the acceptance criteria by hand.
   If you can't make it work, append an Activity line explaining why, leave it in `doing`, and stop
   (still do steps 7-8 with whatever is committed).
6. Finish the item: tick the acceptance boxes you verified, append a 1-3 sentence summary Activity
   line, set `status: review`, update `updated:`. Never set `resolved` or `done`.
7. Commit the code only (never `.scrawl/`) with the message `#$ARGUMENTS <summary>`. Push the branch:
   `git push -u origin scrawl/$ARGUMENTS-<slug>`.
   Open the PR: `gh pr create --base main --title "#$ARGUMENTS <summary>" --body "<what and why, how verified>"`.
8. Append an Activity line with the PR link (`· claude · PR: <url>`), then `git switch main` and
   `sh .scrawl/hooks/scrawl-sync` to save the board.

## Resolving a feature

A feature is done as a whole: all its stories on one branch, one commit per story, one PR.

F1. Collect the stories: items with `parent: $ARGUMENTS` whose status is not `proposed`, `done`,
    `resolved` or `wontfix`. Skip proposed ones (the user hasn't accepted them); mention them at the end.
    Stories already in `review` were finished by an earlier run: leave them as they are.
F2. Nothing to do from F1? Look at all of its stories before creating any:
    - Some are `done` or `resolved` and none are open: the work is finished. Tell me (the feature
      may just need accepting) and stop.
    - Only proposed ones: tell me to accept or reject them in the Plan view, and stop.
    - None at all (ignoring `wontfix`): split the feature into the stories it needs and create them
      (template and `nextId` rules in CLAUDE.md) with `status: ready`, `assignee: claude`,
      `parent: $ARGUMENTS`, a `size`, 2-5 acceptance boxes and the Activity line
      `· claude · Created by /resolve $ARGUMENTS`. If it needs more than 6 new stories, don't create
      them: list the split you'd make, ask me, and stop. It's probably two features.
F3. Pick up the feature as in step 3 (fill its acceptance if empty), on branch
    `scrawl/$ARGUMENTS-<slug>`. If that branch already exists (an earlier run stopped halfway),
    switch to it instead of creating it.
F4. For each story, in rank order (no rank last, then lowest id):
    pick it up as in step 3 but stay on the feature's branch (say so in the Activity line, and fill
    its acceptance if empty), implement and verify it as in steps 4-5, finish it as in step 6, then
    commit with the message `#<story id> <summary>` and push
    (`git push -u origin scrawl/$ARGUMENTS-<slug>`). Pushing after every story means a rerun of
    `/resolve $ARGUMENTS` picks up where this one stopped.
    If a story can't be made to work, or you have to stop (e.g. usage limits): leave that story and the
    feature in `doing`, append an Activity line to the feature saying which stories are done and where
    you stopped, push, `git switch main`, sync, and stop. Don't open the PR yet.
F5. When every story is in `review`: tick the feature's acceptance boxes you verified, append a summary
    Activity line and set it to `review`. Open one PR whose title starts with every id, feature first:
    `gh pr create --base main --title "#$ARGUMENTS #<story> #<story> <summary>" --body "<per story: what and how verified>"`.
    (A squash merge keeps only the title, so every id has to be in it for the cards to ship.)
F6. Append `· claude · PR: <url>` to the feature and to each of its stories, then `git switch main`
    and `sh .scrawl/hooks/scrawl-sync` to save the board.
