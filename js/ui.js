import {
  getFilteredTransactions,
  calculateStats,
  getTransactions,
} from "./transactions.js";
import { getCategoryLabel } from "./categories.js";
import { formatAmount } from "./utils.js";

export function renderDashboard() {
  const { income, expense, balance } = calculateStats();

  document.getElementById("balance").textContent = `${formatAmount(balance)} ريال`;
  document.getElementById("total-income").textContent = formatAmount(income);
  document.getElementById("total-expense").textContent = formatAmount(expense);
  document.getElementById("total-savings").textContent = formatAmount(balance);
}

export function renderTransactions(onEdit, onDelete) {
  const list = document.getElementById("transactions");
  const emptyState = document.getElementById("empty-state");
  const filtered = getFilteredTransactions();
  const all = getTransactions();

  list.innerHTML = "";

  if (all.length === 0) {
    emptyState.classList.remove("hidden");
    list.classList.add("hidden");
    renderDashboard();
    return;
  }

  emptyState.classList.add("hidden");
  list.classList.remove("hidden");

  if (filtered.length === 0) {
    const li = document.createElement("li");
    li.className = "no-results";
    li.style.textAlign = "center";
    li.style.color = "var(--text-muted)";
    li.style.cursor = "default";
    li.textContent = "لا توجد نتائج مطابقة";
    list.appendChild(li);
    renderDashboard();
    return;
  }

  filtered.forEach((t) => {
    const li = document.createElement("li");
    li.className = t.type;

    li.innerHTML = `
      <div class="meta">
        <b>${escapeHtml(t.desc)}</b>
        <small>${escapeHtml(t.dateTime)}</small>
        <span class="category-tag">${escapeHtml(getCategoryLabel(t.category))}</span>
      </div>
      <div class="action-group">
        <span class="amount">${t.type === "income" ? "+" : "-"}${formatAmount(t.amount)}</span>
        <button class="delete-btn" title="حذف" aria-label="حذف">×</button>
      </div>
    `;

    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete(t.id);
    });

    li.addEventListener("click", () => onEdit(t.id));

    list.appendChild(li);
  });

  renderDashboard();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

export function openEditModal(transaction) {
  const modal = document.getElementById("modal");
  document.getElementById("edit-id").value = transaction.id;
  document.getElementById("edit-desc").value = transaction.desc;
  document.getElementById("edit-amount").value = transaction.amount;
  document.getElementById("edit-type").value = transaction.type;
  document.getElementById("edit-date").value = transaction.date;
  modal.classList.remove("hidden");
  return transaction.type;
}

export function closeEditModal() {
  document.getElementById("modal").classList.add("hidden");
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const btn = document.getElementById("theme-toggle");
  btn.textContent = theme === "dark" ? "☀️" : "🌙";
  btn.title = theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن";
}
