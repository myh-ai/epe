# Escaping Planet Earth

A personal literary blog — intimate neo-noir essays on AI, memory, cinema, love, and the human soul.
Built with Jekyll for GitHub Pages. Lives at **https://myh-ai.github.io/epe**.

---

## Deploy from the GitHub website (no terminal needed)

1. **Create the repository.** On GitHub, click **New repository**. Name it exactly **`epe`** (lowercase — the site URL and `baseurl` depend on it). Make it **Public**. Don't add a README. Click **Create repository**.

2. **Upload the files.** On the empty repo page, click **uploading an existing file**. Drag in *everything inside this folder* — `_config.yml`, the `_layouts`, `_includes`, `_data`, `posts`, and `assets` folders, plus `index.html`, the `.md` pages, `feed.xml`, and `404.html`. (Drag the **contents**, not the folder itself.) Scroll down and click **Commit changes**.

3. **Turn on Pages.** Go to **Settings → Pages**. Under **Build and deployment → Source**, choose **Deploy from a branch**. Set the branch to **`main`** and the folder to **`/ (root)`**. Click **Save**.

4. **Wait ~1–2 minutes**, then visit **https://myh-ai.github.io/epe/**. (The first build can take a couple of minutes. Refresh if needed.)

> If you'd rather use a capital **`EPE`** repo name, that's fine — just open `_config.yml` and change `baseurl: "/epe"` to `baseurl: "/EPE"` to match. The two must agree.

Your existing academic site at `myh-ai.github.io` is untouched — this is a separate project site under `/epe`.

---

## Adding or editing a post

Each post is a folder in `posts/`, holding an `index.md` and its images:

```
posts/my-new-essay/
  index.md
  cover.jpg          (optional)
```

Front-matter:

```yaml
---
title: "My New Essay"
date: 2026-07-01 21:00:00 +0300
category: "Memory"            # the small badge on the card/post
worlds: [memory, nostalgia]   # finer sub-tags (see _data/tags.yml)
subtitle: "An optional italic subtitle"
mood: "A single cinematic line of atmosphere."   # optional, shown under the title
excerpt: "The first sentence or two — shown on cards and in the feed."
cover: cover.jpg              # omit + add `no_cover: true` for no hero image
featured: true               # optional — pins it as the homepage feature
---

Body in Markdown. Use `## Heading` for sections.
Images: ![caption](photo-1.jpg)
Pull quote: <div class="pull">A line worth <span>enlarging</span>.</div>
```

For a **video** instead of a cover, set `no_cover: true` and put this at the top of the body:

```html
<figure class="embed">
  <div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"
       title="" loading="lazy" allowfullscreen></iframe></div>
  <figcaption>Optional caption</figcaption>
</figure>
```

The homepage, Worlds page, Archive, RSS feed, and the previous/next + "More from this world" links all update themselves automatically.

---

## How the "Worlds" work

There are **six rooms**, defined in `_data/worlds.yml`. Each room gathers several finer labels via its `tags:` list. A post's `worlds:` array holds those finer labels (e.g. `memory`, `music`) — they show as small sub-tags on the post and decide which room(s) it appears in. Finer-label display names live in `_data/tags.yml`.

To add a new room: add an entry to `_data/worlds.yml` with a `slug`, `title`, `blurb`, and the `tags` it should contain.

---

## Notes

- The **featured** essay on the homepage is whichever post has `featured: true` (otherwise the newest).
- Four cover-less essays use bespoke abstract **`cover.svg`** art (e.g. `posts/death/cover.svg`) — edit or swap them freely.
- Background ambient audio is at `assets/audio/ambient.mp3`, off until the visitor turns it on (`preload="none"`, so it never downloads unasked).
- A reading-progress bar runs along the top of every page.
- All colors and fonts (design tokens, including the warm `--lamp` and `--rose` accents) live at the top of `assets/css/main.css`.
