<template>
  <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden p-5">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <h3 class="text-lg font-medium text-white">CVE Timeline</h3>

      <div class="mt-3 sm:mt-0 flex space-x-2">
        <button
            v-for="option in periodOptions"
            :key="option.value"
            @click="changePeriod(option.value)"
            class="px-3 py-1 text-sm rounded-md"
            :class="currentPeriod === option.value
            ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
            : 'text-gray-400 hover:text-white hover:bg-dark-500'"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="relative h-60">
      <canvas ref="chartCanvas" height="240"></canvas>
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-dark-600/80">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import cveService from '../../services/cveService';

export default {
  name: 'TimelineChart',
  setup() {
    const chartCanvas = ref(null);
    const timelineData = ref([]);
    const currentPeriod = ref('month');
    const loading = ref(true);
    let chart = null;

    const periodOptions = [
      { label: 'Days', value: 'day' },
      { label: 'Weeks', value: 'week' },
      { label: 'Months', value: 'month' }
    ];

    const fetchTimelineData = async (period) => {
      loading.value = true;
      try {
        const limit = period === 'day' ? 30 : period === 'week' ? 26 : 12;
        const { data } = await cveService.getCVETimeline(period, limit);
        timelineData.value = data;
      } catch (error) {
        console.error('Error fetching timeline data:', error);
        timelineData.value = [];
      } finally {
        loading.value = false;
      }
    };

    const createChart = () => {
      if (!chartCanvas.value) return;

      const ctx = chartCanvas.value.getContext('2d');

      // Parse data for chart
      const labels = timelineData.value.map(item => item.period);
      const countData = timelineData.value.map(item => item.count);
      const scoreData = timelineData.value.map(item => item.avgCvssScore || 0);

      // Theme colors
      const countColor = '#37C3D1'; // primary-500
      const scoreColor = '#FF5555'; // danger-500

      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'CVE Count',
              data: countData,
              backgroundColor: 'rgba(55, 195, 209, 0.1)',
              borderColor: countColor,
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: countColor,
              pointRadius: 3,
              pointHoverRadius: 5,
              yAxisID: 'y'
            },
            {
              label: 'Avg CVSS Score',
              data: scoreData,
              borderColor: scoreColor,
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: scoreColor,
              pointRadius: 3,
              pointHoverRadius: 5,
              borderDash: [5, 5],
              fill: false,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#CCD0DB', // dark-100
                usePointStyle: true,
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 20, 75, 0.9)',
              padding: 12,
              titleFont: {
                size: 14
              },
              bodyFont: {
                size: 13
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              },
              ticks: {
                color: '#99A1B7', // dark-200
                font: {
                  size: 10
                }
              }
            },
            y: {
              position: 'left',
              grid: {
                color: 'rgba(255, 255, 255, 0.05)'
              },
              ticks: {
                color: '#99A1B7', // dark-200
                font: {
                  size: 10
                }
              },
              title: {
                display: true,
                text: 'CVE Count',
                color: '#CCD0DB', // dark-100
                font: {
                  size: 11
                }
              }
            },
            y1: {
              position: 'right',
              min: 0,
              max: 10,
              grid: {
                drawOnChartArea: false
              },
              ticks: {
                color: '#99A1B7', // dark-200
                font: {
                  size: 10
                }
              },
              title: {
                display: true,
                text: 'CVSS Score',
                color: '#CCD0DB', // dark-100
                font: {
                  size: 11
                }
              }
            }
          }
        }
      });
    };

    const updateChart = () => {
      if (!chart) return;

      const labels = timelineData.value.map(item => item.period);
      const countData = timelineData.value.map(item => item.count);
      const scoreData = timelineData.value.map(item => item.avgCvssScore || 0);

      chart.data.labels = labels;
      chart.data.datasets[0].data = countData;
      chart.data.datasets[1].data = scoreData;
      chart.update();
    };

    const changePeriod = (period) => {
      currentPeriod.value = period;
    };

    onMounted(async () => {
      await fetchTimelineData(currentPeriod.value);
      createChart();
    });

    watch(currentPeriod, async (newPeriod) => {
      await fetchTimelineData(newPeriod);
      updateChart();
    });

    watch(timelineData, () => {
      if (chart) {
        updateChart();
      }
    }, { deep: true });

    return {
      chartCanvas,
      periodOptions,
      currentPeriod,
      loading,
      changePeriod
    };
  }
};
</script>