// تحميل البيانات من LocalStorage أو إنشاء مصفوفة جديدة
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let filterType = "all"; // حالة الفلتر الحالية (الكل، دخل، مصروف)

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

// حذف عملية محددة
function deleteTransaction(index) {
  if (confirm("هل أنت متأكد من حذف هذه العملية؟")) {
    transactions.splice(index, 1);
    saveData();
    renderTransactions();
  }
}

// عرض جميع العمليات
function renderTransactions() {
  const list = document.getElementById("transactions");

  // إضافة واجهة الفلتر ديناميكياً إذا لم تكن موجودة مسبقاً
  if (!document.getElementById("filter-container")) {
    const filterContainer = document.createElement("div");
    filterContainer.id = "filter-container";
    filterContainer.className = "filter-group";
    filterContainer.innerHTML = `
      <label><input type="radio" name="filter" value="all" checked> الكل</label>
      <label><input type="radio" name="filter" value="income"> دخل</label>
      <label><input type="radio" name="filter" value="expense"> مصروف</label>
    `;
    
    // إدراج الفلتر قبل قائمة العمليات
    list.parentNode.insertBefore(filterContainer, list);

    // تفعيل التغيير عند اختيار فلتر
    filterContainer.querySelectorAll("input").forEach(radio => {
      radio.addEventListener("change", (e) => {
        filterType = e.target.value;
        renderTransactions();
      });
    });
  }

  list.innerHTML = "";

  transactions.forEach((t, index) => {
    // تخطي العنصر إذا لم يطابق الفلتر المختار
    if (filterType !== "all" && t.type !== filterType) return;

    const li = document.createElement("li");
    li.className = t.type;

    li.innerHTML = `
      <div class="meta">
        <b>${t.desc}</b>
        <small>${t.dateTime}</small>
      </div>
      <div class="action-group">
        <span class="amount">${t.type === "income" ? "+" : "-"}${t.amount}</span>
        <button class="delete-btn" title="حذف">×</button>
      </div>
    `;

    // تفعيل زر الحذف مع منع انتشار الحدث للعنصر الأب
    li.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTransaction(index);
    });

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
