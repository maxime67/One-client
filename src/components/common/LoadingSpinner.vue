<template>
  <div class="flex justify-center items-center" :class="[fullScreen ? 'fixed inset-0 z-50 bg-dark-800/80' : '']">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" :class="{'h-24 w-24': fullScreen}"></div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    fullScreen: {
      type: Boolean,
      default: false
    }
  }
};
</script>