<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header with improved styling -->
    <header class="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p class="text-slate-600 mt-1 flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Welcome back, {{ username }}!
            </p>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-3 h-3 bg-red-500 rounded-full absolute -top-1 -right-1 animate-pulse"></div>
              <div class="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7H4l5-5v5z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Enhanced Overview Cards with animations -->
    <section class="p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(card, index) in dashboardCards"
          :key="index"
          class="group bg-white/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg border border-slate-200/50 p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          :class="card.hoverClass"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-500 mb-1">{{ card.title }}</p>
              <h2 class="text-3xl font-bold text-slate-800 mb-2">
                <span class="counter" :data-target="card.value">{{ card.displayValue }}</span>
              </h2>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-1 rounded-full" :class="card.changeClass">
                  {{ card.change }}
                </span>
              </div>
            </div>
            <div class="p-3 rounded-lg transition-colors duration-300" :class="card.iconBg">
              <component :is="card.icon" class="w-6 h-6 transition-colors duration-300" :class="card.iconColor" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Charts Section -->
    <section class="px-6 pb-6">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <!-- Expense Chart -->
        <div class="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-6 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-slate-800">Expense Breakdown</h3>
            <div class="flex gap-2">
              <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="relative h-64">
            <canvas ref="expenseChart" class="max-h-full"></canvas>
          </div>
        </div>

        <!-- Disease Trends Chart -->
        <div class="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-6 hover:shadow-lg transition-shadow duration-300">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-slate-800">Disease Trends</h3>
            <div class="flex gap-2">
              <select class="text-sm border border-slate-200 rounded-lg px-3 py-1 bg-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
          <div class="relative h-64">
            <canvas ref="diseaseChart" class="max-h-full"></canvas>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Alerts Section -->
    <section class="px-6 pb-6">
      <div class="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            System Alerts
          </h3>
          <button class="text-sm text-slate-500 hover:text-slate-700 transition-colors">
            View All
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="(alert, index) in alerts"
            :key="index"
            class="flex items-start gap-4 p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-sm"
            :class="alert.bgClass + ' ' + alert.borderClass"
          >
            <div class="p-2 rounded-lg" :class="alert.iconBg">
              <component :is="alert.icon" class="w-4 h-4" :class="alert.iconColor" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium" :class="alert.textClass">{{ alert.message }}</p>
              <p class="text-xs text-slate-500 mt-1">{{ alert.timestamp }}</p>
            </div>
            <button class="p-1 hover:bg-slate-100 rounded transition-colors">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Activity Log and Performance in Grid -->
    <section class="px-6 pb-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Activity Log -->
        <div class="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-slate-800">Recent Activity</h3>
            <button class="text-sm text-blue-600 hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>
          <div class="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
            <div
              v-for="(log, index) in activityLogs.slice(0, 5)"
              :key="index"
              class="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-700 leading-relaxed">{{ log.message }}</p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ log.timestamp.toDate().toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- System Performance -->
        <div class="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 p-6">
          <h3 class="text-xl font-semibold text-slate-800 mb-6">System Performance</h3>
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-700">Misting Frequency</p>
                  <p class="text-xs text-slate-500">Daily cycles</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-slate-800">{{ performance.mistingFrequency }}</p>
                <p class="text-xs text-green-600">+2 from yesterday</p>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-700">Active Devices</p>
                  <p class="text-xs text-slate-500">Currently online</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold text-slate-800">{{ performance.activeDevices }}</p>
                <p class="text-xs text-blue-600">All systems operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { auth, db } from '../../firebase'
import { doc, getDoc, collection, getCountFromServer, query, where, getDocs, orderBy } from 'firebase/firestore'
import { UserIcon, CalendarIcon, DatabaseIcon, TrendingUpIcon, AlertTriangleIcon, InfoIcon } from 'lucide-vue-next'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const username = ref('')
const dashboardCards = ref([
  { 
    title: 'Transactions', 
    value: 0, 
    displayValue: '...', 
    change: '+12%',
    changeClass: 'bg-green-100 text-green-700',
    hoverClass: 'hover:border-emerald-200',
    iconBg: 'bg-emerald-100 group-hover:bg-emerald-200',
    iconColor: 'text-emerald-600',
    icon: DatabaseIcon 
  },
  { 
    title: 'Budget Entries', 
    value: 0, 
    displayValue: '...', 
    change: '+8%',
    changeClass: 'bg-blue-100 text-blue-700',
    hoverClass: 'hover:border-blue-200',
    iconBg: 'bg-blue-100 group-hover:bg-blue-200',
    iconColor: 'text-blue-600',
    icon: CalendarIcon 
  },
  { 
    title: 'Analyses Run', 
    value: 0, 
    displayValue: '...', 
    change: '+15%',
    changeClass: 'bg-purple-100 text-purple-700',
    hoverClass: 'hover:border-purple-200',
    iconBg: 'bg-purple-100 group-hover:bg-purple-200',
    iconColor: 'text-purple-600',
    icon: TrendingUpIcon 
  },
  { 
    title: 'Feedbacks', 
    value: 0, 
    displayValue: '...', 
    change: '+5%',
    changeClass: 'bg-amber-100 text-amber-700',
    hoverClass: 'hover:border-amber-200',
    iconBg: 'bg-amber-100 group-hover:bg-amber-200',
    iconColor: 'text-amber-600',
    icon: UserIcon 
  },
])

const alerts = ref([
  { 
    message: 'Device Eco-1 missed a scheduled mist.', 
    timestamp: '2 minutes ago',
    icon: AlertTriangleIcon,
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-400',
    textClass: 'text-amber-800',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  },
  { 
    message: 'High TDS level detected in Eco-2.', 
    timestamp: '5 minutes ago',
    icon: AlertTriangleIcon,
    bgClass: 'bg-red-50',
    borderClass: 'border-red-400',
    textClass: 'text-red-800',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600'
  }
])

const activityLogs = ref([])
const performance = ref({ mistingFrequency: 0, activeDevices: 0 })
const expenseChart = ref(null)
const diseaseChart = ref(null)

// Counter animation function
const animateCounter = (element, target) => {
  let current = 0
  const increment = target / 50
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 20)
}

onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    username.value = user.displayName || user.email
    const uid = user.uid

    try {
      // Fetch counts with error handling
      const [txSnap, budgetSnap, analysisSnap, feedbackSnap] = await Promise.all([
        getCountFromServer(collection(db, 'users', uid, 'transactions')),
        getCountFromServer(collection(db, 'users', uid, 'budgets')),
        getCountFromServer(query(collection(db, 'analysisHistory'), where('userId', '==', uid))),
        getCountFromServer(query(collection(db, 'feedback'), where('userId', '==', uid)))
      ])

      // Update card values and animate counters
      dashboardCards.value[0].value = txSnap.data().count
      dashboardCards.value[1].value = budgetSnap.data().count
      dashboardCards.value[2].value = analysisSnap.data().count
      dashboardCards.value[3].value = feedbackSnap.data().count

      // Animate counters
      await nextTick()
      dashboardCards.value.forEach((card, index) => {
        card.displayValue = card.value
        const element = document.querySelectorAll('.counter')[index]
        if (element) {
          animateCounter(element, card.value)
        }
      })

      // Fetch activity logs
      const logQuery = query(
  collection(db, 'system_logs'),
  where('user', '==', auth.currentUser.email),
  orderBy('timestamp', 'desc')
)

      const logSnap = await getDocs(logQuery)
      activityLogs.value = logSnap.docs.map(doc => doc.data())

      // Update performance data
      performance.value = {
        mistingFrequency: 12,
        activeDevices: 4
      }

      // Render charts with improved styling
      setTimeout(() => {
        renderCharts()
      }, 100)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }
})

const renderCharts = () => {
  // Enhanced Expense Chart
  if (expenseChart.value) {
    new Chart(expenseChart.value, {
      type: 'doughnut',
      data: {
        labels: ['Nutrients', 'Maintenance', 'Energy', 'Other'],
        datasets: [{
          data: [30, 25, 35, 10],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)'
          ],
          borderColor: [
            'rgb(16, 185, 129)',
            'rgb(59, 130, 246)',
            'rgb(139, 92, 246)',
            'rgb(245, 158, 11)'
          ],
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          }
        },
        cutout: '60%'
      }
    })
  }

  // Enhanced Disease Trends Chart
  if (diseaseChart.value) {
    new Chart(diseaseChart.value, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Fungal Infections',
          data: [2, 4, 3, 5, 1, 0, 2],
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: 'rgb(139, 92, 246)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    })
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group {
  animation: fadeInUp 0.6s ease-out forwards;
}
</style>