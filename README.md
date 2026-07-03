# Simple Plotlines

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/null_machine)

https://community.obsidian.md/plugins/simple-plotlines

Organize plotlines across acts by tagging scene notes with the plotlines they progress. Parses all files named `01-01 SCENE NAME.md` (capitalization and file locations up to user). Tag sorting can be specified in `00-00 TAG ORDER.md`.

This plugin stores and reads all the information it needs in note titles and tags. Nothing is stored in a format that could be inconvenient for humans to maintain with vanilla Obsidian. Enabling the plugin causes its two views (elaboration below) to appear and vice versa. Simple!

https://github.com/user-attachments/assets/d8c9b9c2-8c9d-49ca-aa96-a1f53e448c32

---

## Plotline View

![Screenshot of the plotlines view](/screenshots/plotlines.png)

Tags found in scene notes are plotlines. Scene notes are identified by the plugin if they start with an act and scene identifier `##-##`. For example, the note for Act 4 Scene 3 would be named `04-03 SCENE NAME`. If that scene is tagged with `MAIN MYSTERY`, then it will appear in the plotline for that tag.

If the file `00-00 TAG ORDER` exists anywhere in the vault, only tags found in that file will be treated as plotlines, and be displayed in the order they appear in that file.

---

## Act Overview

![Screenshot of the act overview](/screenshots/act-overview.png)

Scenes appear as cards in this view. Dragging and dropping scene cards reorders them by renaming relevant scene files. It's also a nice chronological view.

---

## FAQ

#### Q: How do I get started?
A: Check out this clip on how to create a scene in a fresh vault:

https://github.com/user-attachments/assets/5e93b6ec-6245-4f03-8362-02acba678522

#### Q: Why not use XYZ?
A: You may. I want a minimal feature set. I also happen to enjoy writing coding by hand as a hobby. If I'm going to spend ages running a TTRPG campaign or taking notes on a story, it's worthwhile to me to spend some time making my tools work exactly the way I want them to.

#### Q: Does this work on mobile?
A: It might, but the views might be awkward and drag and drop will probably not work. Renaming and tagging notes are vanilla Obsidian features on both desktop and mobile, which is all that is necessary to create scenes that are recognized by the plugin. If your vault is synced between mobile and desktop, you can have the plugin only enabled on desktop, and changes you make on mobile will render perfectly fine once they're synced back to desktop. That being said, I left the plugin capable of being enabled on mobile in case you use a tablet with a mouse or something.

#### Q: Could you fix this bug I found or add these features?
A: Open an [issue](https://github.com/null-machine/simple-plotlines/issues) or [pull request](https://github.com/null-machine/simple-plotlines/pulls)!

#### Q: What happens if two notes have the same act and scene?
A: The views will look weird, but nothing bad will happen to your files. Either way, don't do that... If you want to insert a scene in the middle of an act, give it an unused act-scene name, and then use the act overview to drag and drop it where you want. The plugin will rename all relevant scenes for you. (Or rename everything by hand, the plugin sure won't stop you.)

#### Q: I like your plugin! Can I support you?
A: You shall have my eternal gratitude: https://ko-fi.com/null_machine



