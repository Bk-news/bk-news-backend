const MBS_WORDS = [
  "mohammed bin salman", "mbs", "crown prince",
  "محمد بن سلمان", "ولي العهد", "بن سلمان"
];

const BREAKING_WORDS = [
  "breaking", "just in", "urgent", "developing",
  "عاجل", "للتو", "الآن"
];

const ARTICLE_HINTS = ["opinion", "analysis", "comment", "رأي", "تحليل", "مقال"];

const POLITICS_ECON_WORDS = [
  "سياسة", "سياسي", "الحكومة", "الوزراء", "مجلس الوزراء", "دبلوماسي",
  "اقتصاد", "اقتصادي", "النفط", "الميزانية", "الاستثمار", "سوق الأسهم",
  "تجارة", "الناتج المحلي", "التضخم", "صندوق النقد", "أرامكو",
  "politics", "political", "government", "minister", "cabinet", "diplomat",
  "economy", "economic", "budget", "investment", "oil", "trade", "gdp",
  "inflation", "stock market", "aramco", "finance", "central bank"
];

function isPoliticsOrEconomy(item) {
  const text = textOf(item);
  const categories = (item.categories || []).join(" ").toLowerCase();
  const path = (item.link || "").toLowerCase();
  return (
    POLITICS_ECON_WORDS.some(w => text.includes(w) || categories.includes(w)) ||
    path.includes("/politics/") || path.includes("/economy/") || path.includes("/business/")
  );
}

function textOf(item) {
  return `${item.title || ""} ${item.contentSnippet || item.summary || ""}`.toLowerCase();
}

function isFreshEnoughToBeBreaking(item) {
  if (!item.isoDate) return false;
  const ageMinutes = (Date.now() - new Date(item.isoDate).getTime()) / 60000;
  return ageMinutes <= 30;
}

function categorize(item) {
  const text = textOf(item);
  const categories = (item.categories || []).join(" ").toLowerCase();

  if (BREAKING_WORDS.some(w => text.includes(w)) && isFreshEnoughToBeBreaking(item)) {
    return "breaking";
  }
  if (MBS_WORDS.some(w => text.includes(w))) {
    return "mbs";
  }
  if (ARTICLE_HINTS.some(w => text.includes(w) || categories.includes(w))) {
    return "article";
  }
  return "saudi";
}

module.exports = { categorize, isPoliticsOrEconomy };
