import { initTransactions, addTransaction, updateTransaction, deleteTransaction, archiveMonth, exportToCSV, setFilterType, setSearchQuery, getTransactions } from "./transactions.js";
import { populateCategorySelect } from "./categories.js";
import { loadTheme, saveTheme } from "./storage.js";
import { showToast, showConfirm, toDateInputValue } from "./utils.js";
import { renderTransactions, openEditModal, closeEditModal, applyTheme } from "./ui.js";

function refresh() {
  renderTransactions(handleEdit, handleDelete);
}

function handleEdit(id) {
  const transaction = getTransactions().find((t) => t.id === id);
  if (!transaction) return;

  const type = openEditModal(transaction);
  populateCategorySelect(document.getElementById("edit-category"), type, transaction.category);
}

async function handleDelete(id) {
  const confirmed = await showConfirm("هل أنت متأكد من حذف هذه العملية؟");
  if (!confirmed) return;

  deleteTransaction(id);
  showToast("تم حذف العملية", "success");
  refresh();
}

function setupAddForm() {
  const form = document.getElementById("add-form");
  const typeSelect = document.getElementById("type");
  const categorySelect = document.getElementById("category");
  const dateInput = document.getElementById("date");

  dateInput.value = toDateInputValue(new Date());
  populateCategorySelect(categorySelect, typeSelect.value);

  typeSelect.addEventListener("change", () => {
    populateCategorySelect(categorySelect, typeSelect.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const desc = document.getElementById("desc").value;
    const amount = document.getElementById("amount").value;
    const type = typeSelect.value;
    const category = categorySelect.value;
    const dateStr = dateInput.value;

    if (!desc.trim() || Number(amount) <= 0) {
      showToast("من فضلك أدخل وصف ومبلغ صحيح", "error");
      return;
    }

    addTransaction({ desc, amount, type, category, dateStr });
    showToast("تمت إضافة العملية بنجاح", "success");

    form.reset();
    dateInput.value = toDateInputValue(new Date());
    populateCategorySelect(categorySelect, typeSelect.value);
    refresh();
  });
}

function setupEditForm() {
  const form = document.getElementById("edit-form");
  const typeSelect = document.getElementById("edit-type");
  const categorySelect = document.getElementById("edit-category");

  typeSelect.addEventListener("change", () => {
    populateCategorySelect(categorySelect, typeSelect.value);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-id").value;
    const desc = document.getElementById("edit-desc").value;
    const amount = document.getElementById("edit-amount").value;
    const type = typeSelect.value;
    const category = categorySelect.value;
    const dateStr = document.getElementById("edit-date").value;

    if (!desc.trim() || Number(amount) <= 0) {
      showToast("من فضلك أدخل وصف ومبلغ صحيح", "error");
      return;
    }

    updateTransaction(id, { desc, amount, type, category, dateStr });
    showToast("تم تحديث العملية", "success");
    closeEditModal();
    refresh();
  });

  document.getElementById("modal-cancel").addEventListener("click", closeEditModal);
  document.querySelector("#modal .modal-backdrop").addEventListener("click", closeEditModal);
}

function setupFilters() {
  document.querySelectorAll('#filter-container input[name="filter"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      setFilterType(e.target.value);
      refresh();
    });
  });

  document.getElementById("search").addEventListener("input", (e) => {
    setSearchQuery(e.target.value);
    refresh();
  });
}

function setupTheme() {
  let theme = loadTheme();
  applyTheme(theme);

  document.getElementById("theme-toggle").addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    saveTheme(theme);
    applyTheme(theme);
  });
}

function setupActions() {
  document.getElementById("archive-btn").addEventListener("click", async () => {
    if (getTransactions().length === 0) {
      showToast("لا توجد عمليات للأرشفة", "info");
      return;
    }

    const confirmed = await showConfirm(
      "هل تريد أرشفة عمليات هذا الشهر؟\nسيتم حفظها في الأرشيف وبدء شهر جديد.",
    );
    if (!confirmed) return;

    archiveMonth();
    showToast("تم أرشفة الشهر بنجاح", "success");
    refresh();
  });

  document.getElementById("export-btn").addEventListener("click", () => {
    if (getTransactions().length === 0) {
      showToast("لا توجد عمليات للتصدير", "info");
      return;
    }
    exportToCSV();
    showToast("تم تصدير الملف", "success");
  });
}

function init() {
  initTransactions();
  setupAddForm();
  setupEditForm();
  setupFilters();
  setupTheme();
  setupActions();
  refresh();
}

init();
