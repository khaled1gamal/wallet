let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveData() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function calculateBalance() {
    let balance = 0;
    transactions.forEach(t => {
        balance += t.type === "income" ? t.amount : -t.amount;
    });
    document.getElementById("balance").innerText = balance;
}

function renderTransactions() {
    const list = document.getElementById("transactions");
    list.innerHTML = "";

    transactions.forEach(t => {
        const li = document.createElement("li");
        li.className = t.type;
        li.innerHTML = `
            <span>${t.desc}</span>
            <span>${t.type === "income" ? "+" : "-"}${t.amount}</span>
        `;
        list.appendChild(li);
    });

    calculateBalance();
}

function addTransaction() {
    const desc = document.getElementById("desc").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (!desc || amount <= 0) {
        alert("ادخل بيانات صحيحة");
        return;
    }

    transactions.push({ desc, amount, type });
    saveData();
    renderTransactions();

    document.getElementById("desc").value = "";
    document.getElementById("amount").value = "";
}

function endMonth() {
    if (confirm("هل أنت متأكد من مسح بيانات الشهر؟")) {
        transactions = [];
        localStorage.removeItem("transactions");
        renderTransactions();
    }
}

// تحميل البيانات عند فتح الموقع
renderTransactions();