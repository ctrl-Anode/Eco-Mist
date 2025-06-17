<template>
  <section class="px-4 sm:px-6 py-12 sm:py-16 relative z-10">
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="bg-white/95 backdrop-blur-sm rounded-2xl border border-green-100 shadow-xl p-8 text-center transition-all hover:-translate-y-2 duration-300 group"
      >
        <div class="text-green-600 mb-6 flex justify-center items-center">
          <div
            class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors"
          >
            <component :is="stat.icon" class="w-8 h-8" />
          </div>
        </div>
        <div class="text-green-800 text-4xl sm:text-5xl font-bold mb-2">{{ stat.value }}</div>
        <div class="text-gray-600 font-medium">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { h } from 'vue';

const stats = [
  {
    icon: () =>
      h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        viewBox: '0 0 24 24',
      }, [
        h('path', { d: 'M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8' }),
        h('path', { d: 'm22 20-3-3-3 3' }),
        h('path', { d: 'M19 17v9' }),
        h('path', { d: 'M9 10l1 1 3-3' }),
      ]),
    value: '95%',
    label: 'Water Savings',
  },
  {
    icon: () =>
      h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        viewBox: '0 0 24 24',
      }, [
        h('path', { d: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z' }),
      ]),
    value: '40%',
    label: 'Energy Efficient',
  },
  {
    icon: () =>
      h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        viewBox: '0 0 24 24',
      }, [
        h('path', { d: 'M12 10V5a3 3 0 1 1 3 3H5a3 3 0 0 1 3-3v5' }),
        h('path', { d: 'M12 14a3 3 0 1 0 3 3' }),
        h('path', { d: 'M12 14a3 3 0 1 1-3 3' }),
        h('path', { d: 'M7 21h10' }),
      ]),
    value: '3x',
    label: 'Faster Growth',
  },
  {
    icon: () =>
      h('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        viewBox: '0 0 24 24',
      }, [
        h('line', { x1: '18', y1: '20', x2: '18', y2: '10' }),
        h('line', { x1: '12', y1: '20', x2: '12', y2: '4' }),
        h('line', { x1: '6', y1: '20', x2: '6', y2: '14' }),
      ]),
    value: '24/7',
    label: 'Monitoring',
  },
];
</script>
