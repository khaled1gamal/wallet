export const CATEGORIES = {
  salary: { label: "راتب", types: ["income"], icon: "💼" },
  investment: { label: "استثمار", types: ["income"], icon: "📈" },
  food: { label: "طعام", types: ["expense"], icon: "🍔" },
  transport: { label: "مواصلات", types: ["expense"], icon: "🚗" },
  bills: { label: "فواتير", types: ["expense"], icon: "💡" },
  entertainment: { label: "ترفيه", types: ["expense"], icon: "🎮" },
  health: { label: "صحة", types: ["expense"], icon: "🏥" },
  education: { label: "تعليم", types: ["expense"], icon: "🎓" },
  savings: { label: "ادخار", types: ["expense"], icon: "💰" },
  gifts: { label: "هدايا", types: ["expense"], icon: "🎁" },
  other: { label: "أخرى", types: ["income", "expense"], icon: "📦" },
};

export function getCategoriesForType(type) {
  return Object.entries(CATEGORIES)
    .filter(([, cat]) => cat.types.includes(type))
    .map(([id, cat]) => ({ id, ...cat }));
}

export function getCategoryLabel(categoryId) {
  const cat = CATEGORIES[categoryId];
  return cat ? `${cat.icon} ${cat.label}` : categoryId;
}

export function populateCategorySelect(selectEl, type, selectedId = "other") {
  const options = getCategoriesForType(type);
  selectEl.innerHTML = options
    .map(
      (cat) =>
        `<option value="${cat.id}"${cat.id === selectedId ? " selected" : ""}>${cat.icon} ${cat.label}</option>`,
    )
    .join("");
}
