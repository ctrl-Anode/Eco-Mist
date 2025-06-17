<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Main Content Area with Sidebar -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
        <!-- Page Header -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Financial Management</h1>
          <p class="text-gray-600">Track income, expenses, and financial performance</p>
        </div>

        <!-- Financial Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <!-- Income Card -->
          <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Income</p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">₱{{ safeToLocaleString(totalIncome) }}</h3>
                <div class="flex items-center mt-1">
                  <span :class="[
                    incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600',
                    'text-sm font-medium flex items-center'
                  ]">
                    <svg v-if="incomeGrowth >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.414 14.586 14H12z" clip-rule="evenodd" />
                    </svg>
                    {{ Math.abs(incomeGrowth).toFixed(1) }}%
                  </span>
                  <span class="text-gray-500 text-xs ml-1">vs last month</span>
                </div>
              </div>
              <div class="p-2 bg-green-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Expenses Card -->
          <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-500">Total Expenses</p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">₱{{ safeToLocaleString(totalExpenses) }}</h3>
                <div class="flex items-center mt-1">
                  <span :class="[
                    expenseGrowth <= 0 ? 'text-green-600' : 'text-red-600',
                    'text-sm font-medium flex items-center'
                  ]">
                    <svg v-if="expenseGrowth <= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.414 14.586 14H12z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                    {{ Math.abs(expenseGrowth).toFixed(1) }}%
                  </span>
                  <span class="text-gray-500 text-xs ml-1">vs last month</span>
                </div>
              </div>
              <div class="p-2 bg-red-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Net Profit Card -->
          <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-500">Net Profit</p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">₱{{ safeToLocaleString(netProfit) }}</h3>
                <div class="flex items-center mt-1">
                  <span :class="[
                    profitGrowth >= 0 ? 'text-green-600' : 'text-red-600',
                    'text-sm font-medium flex items-center'
                  ]">
                    <svg v-if="profitGrowth >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.414 14.586 14H12z" clip-rule="evenodd" />
                    </svg>
                    {{ Math.abs(profitGrowth).toFixed(1) }}%
                  </span>
                  <span class="text-gray-500 text-xs ml-1">vs last month</span>
                </div>
              </div>
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Savings Rate Card -->
          <div class="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-sm font-medium text-gray-500">Savings Rate</p>
                <h3 class="text-2xl font-bold text-gray-800 mt-1">{{ savingsRate.toFixed(1) }}%</h3>
                <div class="flex items-center mt-1">
                  <span :class="[
                    savingsRateGrowth >= 0 ? 'text-green-600' : 'text-red-600',
                    'text-sm font-medium flex items-center'
                  ]">
                    <svg v-if="savingsRateGrowth >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.414 14.586 14H12z" clip-rule="evenodd" />
                    </svg>
                    {{ Math.abs(savingsRateGrowth).toFixed(1) }}%
                  </span>
                  <span class="text-gray-500 text-xs ml-1">vs last month</span>
                </div>
              </div>
              <div class="p-2 bg-purple-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Tabs -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <div class="border-b">
            <nav class="flex -mb-px">
              <button 
                @click="currentAnalyticsTab = 'overview'" 
                :class="[
                  'py-4 px-6 font-medium text-sm border-b-2 focus:outline-none',
                  currentAnalyticsTab === 'overview' 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Overview
              </button>
              <button 
                @click="currentAnalyticsTab = 'budget'" 
                :class="[
                  'py-4 px-6 font-medium text-sm border-b-2 focus:outline-none',
                  currentAnalyticsTab === 'budget' 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Budget Tracking
              </button>
              <button 
                @click="currentAnalyticsTab = 'forecast'" 
                :class="[
                  'py-4 px-6 font-medium text-sm border-b-2 focus:outline-none',
                  currentAnalyticsTab === 'forecast' 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                Forecasting
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Overview Tab -->
            <div v-if="currentAnalyticsTab === 'overview'">
              <!-- Date Range Selector -->
              <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div class="flex flex-wrap items-center gap-2">
                  <button 
                    v-for="range in dateRanges" 
                    :key="range.id"
                    @click="setDateRange(range.id)"
                    :class="[
                      'px-3 py-1 text-sm rounded-md',
                      selectedDateRange === range.id 
                        ? 'bg-emerald-100 text-emerald-700 font-medium' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    {{ range.name }}
                  </button>
                </div>
                <div class="flex items-center gap-2">
                  <div v-if="selectedDateRange === 'custom'" class="flex items-center gap-2">
                    <input 
                      type="date" 
                      v-model="customStartDate" 
                      class="px-3 py-1 text-sm border border-gray-300 rounded-md"
                    >
                    <span class="text-gray-500">to</span>
                    <input 
                      type="date" 
                      v-model="customEndDate" 
                      class="px-3 py-1 text-sm border border-gray-300 rounded-md"
                    >
                    <button 
                      @click="applyCustomDateRange" 
                      class="px-3 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-md hover:bg-emerald-200"
                    >
                      Apply
                    </button>
                  </div>
                  <button 
                    @click="toggleChartType" 
                    class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path v-if="chartType === 'line'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      {{ chartType === 'line' ? 'Bar Chart' : 'Line Chart' }}
                    </span>
                  </button>
                  <button 
                    @click="toggleCumulativeMode" 
                    :class="[
                      'px-3 py-1 text-sm rounded-md',
                      cumulativeMode 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    <span class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                      </svg>
                      Cumulative
                    </span>
                  </button>
                </div>
              </div>

              <!-- Main Chart -->
              <div class="bg-white rounded-lg border p-4 mb-6">
                <h3 class="text-lg font-medium text-gray-800 mb-4">Financial Overview</h3>
                <div class="h-80 relative">
                  <div v-if="chartLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <svg class="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <canvas ref="trendChartCanvas"></canvas>
                </div>
              </div>

              <!-- Distribution Charts -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Income Distribution -->
                <div class="bg-white rounded-lg border p-4">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-800">Income Distribution</h3>
                    <button 
                      @click="toggleIncomeChartType" 
                      class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path v-if="incomeChartType === 'pie'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        </svg>
                        {{ incomeChartType === 'pie' ? 'Bar Chart' : 'Pie Chart' }}
                      </span>
                    </button>
                  </div>
                  <div class="h-64 relative">
                    <div v-if="incomeChartLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                      <svg class="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <canvas ref="incomeDistributionCanvas"></canvas>
                  </div>
                </div>

                <!-- Expense Distribution -->
                <div class="bg-white rounded-lg border p-4">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-800">Expense Distribution</h3>
                    <button 
                      @click="toggleExpenseChartType" 
                      class="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path v-if="expenseChartType === 'pie'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        </svg>
                        {{ expenseChartType === 'pie' ? 'Bar Chart' : 'Pie Chart' }}
                      </span>
                    </button>
                  </div>
                  <div class="h-64 relative">
                    <div v-if="expenseChartLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                      <svg class="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <canvas ref="expenseDistributionCanvas"></canvas>
                  </div>
                </div>
              </div>
            </div>

           <div v-if="currentAnalyticsTab === 'budget'">
  <!-- Month Selector and Save Button -->
  <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
    <div class="w-full sm:w-auto">
      <label for="budget-month" class="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
      <select
        id="budget-month"
        v-model="budgetMonth"
        class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
      >
        <option v-for="month in months" :key="month.id" :value="month.id">
          {{ month.name }}
        </option>
      </select>
    </div>
    <button
  @click="resetBudgetLimits"
  class="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition"
>
  Reset Limits
</button>

    <button
      @click="saveBudgetLimits"
      class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition"
      aria-label="Save budget limits"
    >
      Save Budget Limits
    </button>
    <div class="flex flex-wrap gap-3">
  <button
    @click="exportBudgetToCSV"
    class="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
  >
    Export CSV
  </button>
  <button
    @click="exportBudgetToPDF"
    class="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
  >
    Export PDF
  </button>
</div>

  </div>

  <!-- Budget Progress Display -->
  <div class="bg-white rounded-lg border p-4 mb-6 shadow-sm">
    <div class="mb-4 text-sm text-gray-600">
  Total Limit: <span class="font-semibold text-gray-800">₱{{ safeToLocaleString(totalBudgetLimit) }}</span>
</div>

    <h3 class="text-lg font-semibold text-gray-800 mb-4">Budget Progress</h3>

    <div v-if="loadingBudget" class="text-gray-500 text-sm">Loading budget limits...</div>
    
    <div v-else class="space-y-6">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="space-y-2"
      >
        <!-- Category Row -->
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">{{ category }}</span>

          <div class="flex items-center gap-4">
            <div class="flex items-center">
              <span class="text-sm text-gray-500 mr-2">Actual:</span>
              <span class="text-sm font-medium text-gray-900">
                ₱{{ safeToLocaleString(budgetData[category]?.actual || 0) }}
              </span>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-gray-500 mr-2">Limit:</span>
              <input
                type="number"
                v-model.number="budgetLimits[category]"
                class="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md"
                min="0"
              />
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full transition-all duration-300"
            :class="[
              budgetData[category]?.actual <= budgetData[category]?.limit * 0.8 ? 'bg-green-600' :
              budgetData[category]?.actual <= budgetData[category]?.limit ? 'bg-yellow-500' :
              'bg-red-600'
            ]"
            :style="{
              width: budgetData[category]?.limit > 0
                ? Math.min(100, (budgetData[category]?.actual / budgetData[category]?.limit) * 100) + '%'
                : '0%'
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</div>


            <!-- Forecasting Tab -->
            <div v-if="currentAnalyticsTab === 'forecast'">
              <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <label for="forecast-months" class="block text-sm font-medium text-gray-700 mb-1">Forecast Period (Months)</label>
                  <select 
                    id="forecast-months" 
                    v-model="forecastMonths"
                    class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                  >
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              </div>

              <!-- Forecast Chart -->
              <div class="bg-white rounded-lg border p-4 mb-6">
                <h3 class="text-lg font-medium text-gray-800 mb-4">Financial Forecast</h3>
                <div class="h-80 relative">
                  <div v-if="forecastChartLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <svg class="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <canvas ref="forecastChartCanvas"></canvas>
                </div>
              </div>

              <!-- Forecast Summary -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div class="bg-white rounded-lg border p-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Forecasted Income</h4>
                  <div class="text-2xl font-bold text-gray-800">₱{{ safeToLocaleString(forecastedIncome) }}</div>
                  <div class="flex items-center mt-1">
                    <span :class="[
                      forecastedIncomeGrowth >= 0 ? 'text-green-600' : 'text-red-600',
                      'text-sm font-medium flex items-center'
                    ]">
                      <svg v-if="forecastedIncomeGrowth >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.414 14.586 14H12z" clip-rule="evenodd" />
                      </svg>
                      {{ Math.abs(forecastedIncomeGrowth).toFixed(1) }}%
                    </span>
                    <span class="text-gray-500 text-xs ml-1">vs current</span>
                  </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Forecasted Expenses</h4>
                  <div class="text-2xl font-bold text-gray-800">₱{{ safeToLocaleString(forecastedExpenses) }}</div>
                  <div class="flex items-center mt-1">
                    <span :class="[
                      forecastedExpenseGrowth <= 0 ? 'text-green-600' : 'text-red-600',
                      'text-sm font-medium flex items-center'
                    ]">
                      <svg v-if="forecastedExpenseGrowth <= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.414 14.586 14H12z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                      </svg>
                      {{ Math.abs(forecastedExpenseGrowth).toFixed(1) }}%
                    </span>
                    <span class="text-gray-500 text-xs ml-1">vs current</span>
                  </div>
                </div>
                <div class="bg-white rounded-lg border p-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Forecasted Profit</h4>
                  <div class="text-2xl font-bold text-gray-800">₱{{ safeToLocaleString(forecastedProfit) }}</div>
                  <div class="flex items-center mt-1">
                    <span :class="[
                      forecastedProfitGrowth >= 0 ? 'text-green-600' : 'text-red-600',
                      'text-sm font-medium flex items-center'
                    ]">
                      <svg v-if="forecastedProfitGrowth >= 0" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 10.414 14.586 14H12z" clip-rule="evenodd" />
                      </svg>
                      {{ Math.abs(forecastedProfitGrowth).toFixed(1) }}%
                    </span>
                    <span class="text-gray-500 text-xs ml-1">vs current</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction Form -->
        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-800 mb-4">{{ isEditing ? 'Edit Transaction' : 'Add New Transaction' }}</h2>
          <form @submit.prevent="isEditing ? updateTransaction() : addTransaction()">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (₱)</label>
                <input 
                  type="number" 
                  id="amount" 
                  v-model="amount" 
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                >
                <p v-if="formErrors.amount" class="mt-1 text-sm text-red-600">{{ formErrors.amount }}</p>
              </div>
              <div>
                <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select 
                  id="type" 
                  v-model="type"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  id="category" 
                  v-model="category"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                  <option v-for="(cat, index) in categories" :key="index" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div>
                <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  v-model="transactionDate" 
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
              </div>
            </div>
            <div class="mb-4">
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea 
                id="notes" 
                v-model="notes" 
                rows="2"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Add any additional details here..."
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button 
                v-if="isEditing"
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                :disabled="loading"
              >
                <span v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isEditing ? 'Updating...' : 'Adding...' }}
                </span>
                <span v-else>{{ isEditing ? 'Update Transaction' : 'Add Transaction' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Transaction List -->
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div class="flex flex-col md:flex-row justify-between items-center p-4 border-b">
            <h2 class="text-xl font-bold text-gray-800 mb-2 md:mb-0">Transaction History</h2>
            <div class="flex flex-wrap items-center gap-2">
              <div class="relative">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Search transactions..." 
                  class="pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                >
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button 
                @click="generateReport" 
                class="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <span class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Report
                </span>
              </button>
            </div>
          </div>
          
          <!-- Transaction Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('date')"
                  >
                    <div class="flex items-center">
                      Date
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" :class="getSortIcon('date')" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('type')"
                  >
                    <div class="flex items-center">
                      Type
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" :class="getSortIcon('type')" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('category')"
                  >
                    <div class="flex items-center">
                      Category
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" :class="getSortIcon('category')" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    @click="sortBy('amount')"
                  >
                    <div class="flex items-center">
                      Amount
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" :class="getSortIcon('amount')" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="paginatedTransactions.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">
                    No transactions found. Add your first transaction above.
                  </td>
                </tr>
                <tr v-for="transaction in paginatedTransactions" :key="transaction.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(transaction.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 text-xs font-medium rounded-full',
                      transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ transaction.type === 'income' ? 'Income' : 'Expense' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex items-center">
                      <i :class="getCategoryIcon(transaction.category)" class="mr-2"></i>
                      {{ transaction.category }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium" :class="transaction.type === 'income' ? 'text-green-600' : 'text-red-600'">
                    {{ transaction.type === 'income' ? '+' : '-' }}₱{{ safeToLocaleString(transaction.amount) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {{ transaction.notes || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button 
                        @click="editTransaction(transaction)" 
                        class="text-emerald-600 hover:text-emerald-900"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        @click="confirmDelete(transaction)" 
                        class="text-red-600 hover:text-red-900"
                        :disabled="transaction.deleting"
                        title="Delete"
                      >
                        <svg v-if="!transaction.deleting" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <svg v-else class="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
          <div class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div class="flex-1 flex justify-between sm:hidden">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
                  currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                ]"
              >
                Previous
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                :class="[
                  'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
                  currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                ]"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ ((currentPage - 1) * itemsPerPage) + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredTransactions.length }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button 
                    @click="prevPage" 
                    :disabled="currentPage === 1"
                    :class="[
                      'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    ]"
                  >
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    v-for="page in totalPages" 
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      currentPage === page 
                        ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600' 
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    :class="[
                      'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500',
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    ]"
                  >
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ modalTitle }}</h3>
        <p class="text-gray-500 mb-4">{{ modalMessage }}</p>
        <div class="flex justify-end gap-2">
          <button @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button @click="handleModalConfirm" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            {{ modalConfirmText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm mx-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
        <p class="text-gray-500 mb-4">Are you sure you want to log out of your account?</p>
        <div class="flex justify-end gap-2">
          <button @click="showLogoutModal = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancel
          </button>
          <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div 
      v-if="toast.show" 
      class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
      :class="{
        'bg-green-100 text-green-800 border-l-4 border-green-500': toast.type === 'success',
        'bg-red-100 text-red-800 border-l-4 border-red-500': toast.type === 'error'
      }"
    >
      <svg 
        v-if="toast.type === 'success'" 
        class="h-5 w-5 mr-2" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <svg 
        v-if="toast.type === 'error'" 
        class="h-5 w-5 mr-2" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 20 20" 
        fill="currentColor"
      >
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  getDoc,
  setDoc, 
  onSnapshot, 
  query, 
  orderBy,
  where,
  Timestamp 
} from "firebase/firestore";
import { db } from "../../firebase";
import Chart from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';


// State
const auth = getAuth();
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
const transactionDate = ref(new Date().toISOString().split('T')[0]);
const chartCanvas = ref(null);
const trendChartCanvas = ref(null);
const incomeDistributionCanvas = ref(null);
const expenseDistributionCanvas = ref(null);
const forecastChartCanvas = ref(null);
const isEditing = ref(false);
const editingTransactionId = ref(null);
const loading = ref(false);
const chartLoading = ref(false);
const incomeChartLoading = ref(false);
const expenseChartLoading = ref(false);
const forecastChartLoading = ref(false);
const showModal = ref(false);
const modalType = ref("");
const selectedTransaction = ref(null);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 10;
const sortColumn = ref("date");
const sortDirection = ref("desc");
const chartType = ref("line");
const incomeChartType = ref("pie");
const expenseChartType = ref("pie");
const cumulativeMode = ref(false);
const selectedMonth = ref(new Date().getMonth() + 1);
const formErrors = ref({});
const toast = ref({ show: false, message: '', type: '' });
const username = ref("");
const role = ref("user");
const sidebarOpen = ref(true);
const userMenuOpen = ref(false);
const notificationCount = ref(3);
const isMobile = ref(false);
const userMenuRef = ref(null);
const showLogoutModal = ref(false);
const currentAnalyticsTab = ref('overview');
const selectedDateRange = ref('month');
const customStartDate = ref(new Date().toISOString().split('T')[0]);
const customEndDate = ref(new Date().toISOString().split('T')[0]);
const startDate = ref(new Date());
const endDate = ref(new Date());
const budgetMonth = ref(new Date().getMonth() + 1);
const budgetLimits = ref({});
const forecastMonths = ref(6);

let chartInstance = null;
let trendChartInstance = null;
let incomeChartInstance = null;
let expenseChartInstance = null;
let forecastChartInstance = null;

// Router
const router = useRouter();
const route = useRoute();
const currentRoute = computed(() => route.path);

// Analytics Tabs
const analyticsTabs = [
  { id: 'overview', name: 'Overview', icon: 'chart-bar' },
  { id: 'budget', name: 'Budget Tracking', icon: 'dollar-sign' },
  { id: 'forecast', name: 'Forecasting', icon: 'trending-up' }
];

// Date Ranges
const dateRanges = [
  { id: 'week', name: 'This Week' },
  { id: 'month', name: 'This Month' },
  { id: 'quarter', name: 'This Quarter' },
  { id: 'year', name: 'This Year' },
  { id: 'custom', name: 'Custom Range' }
];

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
  const totalItems = filteredTransactions.value.length;

  // Ensure currentPage does not exceed totalPages
  if (start >= totalItems) {
    currentPage.value = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }

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

const savingsRate = computed(() => {
  if (totalIncome.value === 0) return 0;
  return (netProfit.value / totalIncome.value) * 100;
});

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

// Growth rates
const incomeGrowth = computed(() => {
  const currentMonthIncome = getMonthlyTotal('income', new Date().getMonth());
  const lastMonthIncome = getMonthlyTotal('income', new Date().getMonth() - 1);
  
  if (lastMonthIncome === 0) return 100;
  return ((currentMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;
});

const expenseGrowth = computed(() => {
  const currentMonthExpense = getMonthlyTotal('expense', new Date().getMonth());
  const lastMonthExpense = getMonthlyTotal('expense', new Date().getMonth() - 1);
  
  if (lastMonthExpense === 0) return 100;
  return ((currentMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
});

const profitGrowth = computed(() => {
  const currentMonthProfit = getMonthlyTotal('income', new Date().getMonth()) - getMonthlyTotal('expense', new Date().getMonth());
  const lastMonthProfit = getMonthlyTotal('income', new Date().getMonth() - 1) - getMonthlyTotal('expense', new Date().getMonth() - 1);
  
  if (lastMonthProfit === 0) return 100;
  return ((currentMonthProfit - lastMonthProfit) / Math.abs(lastMonthProfit)) * 100;
});

const savingsRateGrowth = computed(() => {
  const currentMonthIncome = getMonthlyTotal('income', new Date().getMonth());
  const lastMonthIncome = getMonthlyTotal('income', new Date().getMonth() - 1);
  const currentMonthExpense = getMonthlyTotal('expense', new Date().getMonth());
  const lastMonthExpense = getMonthlyTotal('expense', new Date().getMonth() - 1);
  
  const currentSavingsRate = currentMonthIncome === 0 ? 0 : ((currentMonthIncome - currentMonthExpense) / currentMonthIncome) * 100;
  const lastSavingsRate = lastMonthIncome === 0 ? 0 : ((lastMonthIncome - lastMonthExpense) / lastMonthIncome) * 100;
  
  if (lastSavingsRate === 0) return 100;
  return currentSavingsRate - lastSavingsRate;
});

// Budget data
const budgetData = computed(() => {
  const data = {};
  
  categories.value.forEach(cat => {
    const actual = transactions.value
      .filter(t => t.type === 'expense' && t.category === cat && getTransactionMonth(t) === budgetMonth.value)
      .reduce((sum, t) => sum + t.amount, 0);
      
    data[cat] = {
      actual,
      limit: budgetLimits.value[cat] || 0
    };
  });
  
  return data;
});

// Forecast data
const forecastedIncome = computed(() => {
  const monthlyAverage = getMonthlyAverage('income');
  return monthlyAverage * parseInt(forecastMonths.value);
});

const forecastedExpenses = computed(() => {
  const monthlyAverage = getMonthlyAverage('expense');
  return monthlyAverage * parseInt(forecastMonths.value);
});

const forecastedProfit = computed(() => forecastedIncome.value - forecastedExpenses.value);

const forecastedIncomeGrowth = computed(() => {
  if (totalIncome.value === 0) return 100;
  return ((forecastedIncome.value - totalIncome.value) / totalIncome.value) * 100;
});

const forecastedExpenseGrowth = computed(() => {
  if (totalExpenses.value === 0) return 100;
  return ((forecastedExpenses.value - totalExpenses.value) / totalExpenses.value) * 100;
});

const forecastedProfitGrowth = computed(() => {
  if (netProfit.value === 0) return 100;
  return ((forecastedProfit.value - netProfit.value) / Math.abs(netProfit.value)) * 100;
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
  try {
    const user = auth.currentUser;
    if (!user) {
      showError('Please sign in to manage your transactions');
      return; // Prevent further execution
    }

    const transactionsRef = collection(db, 'users', user.uid, 'transactions');
    const q = query(transactionsRef, orderBy('date', 'desc'));

    onSnapshot(q, (snapshot) => {
      transactions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        deleting: false
      }));
      updateAllCharts();
    }, (error) => {
      console.error("Error fetching transactions:", error);
      showError('Error loading transactions. Please try again.');
    });
  } catch (error) {
    console.error("Error in fetchTransactions:", error);
    showError('Error connecting to database. Please try again.');
  }
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
      date: Timestamp.fromDate(new Date(transactionDate.value)),
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
        date: Timestamp.fromDate(new Date(transactionDate.value)),
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
const updateAllCharts = async () => {
  updateChart();
  updateTrendChart();
  updateIncomeDistributionChart();
  updateExpenseDistributionChart();
  updateForecastChart();
  updateBudgetChart();
};

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
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: value => `₱${value.toLocaleString()}`
          }
        }
      },
      plugins: {
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

const updateTrendChart = async () => {
  chartLoading.value = true;
  await nextTick();

  if (!trendChartCanvas.value) {
    chartLoading.value = false;
    return;
  }

  const ctx = trendChartCanvas.value.getContext('2d');
  const trendData = getTrendData();

  if (trendChartInstance) {
    trendChartInstance.destroy();
  }

  const config = {
    type: chartType.value,
    data: {
      labels: trendData.labels,
      datasets: [
        {
          label: 'Income',
          data: trendData.income,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: trendData.expenses,
          borderColor: 'rgb(244, 63, 94)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          tension: 0.4
        },
        {
          label: 'Net Profit',
          data: trendData.profit,
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
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: value => `₱${value.toLocaleString()}`
          }
        }
      },
      plugins: {
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

  trendChartInstance = new Chart(ctx, config);
  chartLoading.value = false;
};

const updateIncomeDistributionChart = async () => {
  incomeChartLoading.value = true;
  await nextTick();
  
  if (!incomeDistributionCanvas.value) {
    incomeChartLoading.value = false;
    return;
  }

  const ctx = incomeDistributionCanvas.value.getContext('2d');
  const distributionData = getCategoryDistribution('income');

  if (incomeChartInstance) {
    incomeChartInstance.destroy();
  }

  const config = {
    type: incomeChartType.value,
    data: {
      labels: distributionData.labels,
      datasets: [
        {
          label: 'Income',
          data: distributionData.values,
          backgroundColor: [
            'rgba(16, 185, 129, 0.7)',
            'rgba(14, 165, 233, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(217, 70, 239, 0.7)',
            'rgba(79, 70, 229, 0.7)'
          ],
          borderColor: 'white',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += `₱${context.parsed.toLocaleString()}`;
              }
              return label;
            }
          }
        }
      }
    }
  };

  incomeChartInstance = new Chart(ctx, config);
  incomeChartLoading.value = false;
};

const updateExpenseDistributionChart = async () => {
  expenseChartLoading.value = true;
  await nextTick();
  
  if (!expenseDistributionCanvas.value) {
    expenseChartLoading.value = false;
    return;
  }

  const ctx = expenseDistributionCanvas.value.getContext('2d');
  const distributionData = getCategoryDistribution('expense');

  if (expenseChartInstance) {
    expenseChartInstance.destroy();
  }

  const config = {
    type: expenseChartType.value,
    data: {
      labels: distributionData.labels,
      datasets: [
        {
          label: 'Expenses',
          data: distributionData.values,
          backgroundColor: [
            'rgba(244, 63, 94, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(168, 85, 247, 0.7)',
            'rgba(59, 130, 246, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(217, 70, 239, 0.7)',
            'rgba(14, 165, 233, 0.7)',
            'rgba(79, 70, 229, 0.7)'
          ],
          borderColor: 'white',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== null) {
                label += `₱${context.parsed.toLocaleString()}`;
              }
              return label;
            }
          }
        }
      }
    }
  };

  expenseChartInstance = new Chart(ctx, config);
  expenseChartLoading.value = false;
};

const updateForecastChart = async () => {
  forecastChartLoading.value = true;
  await nextTick();
  
  if (!forecastChartCanvas.value) {
    forecastChartLoading.value = false;
    return;
  }

  const ctx = forecastChartCanvas.value.getContext('2d');
  const forecastData = getForecastData();

  if (forecastChartInstance) {
    forecastChartInstance.destroy();
  }

  const config = {
    type: 'line',
    data: {
      labels: forecastData.labels,
      datasets: [
        {
          label: 'Income',
          data: forecastData.income,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: forecastData.expenses,
          borderColor: 'rgb(244, 63, 94)',
          backgroundColor: 'rgba(244, 63, 94, 0.1)',
          tension: 0.4
        },
        {
          label: 'Net Profit',
          data: forecastData.profit,
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
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            callback: value => `₱${value.toLocaleString()}`
          }
        }
      },
      plugins: {
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

  forecastChartInstance = new Chart(ctx, config);
  forecastChartLoading.value = false;
};

const updateBudgetChart = () => {
  // This function would update any budget-related charts
  // For now, we're using progress bars instead of charts
};

const toggleChartType = () => {
  chartType.value = chartType.value === 'line' ? 'bar' : 'line';
  updateChart();
  updateTrendChart();
};

const toggleIncomeChartType = () => {
  incomeChartType.value = incomeChartType.value === 'pie' ? 'bar' : 'pie';
  updateIncomeDistributionChart();
};

const toggleExpenseChartType = () => {
  expenseChartType.value = expenseChartType.value === 'pie' ? 'bar' : 'pie';
  updateExpenseDistributionChart();
};

const toggleCumulativeMode = () => {
  cumulativeMode.value = !cumulativeMode.value;
  updateTrendChart();
};

// Date Range Methods
const setDateRange = (rangeId) => {
  selectedDateRange.value = rangeId;
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (rangeId) {
    case 'week':
      // Start of current week (Sunday)
      startDate.value = new Date(startOfDay);
      startDate.value.setDate(startDate.value.getDate() - startDate.value.getDay());
      endDate.value = new Date();
      break;
    case 'month':
      // Start of current month
      startDate.value = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate.value = new Date();
      break;
    case 'quarter':
      // Start of current quarter
      const quarter = Math.floor(now.getMonth() / 3);
      startDate.value = new Date(now.getFullYear(), quarter * 3, 1);
      endDate.value = new Date();
      break;
    case 'year':
      // Start of current year
      startDate.value = new Date(now.getFullYear(), 0, 1);
      endDate.value = new Date();
      break;
    case 'custom':
      // Don't change dates, just enable custom inputs
      break;
  }
  
  updateTrendChart();
};

const applyCustomDateRange = () => {
  if (customStartDate.value && customEndDate.value) {
    if (new Date(customStartDate.value) > new Date(customEndDate.value)) {
      showError('Start date cannot be later than end date');
      return;
    }
    startDate.value = new Date(customStartDate.value);
    endDate.value = new Date(customEndDate.value);
    updateTrendChart();
  }
};

// Budget Methods
const saveBudgetLimits = async () => {
  const user = auth.currentUser;
  if (!user) {
    showError('Please sign in to save budget limits');
    return;
  }

  try {
    const docRef = doc(db, 'users', user.uid, 'budgets', `month-${budgetMonth.value}`);
    await setDoc(docRef, budgetLimits.value, { merge: true });

    showSuccess('Budget limits saved successfully');
    updateBudgetChart();
  } catch (error) {
    console.error("Error saving budget limits:", error);
    showError('Failed to save budget limits. Please try again.');
  }
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

const getTrendData = () => {
  // Filter transactions by date range
  const filteredTransactions = transactions.value.filter(t => {
    const date = new Date(t.date.seconds * 1000);
    return date >= startDate.value && date <= endDate.value;
  });
  
  // Group by day, week, or month depending on range size
  const diffDays = Math.ceil((endDate.value - startDate.value) / (1000 * 60 * 60 * 24));
  let groupBy = 'day';
  
  if (diffDays > 90) {
    groupBy = 'month';
  } else if (diffDays > 14) {
    groupBy = 'week';
  }
  
  const groups = {};
  let labels = [];
  
  // Create empty groups
  if (groupBy === 'day') {
    for (let d = new Date(startDate.value); d <= endDate.value; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split('T')[0];
      groups[key] = { income: 0, expenses: 0 };
      labels.push(d.toLocaleDateString('default', { month: 'short', day: 'numeric' }));
    }
  } else if (groupBy === 'week') {
    const startWeek = new Date(startDate.value);
    startWeek.setDate(startWeek.getDate() - startWeek.getDay()); // Start of week (Sunday)
    
    for (let d = new Date(startWeek); d <= endDate.value; d.setDate(d.getDate() + 7)) {
      const endOfWeek = new Date(d);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      const key = `${d.toISOString().split('T')[0]}_${endOfWeek.toISOString().split('T')[0]}`;
      groups[key] = { income: 0, expenses: 0 };
      labels.push(`${d.toLocaleDateString('default', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' })}`);
    }
  } else if (groupBy === 'month') {
    const startMonth = new Date(startDate.value.getFullYear(), startDate.value.getMonth(), 1);
    
    for (let d = new Date(startMonth); d <= endDate.value; d.setMonth(d.getMonth() + 1)) {
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      groups[key] = { income: 0, expenses: 0 };
      labels.push(d.toLocaleDateString('default', { month: 'short', year: 'numeric' }));
    }
  }
  
  // Populate data
  filteredTransactions.forEach(t => {
    const date = new Date(t.date.seconds * 1000);
    let key;
    
    if (groupBy === 'day') {
      key = date.toISOString().split('T')[0];
    } else if (groupBy === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      key = `${startOfWeek.toISOString().split('T')[0]}_${endOfWeek.toISOString().split('T')[0]}`;
    } else if (groupBy === 'month') {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }
    
    if (groups[key]) {
      if (t.type === 'income') {
        groups[key].income += t.amount;
      } else {
        groups[key].expenses += t.amount;
      }
    }
  });
  
  // Convert to arrays
  const keys = Object.keys(groups);
  let income = keys.map(key => groups[key].income);
  let expenses = keys.map(key => groups[key].expenses);
  
  // Calculate cumulative values if needed
  if (cumulativeMode.value) {
    income = income.reduce((acc, val, i) => {
      acc.push((acc[i-1] || 0) + val);
      return acc;
    }, []);
    
    expenses = expenses.reduce((acc, val, i) => {
      acc.push((acc[i-1] || 0) + val);
      return acc;
    }, []);
  }
  
  const profit = income.map((val, i) => val - expenses[i]);
  
  return { labels, income, expenses, profit };
};

const getCategoryDistribution = (type) => {
  // Filter transactions by date range and type
  const filteredTransactions = transactions.value.filter(t => {
    const date = new Date(t.date.seconds * 1000);
    return date >= startDate.value && date <= endDate.value && t.type === type;
  });
  
  // Group by category
  const categoryTotals = {};
  
  filteredTransactions.forEach(t => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = 0;
    }
    categoryTotals[t.category] += t.amount;
  });
  
  // Sort by amount (descending)
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10); // Top 10 categories
  
  const labels = sortedCategories.map(([category]) => category);
  const values = sortedCategories.map(([, amount]) => amount);
  
  return { labels, values };
};

const getForecastData = () => {
  const now = new Date();
  const labels = [];
  const income = [];
  const expenses = [];
  const profit = [];

  // Get monthly averages
  const monthlyIncomeAvg = getMonthlyAverage('income');
  const monthlyExpenseAvg = getMonthlyAverage('expense');

  // Generate forecast for the next X months
  for (let i = 0; i < parseInt(forecastMonths.value); i++) {
    const forecastDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
    labels.push(forecastDate.toLocaleDateString('default', { month: 'short', year: 'numeric' }));

    // Apply a small random variation to make the forecast more realistic
    const incomeVariation = 1 + (Math.random() * 0.2 - 0.1); // ±10%
    const expenseVariation = 1 + (Math.random() * 0.2 - 0.1); // ±10%

    const monthIncome = monthlyIncomeAvg * incomeVariation;
    const monthExpense = monthlyExpenseAvg * expenseVariation;

    income.push(monthIncome);
    expenses.push(monthExpense);
    profit.push(monthIncome - monthExpense);
  }

  return { labels, income, expenses, profit }; // Ensure this is inside the function
};

const getMonthlyAverage = (type) => {
  // Group transactions by month
  const monthlyTotals = {};
  
  transactions.value.forEach(t => {
    if (t.type !== type) return;
    
    const date = new Date(t.date.seconds * 1000);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!monthlyTotals[key]) {
      monthlyTotals[key] = 0;
    }
    
    monthlyTotals[key] += t.amount;
  });
  
  // Calculate average
  const months = Object.values(monthlyTotals);
  if (months.length === 0) return 0;
  
  return months.reduce((sum, val) => sum + val, 0) / months.length;
};

const getMonthlyTotal = (type, month) => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  
  return transactions.value
    .filter(t => {
      const date = new Date(t.date.seconds * 1000);
      return t.type === type && date >= startOfMonth && date <= endOfMonth;
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

const getTransactionMonth = (transaction) => {
  const date = new Date(transaction.date.seconds * 1000);
  return date.getMonth() + 1; // JavaScript months are 0-indexed
};

const formatDate = (date) => {
  if (typeof date === 'string') return date;
  
  return new Date(date.seconds * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const resetForm = () => {
  amount.value = '';
  notes.value = '';
  isEditing.value = false;
  editingTransactionId.value = null;
  type.value = 'income';
  category.value = categories.value[0];
  transactionDate.value = new Date().toISOString().split('T')[0];
  formErrors.value = {};
};

const editTransaction = (transaction) => {
  amount.value = transaction.amount;
  type.value = transaction.type;
  category.value = transaction.category;
  notes.value = transaction.notes || '';
  transactionDate.value = new Date(transaction.date.seconds * 1000).toISOString().split('T')[0];
  isEditing.value = true;
  editingTransactionId.value = transaction.id;
};

const cancelEdit = () => {
  resetForm();
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
    'Crop Sales': 'fas fa-seedling text-green-600',
    'Equipment Sales': 'fas fa-tools text-blue-600',
    'Consulting': 'fas fa-comments text-purple-600',
    'Utilities': 'fas fa-bolt text-yellow-600',
    'Nutrients': 'fas fa-flask text-pink-600',
    'Equipment': 'fas fa-cogs text-gray-600',
    'Maintenance': 'fas fa-wrench text-orange-600',
    'Labor': 'fas fa-users text-indigo-600',
    'Marketing': 'fas fa-bullhorn text-red-600',
    'Other': 'fas fa-ellipsis-h text-gray-500'
  };
  return icons[category] || 'fas fa-tag text-gray-500';
};

const getSortIcon = (column) => {
  if (sortColumn.value !== column) return 'fas fa-sort text-gray-400';
  return sortDirection.value === 'asc' ? 'fas fa-sort-up text-green-600' : 'fas fa-sort-down text-green-600';
};

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const generateReport = async () => {
  const doc = new jsPDF();
  
  // Title and Header
  doc.setFontSize(20);
  doc.setTextColor(44, 62, 80);
  doc.text('Financial Report', 105, 15, { align: 'center' });
  
  // Date Range
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Period: ${formatDate(startDate.value)} to ${formatDate(endDate.value)}`, 105, 22, { align: 'center' });
  
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
      ['Net Profit', `₱${netProfit.value.toLocaleString()}`],
      ['Savings Rate', `${savingsRate.value.toFixed(1)}%`]
    ],
    theme: 'grid',
    headStyles: { 
      fillColor: [22, 163, 74],
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
      fillColor: [22, 163, 74],
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
      fillColor: [22, 163, 74],
      textColor: 255
    }
  });

  // Save the PDF
  doc.save(`EcoMist-Financial-Report-${new Date().toISOString().split('T')[0]}.pdf`);
};

const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    userMenuOpen.value = false;
  }
};

const checkIfMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    sidebarOpen.value = false;
  } else {
    // Get saved sidebar state or default to open on desktop
    const savedState = localStorage.getItem('sidebarOpen');
    sidebarOpen.value = savedState !== null ? savedState === 'true' : true;
  }
};



// Ensure safe usage of toLocaleString
const safeToLocaleString = (value) => {
  return value != null ? value.toLocaleString() : '0';
};

// Initialize budget limits with default values
onMounted(() => {
  categories.value.forEach(cat => {
    budgetLimits.value[cat] = 0;

    // Trigger the watch() logic manually for initial mount
  budgetMonth.value = new Date().getMonth() + 1;

  loadBudgetLimits();
  });
  
  // Set some sample budget limits for demonstration
  budgetLimits.value['Utilities'] = 5000;
  budgetLimits.value['Equipment'] = 10000;
  budgetLimits.value['Maintenance'] = 3000;
  budgetLimits.value['Labor'] = 15000;
  budgetLimits.value['Marketing'] = 7500;
  
  // Set default date range
  setDateRange('month');
  
  fetchTransactions();
  
  // Check if mobile on initial load
  checkIfMobile();
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
  
  // Add click outside listener for user menu
  document.addEventListener('click', handleClickOutside);
  
  // Cleanup on component unmount
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('click', handleClickOutside);

    // Correctly destroy all chart instances
    if (chartInstance) chartInstance.destroy();
    if (trendChartInstance) trendChartInstance.destroy();
    if (incomeChartInstance) incomeChartInstance.destroy();
    if (expenseChartInstance) expenseChartInstance.destroy();
    if (forecastChartInstance) forecastChartInstance.destroy();
  });
});

// Handle window resize
const handleResize = () => {
  checkIfMobile();
};

// Watch for changes that require chart updates
watch([selectedMonth, transactions], () => {
  updateAllCharts();
});

// Watch for route changes to close sidebar on mobile
watch(currentRoute, () => {
  if (isMobile.value) {
    sidebarOpen.value = false;
    document.body.style.overflow = '';
  }
  // Close user menu when route changes
  userMenuOpen.value = false;
});

// Watch for analytics tab changes
watch(currentAnalyticsTab, () => {
  nextTick(() => {
    updateAllCharts();
  });
});

// Fetch the logged-in user's name
onAuthStateChanged(auth, (user) => {
  if (user) {
    username.value = user.displayName || "User";
  } else {
    username.value = "Guest";
  }
});
//added
const loadBudgetLimits = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    loadingBudget.value = true;
    const docRef = doc(db, 'users', user.uid, 'budgets', `month-${budgetMonth.value}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const savedLimits = docSnap.data();
      const updatedLimits = {};
      categories.value.forEach(cat => {
        updatedLimits[cat] = savedLimits[cat] ?? 0;
      });
      Object.assign(budgetLimits.value, updatedLimits);
    } else {
      categories.value.forEach(cat => {
        budgetLimits.value[cat] = 0;
      });
    }
  } catch (error) {
    console.error("Error loading budget limits:", error);
    showError('Failed to load budget limits');
  } finally {
    loadingBudget.value = false;
  }
};

const loadingBudget = ref(false);

watch(budgetMonth, async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    loadingBudget.value = true;
    const docRef = doc(db, 'users', user.uid, 'budgets', `month-${budgetMonth.value}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const savedLimits = docSnap.data();
      const updatedLimits = {};
      categories.value.forEach(cat => {
        updatedLimits[cat] = savedLimits[cat] ?? 0;
      });
      Object.assign(budgetLimits.value, updatedLimits);
    } else {
      categories.value.forEach(cat => {
        budgetLimits.value[cat] = 0;
      });
    }
  } catch (error) {
    console.error("Error loading budget limits:", error);
    showError('Failed to load budget limits');
  } finally {
    loadingBudget.value = false;
  }
});

watch(budgetMonth, () => {
  loadBudgetLimits();
});

const resetBudgetLimits = async () => {
  categories.value.forEach(cat => {
    budgetLimits.value[cat] = 0;
  });
  await saveBudgetLimits(); // ✅ Save immediately
  showSuccess('Budget limits have been reset and saved');
};


const totalBudgetLimit = computed(() => {
  return Object.values(budgetLimits.value).reduce((sum, val) => sum + (Number(val) || 0), 0);
});


const exportBudgetToCSV = () => {
  let csv = 'Category,Actual,Limit\n';
  categories.value.forEach(cat => {
    const actual = budgetData[cat]?.actual || 0;
    const limit = budgetLimits.value[cat] || 0;
    csv += `${cat},${actual},${limit}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Budget-${budgetMonth.value}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const exportBudgetToPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`Budget Report - Month ${budgetMonth.value}`, 14, 15);

  const tableData = categories.value.map(cat => [
    cat,
    `₱${safeToLocaleString(budgetData[cat]?.actual || 0)}`,
    `₱${safeToLocaleString(budgetLimits.value[cat] || 0)}`
  ]);

  autoTable(doc, {
    startY: 25,
    head: [['Category', 'Actual', 'Limit']],
    body: tableData
  });

  doc.save(`Budget-${budgetMonth.value}.pdf`);
};
</script>

<style>
/* Custom styles for the financial management component */
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none !important;
  }
}

/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
</style>