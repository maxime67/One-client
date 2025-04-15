<template>
  <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden p-5">
    <h3 class="text-lg font-medium text-white mb-4">CVE Severity Distribution</h3>

    <div class="relative h-60">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6">
      <div v-for="(item, index) in severityItems" :key="index"
           class="flex flex-col items-center p-2 rounded"
           :class="`bg-${item.color}-500/10 border border-${item.color}-500/20`">
        <div class="text-xl font-bold" :class="`text-${item.color}-400`">{{ item.count }}</div>
        <div class="text-sm text-gray-400">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

export default {
  name: 'SeverityDistribution',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
        NONE: 0
      })
    }
  },
  setup(props) {
    const chartCanvas = ref(null);
    let chart = null;

    const severityConfig = [
      { label: 'Critical', color: 'danger', key: 'CRITICAL' },
      { label: 'High', color: 'warning', key: 'HIGH' },
      { label: 'Medium', color: 'orange', key: 'MEDIUM' },
      { label: 'Low', color: 'success', key: 'LOW' },
      { label: 'None', color: 'gray', key: 'NONE' }
    ];

    const createChart = () => {
      if (!chartCanvas.value) return;

      // Get background colors
      const bgColors = [
        'rgba(255, 85, 85, 0.7)',    // danger-500
        'rgba(255, 211, 51, 0.7)',   // warning-500
        'rgba(249, 115, 22, 0.7)',   // orange-500 (tailwind)
        'rgba(55, 221, 105, 0.7)',   // success-500
        'rgba(75, 85, 99, 0.7)'      // gray-600
      ];

      const borderColors = [
        'rgb(255, 85, 85)',    // danger-500
        'rgb(255, 211, 51)',   // warning-500
        'rgb(249, 115, 22)',   // orange-500 (tailwind)
        'rgb(55, 221, 105)',   // success-500
        'rgb(75, 85, 99)'      // gray-600
      ];

      // Get data values
      const dataValues = severityConfig.map(item => props.data[item.key] || 0);

      // Create chart
      const ctx = chartCanvas.value.getContext('2d');
      chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: severityConfig.map(item => item.label),
          datasets: [{
            data: dataValues,
            backgroundColor: bgColors,
            borderColor: borderColors,
            borderWidth: 1,
            hoverOffset: 5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 20, 75, 0.9)',
              padding: 12,
              titleFont: {
                size: 14
              },
              bodyFont: {
                size: 13
              },
              callbacks: {
                label: (context) => {
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    };

    const updateChart = () => {
      if (!chart) return;

      // Update chart data
      chart.data.datasets[0].data = severityConfig.map(item => props.data[item.key] || 0);
      chart.update();
    };

    onMounted(() => {
      createChart();
    });

    watch(() => props.data, () => {
      updateChart();
    }, { deep: true });

    const severityItems = severityConfig.map(item => ({
      label: item.label,
      color: item.color,
      count: props.data[item.key] || 0
    }));

    return {
      chartCanvas,
      severityItems
    };
  }
};
</script>