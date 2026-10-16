# Editing this site

Everything below is editing only — the site is already live. After any
change: save, then `git add -A && git commit -m "..."  && git push`.

## Add a project

In `js/data.js`, add an object to `PROJECTS`:

```js
{
  slug: "spring-recital-2027",
  title: "Spring Recital",
  subtitle: "2027",
  cover: "images/work/recital-01.jpg",
  items: [
    { src: "images/work/recital-01.jpg", title: "Spring Recital — 01" },
  ],
},
```

Drop the matching photo(s) into `images/work/` first. A `story` field
(a sentence or two) is optional and shows above the photos.

## Add a travel destination

In `js/data.js`, add an object to `TRAVEL.destinations`:

```js
{
  key: "japan",
  label: "Japan",
  lat: 36.2048,
  lon: 138.2529,
  items: [
    { src: "images/work/japan-01.jpg", title: "Japan — 01" },
  ],
},
```

Get `lat`/`lon` by right-clicking the place on Google Maps.

## Swap a photo

Replace the file in `images/work/`, keeping the same filename — or change
the `src` path in `js/data.js` to point at a new file.

## Edit text (bio, contact, hero)

All in `index.html` — just edit the words between the tags. The About and
Contact sections are near the bottom, marked `<!-- EDIT ME -->`.

## Preview changes before pushing

```bash
python3 -m http.server 4173
```

Open http://localhost:4173.

---
Map on the Travel page: "World map blank without borders" by Crates
(Wikimedia Commons), CC BY-SA 4.0.
