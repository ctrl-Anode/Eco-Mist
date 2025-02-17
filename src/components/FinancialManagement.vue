<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header Section -->
      <div class="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <h1 class="text-4xl font-bold text-gray-800 mb-6">Financial Management</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
            <h3 class="text-sm font-semibold text-emerald-700 mb-2">Total Income</h3>
            <p class="text-3xl font-bold text-emerald-800">₱{{ totalIncome.toLocaleString() }}</p>
          </div>
          <div class="bg-gradient-to-br from-rose-50 to-rose-100 p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
            <h3 class="text-sm font-semibold text-rose-700 mb-2">Total Expenses</h3>
            <p class="text-3xl font-bold text-rose-800">₱{{ totalExpenses.toLocaleString() }}</p>
          </div>
          <div class="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
            <h3 class="text-sm font-semibold text-sky-700 mb-2">Net Profit</h3>
            <p class="text-3xl font-bold" :class="netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'">
              ₱{{ netProfit.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Transaction Form -->
      <div class="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{ isEditing ? 'Edit Transaction' : 'Add Transaction' }}</h2>
        <form @submit.prevent="isEditing ? updateTransaction() : addTransaction()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                v-model="amount"
                type="number"
                step="0.01"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                v-model="type"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                v-model="category"
                required
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              >
                <option v-for="cat in categories" :key="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                v-model="selectedMonth"
                @change="updateChart"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
              >
                <option v-for="month in months" :key="month.id" :value="month.id">
                  {{ month.name }}
                </option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input
                v-model="notes"
                type="text"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                placeholder="Optional notes"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-4">
            <button
              v-if="isEditing"
              type="button"
              @click="cancelEdit"
              class="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-3 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors"
            >
              {{ isEditing ? 'Update' : 'Add' }} Transaction
            </button>
          </div>
        </form>
      </div>

      <!-- Financial Analysis -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart -->
        <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Profit & Loss Analysis</h2>
          <canvas ref="chartCanvas" class="w-full"></canvas>
        </div>
        
        <!-- Category Summary -->
        <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
          <h2 class="text-xl font-semibold mb-4 text-gray-800">Category Summary</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(totals, category) in transactionSummary" :key="category">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ category }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-600">
                    ₱{{ totals.income.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-rose-600">
                    ₱{{ totals.expense.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right" 
                      :class="(totals.income - totals.expense) >= 0 ? 'text-emerald-600' : 'text-rose-600'">
                    ₱{{ (totals.income - totals.expense).toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Transaction History</h2>
          <button 
            @click="generateReport" 
            class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <i class="fas fa-file-pdf"></i>
            Generate Report
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in sortedTransactions" :key="transaction.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`">
                    {{ transaction.type }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ transaction.category }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right" 
                    :class="transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'">
                  ₱{{ transaction.amount.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ transaction.notes || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="editTransaction(transaction)"
                    class="text-sky-600 hover:text-sky-900 mr-3 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteTransaction(transaction.id)"
                    class="text-rose-600 hover:text-rose-900 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end mt-4">
          <button @click="exportToPDF" class="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors">
            Export to PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from "vue";
import { db, auth } from "@/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import Chart from "chart.js/auto";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default {
  setup() {
    const transactions = ref([]);
    const categories = ref(["Crop Sales", "Utilities", "Nutrients", "Maintenance"]);
    const amount = ref("");
    const type = ref("income");
    const category = ref(categories.value[0]);
    const notes = ref("");
    const chartCanvas = ref(null);
    const isEditing = ref(false);
    const editingTransactionId = ref(null);
    let chartInstance = null;
    const selectedMonth = ref(new Date().getMonth() + 1); // Default: Current month


    // eslint-disable-next-line no-unused-vars
    const months = [
  { id: 1, name: 'January' },
  { id: 2, name: 'February' },
  { id: 3, name: 'March' },
  { id: 4, name: 'April' },
  { id: 5, name: 'May' },
  { id: 6, name: 'June' },
  { id: 7, name: 'July' },
  { id: 8, name: 'August' },
  { id: 9, name: 'September' },
  { id: 10, name: 'October' },
  { id: 11, name: 'November' },
  { id: 12, name: 'December' }
];

    const exportToPDF = () => {
      const doc = new jsPDF();
      doc.text("Financial Report", 10, 10);
      doc.autoTable({
        head: [['Category', 'Amount']],
        body: [
          ['Total Income', `₱${totalIncome.value.toLocaleString()}`],
          ['Total Expenses', `₱${totalExpenses.value.toLocaleString()}`],
          ['Net Profit', `₱${netProfit.value.toLocaleString()}`],
        ],
      });
      doc.save('financial-report.pdf');
    };
    
    
    // Computed Properties
    const sortedTransactions = computed(() => {
      return [...transactions.value].sort((a, b) => b.date.seconds - a.date.seconds);
    });

    const totalIncome = computed(() => {
      return transactions.value
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const totalExpenses = computed(() => {
      return transactions.value
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
    });

    const netProfit = computed(() => {
      return totalIncome.value - totalExpenses.value;
    });

    const transactionSummary = computed(() => {
      const summary = {};
      transactions.value.forEach((t) => {
        if (!summary[t.category]) {
          summary[t.category] = { income: 0, expense: 0 };
        }
        summary[t.category][t.type] += t.amount;
      });
      return summary;
    });

    // Firebase Operations
    const fetchTransactions = () => {
      const user = auth.currentUser;
      if (!user) return;

      const transactionsRef = collection(db, "finance", user.uid, "transactions");
      const q = query(transactionsRef, orderBy("date", "desc"));

      onSnapshot(q, (snapshot) => {
        transactions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        updateChart();
      });
    };

    const addTransaction = async () => {
      if (!amount.value || isNaN(amount.value)) return alert("Enter a valid amount");

      const user = auth.currentUser;
      if (!user) return alert("User not logged in");

      await addDoc(collection(db, "finance", user.uid, "transactions"), {
        amount: parseFloat(amount.value),
        type: type.value,
        category: category.value,
        date: new Date(),
        notes: notes.value || "",
      });

      resetForm();
    };

    const updateTransaction = async () => {
      const user = auth.currentUser;
      if (!user || !editingTransactionId.value) return;

      await updateDoc(doc(db, "finance", user.uid, "transactions", editingTransactionId.value), {
        amount: parseFloat(amount.value),
        type: type.value,
        category: category.value,
        notes: notes.value || "",
      });

      resetForm();
    };

    const deleteTransaction = async (id) => {
      if (!confirm("Are you sure you want to delete this transaction?")) return;
      
      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, "finance", user.uid, "transactions", id));
    };

    // Chart Management
    const updateChart = async () => {
      // Handle both month change and initial chart updates
      if (selectedMonth.value) {
        console.log("Month changed to:", selectedMonth.value);
      }
      await nextTick();
      if (!chartCanvas.value) return;

      const monthlyData = getMonthlyData();

      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(chartCanvas.value, {
        type: "line",
        data: {
          labels: monthlyData.labels,
          datasets: [
            {
              label: "Income",
              data: monthlyData.income,
              borderColor: "rgb(16, 185, 129)",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              tension: 0.1
            },
            {
              label: "Expenses",
              data: monthlyData.expenses,
              borderColor: "rgb(244, 63, 94)",
              backgroundColor: "rgba(244, 63, 94, 0.1)",
              tension: 0.1
            },
            {
              label: "Net Profit",
              data: monthlyData.profit,
              borderColor: "rgb(14, 165, 233)",
              backgroundColor: "rgba(14, 165, 233, 0.1)",
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => `₱${value.toLocaleString()}`
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += `₱${context.parsed.y.toLocaleString()}`;
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    };

    // Utility Functions
    const getMonthlyData = () => {
      const months = {};
      const now = new Date();
      for (let i = 0; i < 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        months[key] = { income: 0, expenses: 0 };
      }

      transactions.value.forEach(t => {
        const date = new Date(t.date.seconds * 1000);
        const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (months[key]) {
          if (t.type === 'income') {
            months[key].income += t.amount;
          } else {
            months[key].expenses += t.amount;
          }
        }
      });

      const labels = Object.keys(months).reverse();
      const income = labels.map(key => months[key].income);
      const expenses = labels.map(key => months[key].expenses);
      const profit = labels.map((key, i) => income[i] - expenses[i]);

      return { labels, income, expenses, profit };
    };

    const formatDate = (date) => {
      return new Date(date.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const resetForm = () => {
      amount.value = "";
      notes.value = "";
      isEditing.value = false;
      editingTransactionId.value = null;
      type.value = "income";
      category.value = categories.value[0];
    };

    const cancelEdit = () => {
      resetForm();
    };

    const editTransaction = (transaction) => {
      amount.value = transaction.amount;
      type.value = transaction.type;
      category.value = transaction.category;
      notes.value = transaction.notes || "";
      isEditing.value = true;
      editingTransactionId.value = transaction.id;
    };

    const generateReport = () => {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text("Financial Report", 105, 15, { align: "center" });
      
      // Summary
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);
      doc.text(`Total Income: ₱${totalIncome.value.toLocaleString()}`, 14, 35);
      doc.text(`Total Expenses: ₱${totalExpenses.value.toLocaleString()}`, 14, 45);
      doc.text(`Net Profit: ₱${netProfit.value.toLocaleString()}`, 14, 55);

      // Category Summary Table
      const categorySummaryData = Object.entries(transactionSummary.value).map(([cat, totals]) => [
        cat,
        `₱${totals.income.toLocaleString()}`,
        `₱${totals.expense.toLocaleString()}`,
        `₱${(totals.income - totals.expense).toLocaleString()}`
      ]);

      doc.autoTable({
        startY: 65,
        head: [["Category", "Income", "Expenses", "Net"]],
        body: categorySummaryData,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] }
      });

      // Transaction History Table
      const transactionData = sortedTransactions.value.map(t => [
        formatDate(t.date),
        t.type,
        t.category,
        `₱${t.amount.toLocaleString()}`,
        t.notes || "-"
      ]);

      doc.addPage();
      doc.text("Transaction History", 105, 15, { align: "center" });
      
      doc.autoTable({
        startY: 25,
        head: [["Date", "Type", "Category", "Amount", "Notes"]],
        body: transactionData,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] }
      });

      // Save the PDF
      doc.save("financial-report.pdf");
    };

    onMounted(() => {
      fetchTransactions();
    });

    return {
      transactions,
      sortedTransactions,
      categories,
      amount,
      type,
      category,
      notes,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      editTransaction,
      chartCanvas,
      isEditing,
      transactionSummary,
      totalIncome,
      totalExpenses,
      netProfit,
      formatDate,
      generateReport,
      exportToPDF,
      resetForm,
      cancelEdit,
      months,
      selectedMonth
    };
  }
};
</script>

<style>
/* Add any additional custom styles here */
button {
  transition: background-color 0.3s ease;
}
button:hover {
  background-color: #004085;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>