document.addEventListener("DOMContentLoaded", function() {
    // Set default date to today's date
    let today = new Date().toISOString().substr(0, 10);
    document.getElementById("incomeDate").value = today;
    document.getElementById("primerDate").value = today;
    document.getElementById("sekunderDate").value = today;
    document.getElementById("tersierDate").value = today;
    document.getElementById("startDate").value = today;
    document.getElementById("endDate").value = today;
  
    // Load stored values from local storage on page load
    updateDisplay();
  });
  
  function addIncome() {
    let input = document.getElementById("income");
    let date = document.getElementById("incomeDate").value;
    let amount = parseFloat(input.value);
  
    if (isNaN(amount) || amount <= 0 || !date) {
      alert("Masukkan jumlah pemasukan dan tanggal yang valid");
      return;
    }
  
    let incomeList = JSON.parse(localStorage.getItem("incomeList")) || [];
    incomeList.push({ date: date, amount: amount });
  
    // Store updated income list in localStorage
    localStorage.setItem("incomeList", JSON.stringify(incomeList));
  
    // Update display
    updateDisplay();
  
    // Clear input
    input.value = '';
  }
  
  function addExpense(category) {
    let input = document.getElementById(category);
    let dateInput = document.getElementById(category + "Date");
    let amount = parseFloat(input.value);
    let date = dateInput.value;
  
    if (isNaN(amount) || amount <= 0 || !date) {
      alert("Masukkan jumlah pengeluaran dan tanggal yang valid");
      return;
    }
  
    let expenseList = JSON.parse(localStorage.getItem(category + "List")) || [];
    expenseList.push({ date: date, amount: amount });
  
    // Store updated expense list in localStorage
    localStorage.setItem(category + "List", JSON.stringify(expenseList));
  
    // Update display
    updateDisplay();
  
    // Clear input
    input.value = '';
  }
  
  function filterByDate() {
    updateDisplay();
  }
  
  function updateDisplay() {
    let startDate = new Date(document.getElementById("startDate").value);
    let endDate = new Date(document.getElementById("endDate").value);
  
    // Update Income display
    let incomeList = JSON.parse(localStorage.getItem("incomeList")) || [];
    let totalIncome = incomeList.reduce((total, entry) => {
      let entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate ? total + entry.amount : total;
    }, 0);
    document.getElementById("totalIncome").textContent = totalIncome;
    document.getElementById("totalIncomeFooter").textContent = totalIncome;
  
    // Update Expenses display for each category
    let primer = calculateExpenseWithinRange("primerList", startDate, endDate);
    let sekunder = calculateExpenseWithinRange("sekunderList", startDate, endDate);
    let tersier = calculateExpenseWithinRange("tersierList", startDate, endDate);
  
    document.getElementById("totalPrimer").textContent = primer;
    document.getElementById("totalSekunder").textContent = sekunder;
    document.getElementById("totalTersier").textContent = tersier;
  
    // Calculate total expenses and balance
    let totalExpense = primer + sekunder + tersier;
    document.getElementById("totalExpense").textContent = totalExpense;
  
    let balance = totalIncome - totalExpense;
    document.getElementById("balance").textContent = balance;
  }
  
  function calculateExpenseWithinRange(categoryListKey, startDate, endDate) {
    let expenseList = JSON.parse(localStorage.getItem(categoryListKey)) || [];
    return expenseList.reduce((total, entry) => {
      let entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate ? total + entry.amount : total;
    }, 0);
  }
  
  function clearData() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data?")) {
      localStorage.removeItem("primerList");
      localStorage.removeItem("sekunderList");
      localStorage.removeItem("tersierList");
      localStorage.removeItem("incomeList");
      updateDisplay();
    }
  }
  