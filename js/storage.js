const KEYS = {
  transactions: "transactions",
  archives: "archives",
  theme: "theme",
};

export function loadTransactions() {
  const raw = localStorage.getItem(KEYS.transactions);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTransactions(transactions) {
  localStorage.setItem(KEYS.transactions, JSON.stringify(transactions));
}

export function loadArchives() {
  const raw = localStorage.getItem(KEYS.archives);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveArchives(archives) {
  localStorage.setItem(KEYS.archives, JSON.stringify(archives));
}

export function loadTheme() {
  return localStorage.getItem(KEYS.theme) || "light";
}

export function saveTheme(theme) {
  localStorage.setItem(KEYS.theme, theme);
}

export function migrateTransaction(t) {
  return {
    id: t.id || crypto.randomUUID(),
    desc: t.desc || "",
    amount: Number(t.amount) || 0,
    type: t.type === "income" ? "income" : "expense",
    category: t.category || "other",
    date: t.date || new Date().toISOString().slice(0, 10),
    dateTime: t.dateTime || "",
  };
}
