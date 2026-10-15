# Photography portfolio

Plain HTML/CSS/JS

## How the site is organized

Work is grouped by **project**. Everything lives in `js/data.js`.

### Adding a new project

1. Drop your images into `images/work/` (any names, e.g. `recital-01.jpg`).
2. Open `js/data.js` and add a new object to the `PROJECTS` array:
   ```js
   {
     slug: "spring-recital-2027",
     title: "Spring Recital",
     subtitle: "2027",
     cover: "images/work/recital-01.jpg",
     items: [
       { src: "images/work/recital-01.jpg", title: "Spring Recital — 01" },
       { src: "images/work/recital-02.jpg", title: "Spring Recital — 02" },
     ],
   },
   ```
3. Save, refresh — a new project card appears on the homepage automatically.
   No categories to pick, no build step.

To swap out a placeholder image, just replace the file it points to in
`images/work/` (keep the filename, or update the `src` in `data.js`).

### Adding a travel destination

Travel gets its own interactive map instead of a plain grid. To add a new
pin, add an object to `TRAVEL.destinations` in `js/data.js`:

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

Get `lat`/`lon` by right-clicking the place on Google Maps and copying the
coordinates it shows — that's the whole process, the pin positions itself.

### Editing the About bio, gear, or contact links

All in `index.html` — search for the `id="about"` and `id="contact"`
sections and edit the text directly.

## Running it locally

No install needed — any static file server works:

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## File structure

```
index.html         page structure
css/style.css       all styling, light/dark theme, animations
js/data.js          <- your projects, travel destinations & photos live here
js/main.js           project nav, map, lightbox, cursor, theme toggle
images/work/         your images
images/map/           the world map SVG used by the Travel view
```

The world map is `World map blank without borders.svg` by Crates
(Wikimedia Commons), CC BY-SA 4.0 — attribution is already in the page
footer of the Travel view. If you ever swap it for a different map, keep
an equirectangular (plain lat/lon grid) projection, since that's what the
pin math in `main.js` assumes.
