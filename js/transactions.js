import {
  loadTransactions,
  saveTransactions,
  loadArchives,
  saveArchives,
  migrateTransaction,
} from "./storage.js";
import {
  generateId,
  formatDateTime,
  parseDateInput,
  toDateInputValue,
} from "./utils.js";

let transactions = [];
let filterType = "all";
let searchQuery = "";

export function getTransactions() {
  return transactions;
}

export function getFilterType() {
  return filterType;
}

export function setFilterType(type) {
  filterType = type;
}

export function getSearchQuery() {
  return searchQuery;
}

export function setSearchQuery(query) {
  searchQuery = query.trim().toLowerCase();
}

export function initTransactions() {
  transactions = loadTransactions().map(migrateTransaction);
  if (transactions.length) saveTransactions(transactions);
}

export function getFilteredTransactions() {
  return transactions.filter((t) => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (searchQuery && !t.desc.toLowerCase().includes(searchQuery)) return false;
    return true;
  });
}

export function calculateStats() {
  let income = 0;
  let expense = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense, savings: income - expense };
}

export function addTransaction({ desc, amount, type, category, dateStr }) {
  const date = parseDateInput(dateStr);
  const transaction = {
    id: generateId(),
    desc: desc.trim(),
    amount: Number(amount),
    type,
    category,
    date: dateStr || toDateInputValue(date),
    dateTime: formatDateTime(date),
  };
  transactions.unshift(transaction);
  saveTransactions(transactions);
  return transaction;
}

export function updateTransaction(id, { desc, amount, type, category, dateStr }) {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const date = parseDateInput(dateStr);
  transactions[index] = {
    ...transactions[index],
    desc: desc.trim(),
    amount: Number(amount),
    type,
    category,
    date: dateStr,
    dateTime: formatDateTime(date),
  };
  saveTransactions(transactions);
  return transactions[index];
}

export function deleteTransaction(id) {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return false;
  transactions.splice(index, 1);
  saveTransactions(transactions);
  return true;
}

export function archiveMonth() {
  if (transactions.length === 0) return null;

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const stats = calculateStats();

  const archive = {
    month: monthKey,
    archivedAt: now.toISOString(),
    transactions: [...transactions],
    stats,
  };

  const archives = loadArchives();
  archives.unshift(archive);
  saveArchives(archives);

  transactions = [];
  saveTransactions(transactions);
  return archive;
}

export function exportToCSV() {
  const headers = ["الوصف", "المبلغ", "النوع", "التصنيف", "التاريخ"];
  const rows = transactions.map((t) => [
    t.desc,
    t.amount,
    t.type === "income" ? "دخل" : "مصروف",
    t.category,
    t.date,
  ]);

  const bom = "\uFEFF";
  const csv =
    bom +
    [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `wallet-${toDateInputValue(new Date())}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
