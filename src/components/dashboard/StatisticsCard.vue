<template>
  <div class="bg-dark-600 border border-primary-500/20 rounded-xl shadow-lg overflow-hidden">
    <div class="p-5">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-gray-400 text-sm font-medium mb-1">{{ title }}</h3>
          <div class="text-2xl font-semibold text-white">{{ value }}</div>
        </div>
        <div :class="iconColorClass">
          <slot name="icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </slot>
        </div>
      </div>
      <div v-if="subtitle" class="mt-2 text-sm text-gray-400">{{ subtitle }}</div>
      <slot name="footer"></slot>
    </div>
    <div v-if="showFooter" :class="[`bg-${color}-500/10`, 'px-5 py-3']">
      <div class="text-sm" :class="`text-${color}-400`">
        <slot name="footer-text">
          <span v-if="changeDirection !== null">
            <span v-if="changeDirection === 'up'" class="inline-block mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
            </span>
            <span v-else class="inline-block mr-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            {{ changeValue }} {{ changeLabel }}
          </span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatisticsCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    subtitle: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success', 'info'].includes(value)
    },
    showFooter: {
      type: Boolean,
      default: false
    },
    changeDirection: {
      type: String,
      default: null,
      validator: (value) => value === null || ['up', 'down'].includes(value)
    },
    changeValue: {
      type: [String, Number],
      default: null
    },
    changeLabel: {
      type: String,
      default: 'compared to previous period'
    }
  },
  computed: {
    iconColorClass() {
      return `text-${this.color}-400`;
    }
  }
};
</script>