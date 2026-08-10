const Parser = require("rss-parser");
const crypto = require("crypto");
const sources = require("./sources");
const { categorize } = require("./categorize");

const parser = new Parser({ timeout: 15000 });

function hashId(url) {
  return crypto.createHash("sha1").update(url).digest("hex").slice(0, 16);
}

function shortSnippet(item) {
  const raw = (item.contentSnippet || item.summary || "").replace(/\s+/g, " ").trim();
  return raw.length > 200 ? raw.slice(0, 200).trim() + "…" : raw;
}

function matchesKeywords(item) {
  const text = `${item.title || ""} ${item.contentSnippet || item.summary || ""}`.toLowerCase();
  return sources.keywords.some(k => text.includes(k.toLowerCase()));
}

async function fetchSource(source) {
  try {
    const feed = await parser.parseURL(source.url);
    return feed.items
      .filter(item => source.local || matchesKeywords(item))
      .map(item => ({
        id: hashId(item.link || item.guid || item.title),
        category: categorize(item),
        headline: (item.title || "").trim(),
        snippet: shortSnippet(item),
        sourceName: source.name,
        sourceURL: item.link,
        publishedAt: item.isoDate || new Date().toISOString(),
      }));
  } catch (err) {
    console.warn(`[fetcher] skipped "${source.name}": ${err.message}`);
    return [];
  }
}

async function fetchAll() {
  const results = await Promise.all(sources.map(fetchSource));
  const merged = results.flat();

  const byId = new Map();
  for (const article of merged) {
    if (!byId.has(article.id)) byId.set(article.id, article);
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
}

module.exports = { fetchAll };
