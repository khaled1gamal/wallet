// تحميل البيانات من LocalStorage أو إنشاء مصفوفة جديدة
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// حفظ البيانات
function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// حساب الرصيد الحالي
function calculateBalance() {
    let balance = 0;

    transactions.forEach(t => {
        if (t.type === "income") {
            balance += t.amount;
        } else {
            balance -= t.amount;
        }
    });

    document.getElementById("balance").innerText = balance;
}

// عرض جميع العمليات
function renderTransactions() {
    const list = document.getElementById("transactions");
    list.innerHTML = "";

    transactions.forEach(t => {
        const li = document.createElement("li");
        li.className = t.type;

        li.innerHTML = `
            <div>
                <strong>${t.desc}</strong><br>
                <small>${t.dateTime}</small>
            </div>
            <span>${t.type === "income" ? "+" : "-"}${t.amount}</span>
        `;

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
        dateTime: dateTime
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
