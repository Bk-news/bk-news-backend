require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { fetchAll } = require("./fetcher");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

let cache = {
  articles: [],
  lastUpdated: null,
  lastError: null,
};

async function refresh() {
  try {
    const articles = await fetchAll();
    cache = { articles, lastUpdated: new Date().toISOString(), lastError: null };
    console.log(`[refresh] ${articles.length} articles at ${cache.lastUpdated}`);
  } catch (err) {
    cache.lastError = err.message;
    console.error("[refresh] failed:", err.message);
  }
}

app.get("/v1/feed", (req, res) => {
  const { category } = req.query;
  const articles = category
    ? cache.articles.filter(a => a.category === category)
    : cache.articles;
  res.json(articles);
});

app.get("/v1/status", (req, res) => {
  res.json({
    lastUpdated: cache.lastUpdated,
    articleCount: cache.articles.length,
    lastError: cache.lastError,
  });
});

app.get("/v1/refresh", async (req, res) => {
  await refresh();
  res.json({ ok: true, lastUpdated: cache.lastUpdated });
});

app.listen(PORT, async () => {
  console.log(`BK.News backend running on :${PORT}`);
  await refresh();
  cron.schedule("* * * * *", refresh);
});
