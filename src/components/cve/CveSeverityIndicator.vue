<template>
  <div class="flex items-center" :class="{ 'flex-col': vertical }">
    <div class="flex items-center" v-if="showText">
      <span
          class="font-medium"
          :class="[
          textColorClass,
          vertical ? 'mb-1' : 'mr-2'
        ]"
      >
        {{ severityLabel }}
      </span>
    </div>

    <div class="relative" :class="vertical ? 'w-full' : ''">
      <div
          class="h-2 rounded-full bg-dark-500 overflow-hidden"
          :class="[vertical ? 'w-full' : 'w-24']"
      >
        <div
            class="h-full rounded-full"
            :class="[barColorClass]"
            :style="{ width: `${severityPercentage}%` }"
        ></div>
      </div>

      <div v-if="showScore" class="absolute -right-6 -top-1 text-xs font-medium" :class="[textColorClass]">
        {{ score }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CveSeverityIndicator',
  props: {
    score: {
      type: [Number, String],
      required: true
    },
    showText: {
      type: Boolean,
      default: true
    },
    showScore: {
      type: Boolean,
      default: true
    },
    vertical: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    severityLevel() {
      const numScore = parseFloat(this.score);

      if (isNaN(numScore)) return 'UNKNOWN';

      if (numScore >= 9.0) return 'CRITICAL';
      if (numScore >= 7.0) return 'HIGH';
      if (numScore >= 4.0) return 'MEDIUM';
      if (numScore > 0) return 'LOW';
      return 'NONE';
    },

    severityLabel() {
      return this.severityLevel;
    },

    textColorClass() {
      const colors = {
        CRITICAL: 'text-danger-400',
        HIGH: 'text-warning-400',
        MEDIUM: 'text-orange-400',
        LOW: 'text-success-400',
        NONE: 'text-gray-400',
        UNKNOWN: 'text-gray-400'
      };

      return colors[this.severityLevel];
    },

    barColorClass() {
      const colors = {
        CRITICAL: 'bg-danger-500',
        HIGH: 'bg-warning-500',
        MEDIUM: 'bg-orange-500',
        LOW: 'bg-success-500',
        NONE: 'bg-gray-500',
        UNKNOWN: 'bg-gray-500'
      };

      return colors[this.severityLevel];
    },

    severityPercentage() {
      const numScore = parseFloat(this.score);
      if (isNaN(numScore)) return 0;
      return Math.min(numScore * 10, 100);
    }
  }
};
</script>