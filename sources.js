/**
 * sources.js
 * -----------------------------------------------------------------------
 * Two kinds of sources:
 *
 *  1) local: true   → Saudi outlets. Everything they publish is in-scope,
 *     no keyword filtering needed (per the brief: "محلية بس، على مستوى
 *     العالم كله" was about the INTERNATIONAL ones — local ones are
 *     already 100% Saudi-focused).
 *
 *  2) local: false  → international / intelligence-style outlets. These
 *     publish about everything, so fetcher.js keyword-filters their
 *     items down to ones that actually mention Saudi Arabia or MBS
 *     before they're stored.
 *
 * NOTE ON COVERAGE: Axios and Bloomberg have working public feeds and are
 * included below. Tactical Report and Asharq News don't — see the notes
 * near the bottom of this list for how to add them once you have access.
 *
 * VERIFY BEFORE RELYING ON THIS LIST: RSS paths on these sites do change.
 * Run `npm run dev` and check the console warnings — any feed that 404s
 * or fails to parse gets logged and skipped automatically, it won't crash
 * the server.
 */

module.exports = [
  // ---- Saudi local outlets (verified working RSS URLs) ----
  { name: "Okaz", local: true,
    url: "https://www.okaz.com.sa/rssFeed/190" },
  { name: "Al Eqtisadiah", local: true,
    url: "https://www.aleqt.com/feed/rss_section/frontpage" },
  { name: "Al Watan", local: true,
    url: "https://www.alwatan.com.sa/rssFeed/45" },
  { name: "Makkah", local: true,
    url: "https://makkahnewspaper.com/rssFeed/0" },
  { name: "Arab News", local: true,
    url: "https://www.arabnews.com/rss.xml" },
  { name: "Asharq Al-Awsat", local: true,
    url: "https://aawsat.com/feed" },
  { name: "Al Yaum", local: true,
    url: "https://www.alyaum.com/rssFeed/1" },

  // ---- International / wire outlets (keyword-filtered to Saudi/MBS) ----
  { name: "Al Jazeera English", local: false,
    url: "https://www.aljazeera.com/xml/rss/all.xml" },
  { name: "Al Arabiya (Top Stories, Intl)", local: false,
    url: "https://english.alarabiya.net/feed/rss2/en.xml" },
  { name: "Axios", local: false,
    url: "https://api.axios.com/feed/" },
  { name: "Bloomberg (Politics)", local: false,
    url: "https://www.bloomberg.com/politics/feeds/site.xml" },

  // ---- No public RSS found — add manually if you get a feed URL ----
  // "الشرق" / Asharq News (asharq.com) doesn't publish a public RSS feed as
  // of writing. A workaround: a service like rss.app can auto-generate an
  // unofficial feed from their site for a few dollars/month — if you want
  // that, sign up there, paste the generated URL below, local:false.
  // { name: "Asharq News", local: false, url: "PASTE_GENERATED_FEED_URL_HERE" },

  // ---- Subscription-only — add your own feed URL once subscribed ----
  // Tactical Report's "Market Intelligence Feed" is a paid subscription
  // (MENA defense/security intel). Once you subscribe they issue a private
  // RSS URL just for your account — paste it below to wire it in:
  // { name: "Tactical Report", local: false, url: "PASTE_YOUR_PRIVATE_FEED_URL_HERE" },
];

module.exports.keywords = [
  "saudi", "ksa", "riyadh", "jeddah", "mecca", "medina", "neom",
  "mohammed bin salman", "mbs", "crown prince",
  "السعودية", "الرياض", "جدة", "مكة", "المدينة", "نيوم",
  "محمد بن سلمان", "ولي العهد", "بن سلمان"
];
