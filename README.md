# Simple Plotlines

Organize plotlines across acts by tagging scene notes with the plotlines they progress. Parses all files named `01-01 SCENE NAME.md` (capitalization and file locations up to user). Tag sorting can be specified in `00-00 TAG ORDER.md`.

![Demo of the plugin](/screenshots/demo.webm)

This plugin stores and reads all the information it needs in note titles and tags. Nothing is stored in a format that could be inconvenient for humans to maintain with vanilla Obsidian. Enabling the plugin causes its two views (elaboration below) to appear and vice versa. Simple!

<a href="https://www.buymeacoffee.com/nullmachine" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

---

## Plotline View

![Screenshot of the plotlines view](/screenshots/plotlines.png)

Tags found in scene notes are plotlines. Scene notes are identified by the plugin if they start with an act and scene identifier `##-##`. For example, the note for Act 4 Scene 3 would be named `04-03 SCENE NAME`. If that scene is tagged with `MAIN MYSTERY`, then it will appear in the plotline for that tag.

If the file `00-00 TAG ORDER` exists anywhere in the vault, only tags found in that file will be treated as plotlines, and be displayed in the order they appear in that file.

(The plugin might behave weirdly if multiple notes have the same act and scene, so don't do that...)

---

## Act Overview

![Screenshot of the act overview](/screenshots/act-overview.png)

Scenes appear as cards in this view. Dragging and dropping scene cards reorders them by renaming relevant scene files. It's also a nice and compact chronological view.

