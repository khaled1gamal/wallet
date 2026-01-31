// تحميل البيانات من LocalStorage أو إنشاء مصفوفة جديدة
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// حفظ البيانات
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// حساب الرصيد الحالي بشكل احترافي
function calculateBalance() {
  // 1. استخدام reduce بدلاً من forEach لأنها الأنسب لعمليات التجميع (Totaling)
  const balance = transactions.reduce((acc, t) => {
    return t.type === "income" ? acc + t.amount : acc - t.amount;
  }, 0);

  // 2. استخدام Intl.NumberFormat لتنسيق الرقم كعملة بشكل احترافي (فواصل وآلاف)
  const formattedBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(balance);

  // 3. تحديث الواجهة
  const balanceElement = document.getElementById("balance");
  if (balanceElement) {
    balanceElement.innerText = `${formattedBalance} ريال`;
  }
}

//تعديل البيانات
function editTransaction(index) {
  const transaction = transactions[index];

  const newDesc = prompt("تعديل الوصف:", transaction.desc);
  if (newDesc === null || newDesc.trim() === "") return;

  const newAmount = prompt("تعديل المبلغ:", transaction.amount);
  if (newAmount === null || Number(newAmount) <= 0) return;

  const changeType = confirm(
    "هل تريد تغيير النوع؟\nموافق = دخل\nإلغاء = مصروف",
  );
  const newType = changeType ? "income" : "expense";

  transactions[index] = {
    ...transaction,
    desc: newDesc.trim(),
    amount: Number(newAmount),
    type: newType,
  };

  saveData();
  renderTransactions();
}

// عرض جميع العمليات
function renderTransactions() {
  const list = document.getElementById("transactions");
  list.innerHTML = "";

  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.className = t.type;

    li.innerHTML = `
      <div>
        <strong>${t.desc}</strong><br>
        <small>${t.dateTime}</small>
      </div>
      <span>${t.type === "income" ? "+" : "-"}${t.amount}</span>
    `;

    // 🔹 عند الضغط للتعديل
    li.addEventListener("click", () => editTransaction(index));

    list.appendChild(li);
  });

  calculateBalance();
}

// إضافة دخل أو مصروف جديد مع التاريخ والوقت
function addTransaction() {
  const desc = document.getElementById("desc").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!desc || amount <= 0) {
    alert("من فضلك أدخل وصف ومبلغ صحيح");
    return;
  }

  const now = new Date();
  const dateTime = now.toLocaleString("ar-EG");

  transactions.push({
    desc: desc,
    amount: amount,
    type: type,
    dateTime: dateTime,
  });

  saveData();
  renderTransactions();

  // تفريغ الحقول
  document.getElementById("desc").value = "";
  document.getElementById("amount").value = "";
}

// زر نهاية الشهر (مسح كل البيانات)
function endMonth() {
  if (confirm("هل أنت متأكد من حذف جميع بيانات الشهر؟")) {
    transactions = [];
    localStorage.removeItem("transactions");
    renderTransactions();
  }
}

// تشغيل عند فتح الصفحة
renderTransactions();
