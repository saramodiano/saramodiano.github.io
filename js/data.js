/*
  ADD A NEW PROJECT HERE.
  Drop your images into images/work/, then add one object to PROJECTS below.
  It shows up as a new card automatically — no categories to sort into.

  Project fields:
    slug     - unique, url-safe id (used internally, not shown)
    title    - project name
    subtitle - short context line (season/year, or a one-line description)
    story    - a few sentences about the shoot, shown above the photos.
               Totally optional — leave it out (or set to "") and it just won't show.
    cover    - image shown on the project card
    items    - array of { src, title } for everything in the gallery
    draft    - set to true to hide this project from the live site entirely
               (card won't show). Delete this line, or set it to false, when
               it's ready to go public.

  To add a new TRAVEL destination, add one object to TRAVEL.destinations
  (see below) — you just need its name and approximate lat/lon, which you
  can get by right-clicking the place on Google Maps and copying the
  coordinates that appear. It can have a story (and draft) too.

  WRITING STORIES LATER: any `story` line that's commented out (starts with
  `//`) is just waiting for you — uncomment it and replace the text to make
  it appear on the site. Leaving it commented keeps it hidden.
*/

const PROJECTS = [
  {
    slug: "broadway-haven-fall-2026",
    title: "Broadway Haven Players",
    subtitle: "Fall Musical, 2026",
    draft: true, // no real photos added yet — delete this line when ready
    // story: "Write a few lines here about shooting this show — what the rehearsal room felt like, a moment from opening night, anything that stuck with you about this cast.",
    cover: "images/work/broadway-01.svg",
    items: [
      { src: "images/work/broadway-01.svg", title: "Broadway Haven Players — 01" },
      { src: "images/work/broadway-02.svg", title: "Broadway Haven Players — 02" },
      { src: "images/work/broadway-03.svg", title: "Broadway Haven Players — 03" },
      { src: "images/work/broadway-04.svg", title: "Broadway Haven Players — 04" },
      { src: "images/work/broadway-05.svg", title: "Broadway Haven Players — 05" },
      { src: "images/work/broadway-06.svg", title: "Broadway Haven Players — 06" },
    ],
  },
  {
    slug: "narrative-medicine-spring-2026",
    title: "Narrative Medicine",
    subtitle: "Spring 2026",
    draft: true, // no real photos added yet — delete this line when ready
    // story: "Write a few lines here about this project — what drew you to it, and what you were hoping to capture about where medicine and story meet.",
    cover: "images/work/narrative-medicine-01.svg",
    items: [
      { src: "images/work/narrative-medicine-01.svg", title: "Narrative Medicine — 01" },
      { src: "images/work/narrative-medicine-02.svg", title: "Narrative Medicine — 02" },
      { src: "images/work/narrative-medicine-03.svg", title: "Narrative Medicine — 03" },
      { src: "images/work/narrative-medicine-04.svg", title: "Narrative Medicine — 04" },
      { src: "images/work/narrative-medicine-05.svg", title: "Narrative Medicine — 05" },
    ],
  },
  {
    slug: "nyc",
    title: "NYC",
    subtitle: "Shot around the city, ongoing",
    // story: "Write a few lines here about this project — what you keep pointing the camera at around the city, and how it's changed since you started.",
    cover: "images/work/nyc-washington-square-chess.JPG",
    items: [
      { src: "images/work/nyc-washington-square-chess.JPG", title: "Washington Square Park Chess" },
      { src: "images/work/nyc-christopher-street.JPG", title: "39 Christopher Street" },
      { src: "images/work/nyc-laundry-day.JPG", title: "Laundry Day" },
      { src: "images/work/nyc-one-world-trade.JPG", title: "One World Trade" },
      { src: "images/work/nyc-02.JPG", title: "NYC — 02" },
    ],
  },
];

// Travel gets its own view: a world map you click into, instead of a plain grid.
const TRAVEL = {
  title: "Travel",
  subtitle: "Click a destination to see the shots",
  destinations: [
    {
      key: "tanzania",
      label: "Tanzania",
      lat: -6.369,
      lon: 34.889,
      // story: "Write a few lines here about this trip — what stood out, a moment that stuck with you.",
      items: [
        { src: "images/work/tanzania-01.JPG", title: "Tanzania — 01" },
        { src: "images/work/tanzania-02.JPG", title: "Tanzania — 02" },
        { src: "images/work/tanzania-03.JPG", title: "Tanzania — 03" },
        { src: "images/work/tanzania-04.JPG", title: "Tanzania — 04" },
        { src: "images/work/tanzania-05.JPG", title: "Tanzania — 05" },
        { src: "images/work/tanzania-06.JPG", title: "Tanzania — 06" },
        { src: "images/work/tanzania-07.JPG", title: "Tanzania — 07" },
        { src: "images/work/tanzania-08.JPG", title: "Tanzania — 08" },
        { src: "images/work/tanzania-09.JPG", title: "Tanzania — 09" },
        { src: "images/work/tanzania-10.JPG", title: "Tanzania — 10" },
        { src: "images/work/tanzania-11.JPG", title: "Tanzania — 11" },
        { src: "images/work/tanzania-12.JPG", title: "Tanzania — 12" },
        { src: "images/work/tanzania-13.JPG", title: "Tanzania — 13" },
      ],
    },
    {
      key: "france",
      label: "Nice, France",
      lat: 43.7102,
      lon: 7.262,
      // story: "Write a few lines here about this trip — what stood out, a moment that stuck with you.",
      items: [
        { src: "images/work/france-01.JPG", title: "Nice, France — 01" },
        { src: "images/work/france-02.jpeg", title: "Nice, France — 02" },
        { src: "images/work/france-peaches.JPG", title: "Peaches" },
      ],
    },
    {
      key: "copenhagen",
      label: "Copenhagen",
      lat: 55.6761,
      lon: 12.5683,
      // story: "Write a few lines here about this trip — what stood out, a moment that stuck with you.",
      items: [
        { src: "images/work/copenhagen-01.JPG", title: "Copenhagen — 01" },
        { src: "images/work/copenhagen-louisiana-museum.JPG", title: "Louisiana Museum" },
      ],
    },
    {
      key: "vietnam",
      label: "Vietnam",
      lat: 14.0583,
      lon: 108.2772,
      // story: "Write a few lines here about this trip — what stood out, a moment that stuck with you.",
      items: [
        { src: "images/work/vietnam-01.jpg", title: "Vietnam — 01" },
        { src: "images/work/vietnam-02.jpg", title: "Vietnam — 02" },
      ],
    },
    {
      key: "iceland",
      label: "Iceland",
      lat: 64.9631,
      lon: -19.0208,
      // story: "Write a few lines here about this trip — what stood out, a moment that stuck with you.",
      items: [
        { src: "images/work/iceland-01.JPG", title: "Iceland — 01" },
        { src: "images/work/iceland-02.JPG", title: "Iceland — 02" },
      ],
    },
  ],
};
