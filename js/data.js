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

  To add a new TRAVEL destination, add one object to TRAVEL.destinations
  (see below) — you just need its name and approximate lat/lon, which you
  can get by right-clicking the place on Google Maps and copying the
  coordinates that appear. It can have a story too.
*/

const PROJECTS = [
  {
    slug: "broadway-haven-fall-2026",
    title: "Broadway Haven Players",
    subtitle: "Fall Musical, 2026",
    story: "Write a few lines here about shooting this show — what the rehearsal room felt like, a moment from opening night, anything that stuck with you about this cast.",
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
    story: "Write a few lines here about this project — what drew you to it, and what you were hoping to capture about where medicine and story meet.",
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
    story: "Write a few lines here about this project — what you keep pointing the camera at around the city, and how it's changed since you started.",
    cover: "images/work/nyc-01.svg",
    items: [
      { src: "images/work/nyc-01.svg", title: "NYC — 01" },
      { src: "images/work/nyc-02.svg", title: "NYC — 02" },
      { src: "images/work/nyc-03.svg", title: "NYC — 03" },
      { src: "images/work/nyc-04.svg", title: "NYC — 04" },
      { src: "images/work/nyc-05.svg", title: "NYC — 05" },
      { src: "images/work/nyc-06.svg", title: "NYC — 06" },
      { src: "images/work/nyc-07.svg", title: "NYC — 07" },
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
      story: "Write a few lines here about this trip — what stood out, a moment that stuck with you.",
      items: [
        { src: "images/work/travel-tanzania-01.svg", title: "Tanzania — 01" },
        { src: "images/work/travel-tanzania-02.svg", title: "Tanzania — 02" },
        { src: "images/work/travel-tanzania-03.svg", title: "Tanzania — 03" },
        { src: "images/work/travel-tanzania-04.svg", title: "Tanzania — 04" },
        { src: "images/work/travel-tanzania-05.svg", title: "Tanzania — 05" },
        { src: "images/work/travel-tanzania-06.svg", title: "Tanzania — 06" },
      ],
    },
    {
      key: "france",
      label: "France",
      lat: 46.2276,
      lon: 2.2137,
      story: "Write a few lines here about this trip — what stood out, a moment that stuck with you.",
      items: [
        { src: "images/work/travel-france-01.svg", title: "France — 01" },
        { src: "images/work/travel-france-02.svg", title: "France — 02" },
        { src: "images/work/travel-france-03.svg", title: "France — 03" },
        { src: "images/work/travel-france-04.svg", title: "France — 04" },
        { src: "images/work/travel-france-05.svg", title: "France — 05" },
        { src: "images/work/travel-france-06.svg", title: "France — 06" },
      ],
    },
  ],
};
