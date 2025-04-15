<template>
  <span :class="[
    baseClasses,
    sizeClasses,
    typeClasses,
    pulseClasses
  ]">
    <slot>{{ text }}</slot>
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default',
      validator: (value) => ['default', 'success', 'danger', 'warning', 'info', 'primary', 'secondary'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    pulse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    baseClasses() {
      return 'inline-flex items-center justify-center font-medium rounded-full';
    },
    sizeClasses() {
      const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-1.5'
      };
      return sizes[this.size];
    },
    typeClasses() {
      const types = {
        default: 'bg-gray-700 text-gray-100',
        success: 'bg-success-500/20 text-success-300 border border-success-500/30',
        danger: 'bg-danger-500/20 text-danger-300 border border-danger-500/30',
        warning: 'bg-warning-500/20 text-warning-300 border border-warning-500/30',
        info: 'bg-secondary-500/20 text-secondary-300 border border-secondary-500/30',
        primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
        secondary: 'bg-dark-500 text-gray-300'
      };
      return types[this.type];
    },
    pulseClasses() {
      return this.pulse ? 'animate-pulse-slow' : '';
    }
  }
};
</script>