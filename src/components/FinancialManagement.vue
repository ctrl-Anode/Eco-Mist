<template>
  <div class="finance-wrapper">
    <!-- Animated Background -->
    <div class="gradient-bg">
      <div class="gradient-circle c1"></div>
      <div class="gradient-circle c2"></div>
      <div class="gradient-circle c3"></div>
    </div>

    <div class="content-container">
      <!-- Header Cards -->
      <div class="glass-card overview-section">
        <h1 class="section-title">
          <i class="fas fa-chart-line"></i>
          Financial Overview
        </h1>
        
        <div class="stats-grid">
          <div class="stat-card income">
            <div class="stat-icon">
              <i class="fas fa-arrow-up"></i>
            </div>
            <div class="stat-content">
              <h3>Total Income</h3>
              <p class="stat-value">₱{{ totalIncome.toLocaleString() }}</p>
              <span class="stat-label">Current Month</span>
            </div>
          </div>

          <div class="stat-card expenses">
            <div class="stat-icon">
              <i class="fas fa-arrow-down"></i>
            </div>
            <div class="stat-content">
              <h3>Total Expenses</h3>
              <p class="stat-value">₱{{ totalExpenses.toLocaleString() }}</p>
              <span class="stat-label">Current Month</span>
            </div>
          </div>

          <div class="stat-card profit">
            <div class="stat-icon">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="stat-content">
              <h3>Net Profit</h3>
              <p class="stat-value" :class="netProfit >= 0 ? 'positive' : 'negative'">
                ₱{{ netProfit.toLocaleString() }}
              </p>
              <span class="stat-label">Current Month</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Transaction Form -->
      <div class="glass-card form-section">
        <div class="card-header">
          <h2>
            <i :class="isEditing ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
            {{ isEditing ? 'Edit Transaction' : 'New Transaction' }}
          </h2>
          <p class="subtitle">{{ isEditing ? 'Modify existing transaction' : 'Record a new financial transaction' }}</p>
        </div>

        <form @submit.prevent="isEditing ? updateTransaction() : addTransaction()" class="transaction-form">
          <div class="form-grid">
            <div class="form-group">
              <label>
                <i class="fas fa-money-bill-wave"></i>
                Amount
              </label>
              <div class="input-wrapper">
                <span class="currency-symbol">₱</span>
                <input
                  v-model="amount"
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  :class="{ 'has-error': formErrors.amount }"
                />
              </div>
              <span v-if="formErrors.amount" class="error-message">{{ formErrors.amount }}</span>
            </div>

            <div class="form-group">
              <label>
                <i class="fas fa-tag"></i>
                Type
              </label>
              <div class="select-wrapper">
                <select v-model="type" required>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>

            <div class="form-group">
              <label>
                <i class="fas fa-folder"></i>
                Category
              </label>
              <div class="select-wrapper">
                <select v-model="category" required>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>

            <div class="form-group">
              <label>
                <i class="fas fa-calendar"></i>
                Month
              </label>
              <div class="select-wrapper">
                <select v-model="selectedMonth" @change="updateChart">
                  <option v-for="month in months" :key="month.id" :value="month.id">
                    {{ month.name }}
                  </option>
                </select>
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>

            <div class="form-group full-width">
              <label>
                <i class="fas fa-sticky-note"></i>
                Notes
              </label>
              <input
                v-model="notes"
                type="text"
                placeholder="Add transaction details (optional)"
              />
            </div>
          </div>

          <div class="form-actions">
            <button
              v-if="isEditing"
              type="button"
              @click="cancelEdit"
              class="cancel-btn"
            >
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" class="submit-btn" :disabled="loading">
              <i :class="isEditing ? 'fas fa-save' : 'fas fa-plus'"></i>
              {{ isEditing ? 'Update' : 'Add' }} Transaction
              <span v-if="loading" class="spinner"></span>
            </button>
          </div>
        </form>
      </div>

      <!-- Analysis Section -->
      <div class="analysis-grid">
        <!-- Chart -->
        <div class="glass-card chart-section">
          <div class="card-header">
            <h2>
              <i class="fas fa-chart-line"></i>
              Financial Analysis
            </h2>
            <div class="chart-controls">
              <button @click="toggleChartType" class="chart-type-btn">
                <i :class="chartType === 'line' ? 'fas fa-chart-bar' : 'fas fa-chart-line'"></i>
                Switch to {{ chartType === 'line' ? 'Bar' : 'Line' }} Chart
              </button>
            </div>
          </div>
          
          <div class="chart-container" :class="{ loading: chartLoading }">
            <canvas ref="chartCanvas"></canvas>
            <div v-if="chartLoading" class="loader">
              <div class="spinner"></div>
              <span>Loading chart data...</span>
            </div>
          </div>
        </div>

        <!-- Category Summary -->
        <div class="glass-card summary-section">
          <div class="card-header">
            <h2>
              <i class="fas fa-list"></i>
              Category Summary
            </h2>
            <button @click="exportCategorySummary" class="export-btn">
              <i class="fas fa-download"></i>
              Export
            </button>
          </div>

          <div class="summary-table-container">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Income</th>
                  <th>Expenses</th>
                  <th>Net</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(totals, category) in transactionSummary" :key="category">
                  <td>
                    <div class="category-cell">
                      <i :class="getCategoryIcon(category)"></i>
                      {{ category }}
                    </div>
                  </td>
                  <td class="income-cell">₱{{ totals.income.toLocaleString() }}</td>
                  <td class="expense-cell">₱{{ totals.expense.toLocaleString() }}</td>
                  <td :class="(totals.income - totals.expense) >= 0 ? 'positive-cell' : 'negative-cell'">
                    ₱{{ (totals.income - totals.expense).toLocaleString() }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td class="income-cell">₱{{ totalIncome.toLocaleString() }}</td>
                  <td class="expense-cell">₱{{ totalExpenses.toLocaleString() }}</td>
                  <td :class="netProfit >= 0 ? 'positive-cell' : 'negative-cell'">
                    ₱{{ netProfit.toLocaleString() }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="glass-card history-section">
        <div class="card-header">
          <h2>
            <i class="fas fa-history"></i>
            Transaction History
          </h2>
          <div class="history-controls">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Search transactions..."
              />
            </div>
            <button @click="generateReport" class="report-btn">
              <i class="fas fa-file-pdf"></i>
              Generate Report
            </button>
          </div>
        </div>

        <div class="history-table-container">
          <table>
            <thead>
              <tr>
                <th @click="sortBy('date')" class="sortable">
                  <span>Date</span>
                  <i :class="getSortIcon('date')"></i>
                </th>
                <th @click="sortBy('type')" class="sortable">
                  <span>Type</span>
                  <i :class="getSortIcon('type')"></i>
                </th>
                <th @click="sortBy('category')" class="sortable">
                  <span>Category</span>
                  <i :class="getSortIcon('category')"></i>
                </th>
                <th @click="sortBy('amount')" class="sortable">
                  <span>Amount</span>
                  <i :class="getSortIcon('amount')"></i>
                </th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="transaction in filteredTransactions" :key="transaction.id" 
                  :class="{ 'deleted': transaction.deleting }">
                <td>{{ formatDate(transaction.date) }}</td>
                <td>
                  <span :class="['type-badge', transaction.type]">
                    <i :class="transaction.type === 'income' ? 'fas fa-plus' : 'fas fa-minus'"></i>
                    {{ transaction.type }}
                  </span>
                </td>
                <td>
                  <div class="category-cell">
                    <i :class="getCategoryIcon(transaction.category)"></i>
                    {{ transaction.category }}
                  </div>
                </td>
                <td :class="transaction.type === 'income' ? 'income-amount' : 'expense-amount'">
                  ₱{{ transaction.amount.toLocaleString() }}
                </td>
                <td>{{ transaction.notes || '-' }}</td>
                <td>
                  <div class="action-buttons">
                    <button @click="editTransaction(transaction)" class="edit-btn" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="confirmDelete(transaction)" class="delete-btn" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="page-btn"
          >
            <i class="fas fa-chevron-left"></i>
            Previous
          </button>
          <span class="page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="page-btn"
          >
            Next
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header" :class="modalType">
          <h3>
            <i :class="getModalIcon()"></i>
            {{ modalTitle }}
          </h3>
          <button class="close-btn" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>{{ modalMessage }}</p>
          <div v-if="modalType === 'delete'" class="warning-box">
            <i class="fas fa-exclamation-triangle"></i>
            <span>This action cannot be undone</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button 
            :class="['confirm-btn', modalType]" 
            @click="handleModalConfirm"
          >
            <i :class="getModalActionIcon()"></i>
            {{ modalConfirmText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" 
         class="toast-notification"
         :class="toast.type">
      <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { auth, db } from '../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  /* eslint-disable-next-line */
  where,
  Timestamp 
} from 'firebase/firestore';
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// State
const transactions = ref([]);
const categories = ref([
  "Crop Sales",
  "Equipment Sales",
  "Consulting",
  "Utilities",
  "Nutrients",
  "Equipment",
  "Maintenance",
  "Labor",
  "Marketing",
  "Other"
]);
const amount = ref("");
const type = ref("income");
const category = ref(categories.value[0]);
const notes = ref("");
const chartCanvas = ref(null);
const isEditing = ref(false);
const editingTransactionId = ref(null);
const loading = ref(false);
const chartLoading = ref(false);
const showModal = ref(false);
const modalType = ref("");
const selectedTransaction = ref(null);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const sortColumn = ref("date");
const sortDirection = ref("desc");
const chartType = ref("line");
const selectedMonth = ref(new Date().getMonth() + 1);
const formErrors = ref({});
const toast = ref({ show: false, message: '', type: '' });

let chartInstance = null;

// Constants
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

// Computed Properties
const filteredTransactions = computed(() => {
  let filtered = [...transactions.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(t => 
      t.category.toLowerCase().includes(query) ||
      t.notes?.toLowerCase().includes(query) ||
      t.amount.toString().includes(query)
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    let aVal = a[sortColumn.value];
    let bVal = b[sortColumn.value];

    if (sortColumn.value === 'date') {
      aVal = a.date.seconds;
      bVal = b.date.seconds;
    }

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  return filtered;
});

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

const totalPages = computed(() => 
  Math.ceil(filteredTransactions.value.length / itemsPerPage)
);

const totalIncome = computed(() => {
  return transactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
});

const totalExpenses = computed(() => {
  return transactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
});

const netProfit = computed(() => totalIncome.value - totalExpenses.value);

const transactionSummary = computed(() => {
  const summary = {};
  categories.value.forEach(cat => {
    summary[cat] = { income: 0, expense: 0 };
  });

  transactions.value.forEach(t => {
    summary[t.category][t.type] += t.amount;
  });

  return summary;
});

// Modal computed properties
const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'delete': return 'Delete Transaction';
    default: return '';
  }
});

const modalMessage = computed(() => {
  if (!selectedTransaction.value) return '';
  
  switch (modalType.value) {
    case 'delete':
      return `Are you sure you want to delete this ${selectedTransaction.value.type} transaction of ₱${selectedTransaction.value.amount.toLocaleString()}?`;
    default:
      return '';
  }
});

const modalConfirmText = computed(() => {
  switch (modalType.value) {
    case 'delete': return 'Delete';
    default: return 'Confirm';
  }
});

// Methods
const validateForm = () => {
  formErrors.value = {};
  
  if (!amount.value || isNaN(amount.value) || amount.value <= 0) {
    formErrors.value.amount = 'Please enter a valid amount';
    return false;
  }

  return true;
};

const showSuccess = (message) => {
  toast.value = { show: true, message, type: 'success' };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const showError = (message) => {
  toast.value = { show: true, message, type: 'error' };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const fetchTransactions = async () => {
  const user = auth.currentUser;
  if (!user) {
    showError('Please sign in to manage your transactions');
    return;
  }

  const transactionsRef = collection(db, 'users', user.uid, 'transactions');
  const q = query(transactionsRef, orderBy('date', 'desc'));

  onSnapshot(q, (snapshot) => {
    transactions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      deleting: false
    }));
    updateChart();
  });
};

const addTransaction = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  const user = auth.currentUser;
  if (!user) {
    showError('Please sign in to add transactions');
    return;
  }

  try {
    await addDoc(collection(db, 'users', user.uid, 'transactions'), {
      amount: parseFloat(amount.value),
      type: type.value,
      category: category.value,
      date: Timestamp.now(),
      notes: notes.value || '',
    });

    resetForm();
    showSuccess('Transaction added successfully');
  } catch (error) {
    showError('Error adding transaction. Please try again.');
  } finally {
    loading.value = false;
  }
};

const updateTransaction = async () => {
  if (!validateForm()) return;
  
  loading.value = true;
  const user = auth.currentUser;
  if (!user || !editingTransactionId.value) {
    showError('Please sign in to update transactions');
    return;
  }

  try {
    await updateDoc(
      doc(db, 'users', user.uid, 'transactions', editingTransactionId.value),
      {
        amount: parseFloat(amount.value),
        type: type.value,
        category: category.value,
        notes: notes.value || '',
        updatedAt: Timestamp.now()
      }
    );

    resetForm();
    showSuccess('Transaction updated successfully');
  } catch (error) {
    showError('Error updating transaction. Please try again.');
  } finally {
    loading.value = false;
  }
};

const deleteTransaction = async (transaction) => {
  const user = auth.currentUser;
  if (!user) {
    showError('Please sign in to delete transactions');
    return;
  }

  const index = transactions.value.findIndex(t => t.id === transaction.id);
  if (index !== -1) {
    transactions.value[index].deleting = true;
  }

  try {
    await deleteDoc(
      doc(db, 'users', user.uid, 'transactions', transaction.id)
    );
    showSuccess('Transaction deleted successfully');
  } catch (error) {
    showError('Error deleting transaction. Please try again.');
    if (index !== -1) {
      transactions.value[index].deleting = false;
    }
  }
};

// Chart Methods
const updateChart = async () => {
  chartLoading.value = true;
  await nextTick();
  
  if (!chartCanvas.value) {
    chartLoading.value = false;
    return;
  }

  const ctx = chartCanvas.value.getContext('2d');
  const monthlyData = getMonthlyData();

  if (chartInstance) {
    chartInstance.destroy();
  }

  const config = {
    type: chartType.value,
    data: {
      labels: monthlyData.labels,
      datasets: [
        {
          label: 'Income',
          data: monthlyData.income,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: monthlyData.expenses,
          borderColor: 'rgb(244, 63, 94)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          tension: 0.4
        },
        {
          label: 'Net Profit',
          data: monthlyData.profit,
          borderColor: 'rgb(14, 165, 233)',
          backgroundColor: 'rgba(14, 165, 233, 0.1)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index'
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            callback: value => `₱${value.toLocaleString()}`,
            color: 'rgba(255, 255, 255, 0.7)'
          }
        },
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'rgba(255, 255, 255, 0.7)'
          }
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
  };

  chartInstance = new Chart(ctx, config);
  chartLoading.value = false;
};

const toggleChartType = () => {
  chartType.value = chartType.value === 'line' ? 'bar' : 'line';
  updateChart();
};

// Utility Methods
const getMonthlyData = () => {
  const months = {};
  const now = new Date();
  
  // Initialize last 6 months
  for (let i = 0; i < 6; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    months[key] = { income: 0, expenses: 0 };
  }

  // Populate data
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
  amount.value = '';
  notes.value = '';
  isEditing.value = false;
  editingTransactionId.value = null;
  type.value = 'income';
  category.value = categories.value[0];
  formErrors.value = {};
};

const editTransaction = (transaction) => {
  amount.value = transaction.amount;
  type.value = transaction.type;
  category.value = transaction.category;
  notes.value = transaction.notes || '';
  isEditing.value = true;
  editingTransactionId.value = transaction.id;
};

const confirmDelete = (transaction) => {
  modalType.value = 'delete';
  selectedTransaction.value = transaction;
  showModal.value = true;
};

const handleModalConfirm = async () => {
  if (!selectedTransaction.value) return;

  switch (modalType.value) {
    case 'delete':
      await deleteTransaction(selectedTransaction.value);
      break;
  }

  closeModal();
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = '';
  selectedTransaction.value = null;
};

const getCategoryIcon = (category) => {
  const icons = {
    'Crop Sales': 'fas fa-seedling',
    'Equipment Sales': 'fas fa-tools',
    'Consulting': 'fas fa-comments',
    'Utilities': 'fas fa-bolt',
    'Nutrients': 'fas fa-flask',
    'Equipment': 'fas fa-cogs',
    'Maintenance': 'fas fa-wrench',
    'Labor': 'fas fa-users',
    'Marketing': 'fas fa-bullhorn',
    'Other': 'fas fa-ellipsis-h'
  };
  return icons[category] || 'fas fa-tag';
};

const getModalIcon = () => {
  switch (modalType.value) {
    case 'delete': return 'fas fa-trash-alt';
    default: return 'fas fa-exclamation-circle';
  }
};

const getModalActionIcon = () => {
  switch (modalType.value) {
    case 'delete': return 'fas fa-trash-alt';
    default: return 'fas fa-check';
  }
};

const getSortIcon = (column) => {
  if (sortColumn.value !== column) return 'fas fa-sort';
  return sortDirection.value === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
};

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const generateReport = async () => {
  const doc = new jsPDF();
  
  // Title and Header
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text('Financial Report', 105, 15, { align: 'center' });
  
  // Summary Section
  doc.setFontSize(12);
  doc.setTextColor(52, 73, 94);
  doc.text('Summary', 14, 30);
  
  // Add summary table
  doc.autoTable({
    startY: 35,
    head: [['Metric', 'Amount']],
    body: [
      ['Total Income', `₱${totalIncome.value.toLocaleString()}`],
      ['Total Expenses', `₱${totalExpenses.value.toLocaleString()}`],
      ['Net Profit', `₱${netProfit.value.toLocaleString()}`]
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249]
    }
  });

  // Category Summary
  doc.text('Category Summary', 14, doc.autoTable.previous.finalY + 15);
  
  const categorySummaryData = Object.entries(transactionSummary.value).map(([cat, totals]) => [
    cat,
    `₱${totals.income.toLocaleString()}`,
    `₱${totals.expense.toLocaleString()}`,
    `₱${(totals.income - totals.expense).toLocaleString()}`
  ]);

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    head: [['Category', 'Income', 'Expenses', 'Net']],
    body: categorySummaryData,
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255
    }
  });

  // Transaction History
  doc.addPage();
  doc.text('Transaction History', 14, 15);
  
  const transactionData = paginatedTransactions.value.map(t => [
    formatDate(t.date),
    t.type,
    t.category,
    `₱${t.amount.toLocaleString()}`,
    t.notes || '-'
  ]);

  doc.autoTable({
    startY: 20,
    head: [['Date', 'Type', 'Category', 'Amount', 'Notes']],
    body: transactionData,
    theme: 'grid',
    headStyles: { 
      fillColor: [41, 128, 185],
      textColor: 255
    }
  });

  // Save the PDF
  doc.save(`financial-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

// Lifecycle
onMounted(() => {
  fetchTransactions();
});

// Watch for changes that require chart updates
watch([selectedMonth, transactions], () => {
  updateChart();
});
</script>

<style scoped>
.finance-wrapper {
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.gradient-bg {
  position: fixed;
  inset: 0;
  background: #0f172a;
  z-index: 0;
}

.gradient-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.c1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle at center, #22c55e, #16a34a);
  top: -200px;
  left: -200px;
}

.c2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle at center, #15803d, #166534);
  bottom: -150px;
  right: -150px;
  animation-delay: -5s;
}

.c3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at center, #059669, #047857);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

.content-container {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  padding: 24px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.3);
}

.section-title {
  color: white;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title i {
  color: #4ade80;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.income .stat-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.expenses .stat-icon {
  background: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
}

.profit .stat-icon {
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.stat-value {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.stat-value.positive {
  color: #10b981;
}

.stat-value.negative {
  color: #f43f5e;
}

.stat-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
}

.form-section {
  margin-top: 24px;
}

.card-header {
  margin-bottom: 24px;
}

.card-header h2 {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-header .subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 12px;
  color: rgba(255, 255, 255, 0.5);
}

input, select {
  width: 100%;
  padding: 10px;
  padding-left: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  outline: none;
  border-color: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.2);
}

.select-wrapper {
  position: relative;
}

.select-wrapper i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.submit-btn, .cancel-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.submit-btn {
  background: #4ade80;
  color: white;
}

.submit-btn:hover {
  background: #22c55e;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.chart-section, .summary-section {
  min-height: 400px;
}

.chart-container {
  position: relative;
  height: 300px;
  margin-top: 20px;
}

.chart-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.chart-type-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.chart-type-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.summary-table-container {
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  text-align: left;
  padding: 12px;
}

td {
  padding: 12px;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.category-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.income-cell {
  color: #10b981;
}

.expense-cell {
  color: #f43f5e;
}

.positive-cell {
  color: #10b981;
}

.negative-cell {
  color: #f43f5e;
}

.history-section {
  margin-top: 24px;
}

.history-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.search-box {
  flex: 1;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
}

.search-box input {
  padding-left: 36px;
}

.report-btn {
  background: #4ade80;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.report-btn:hover {
  background: #22c55e;
}

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
}

.type-badge.income {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.type-badge.expense {
  background: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.edit-btn, .delete-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.edit-btn {
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.edit-btn:hover {
  background: rgba(14, 165, 233, 0.2);
}

.delete-btn {
  background: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
}

.delete-btn:hover {
  background: rgba(244, 63, 94, 0.2);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.15);
}

.page-info {
  color: rgba(255, 255, 255, 0.7);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header.delete {
  color: #f43f5e;
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 8px;
}

.modal-body {
  padding: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.warning-box {
  margin-top: 16px;
  padding: 12px;
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f43f5e;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.confirm-btn.delete {
  background: #f43f5e;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}

.confirm-btn.delete:hover {
  background: #e11d48;
}

.error-message {
  color: #f43f5e;
  font-size: 0.875rem;
  margin-top: 4px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(50px, -50px); }
  50% { transform: translate(0, 75px); }
  75% { transform: translate(-50px, -25px); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .history-controls {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }

  .edit-btn, .delete-btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-circle,
  .modal-overlay,
  .modal-content,
  .glass-card:hover {
    animation: none;
    transform: none;
  }
}

.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  animation: slideIn 0.3s ease;
  z-index: 1000;
}

.toast-notification.success {
  background: rgba(16, 185, 129, 0.9);
  backdrop-filter: blur(8px);
}

.toast-notification.error {
  background: rgba(244, 63, 94, 0.9);
  backdrop-filter: blur(8px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>