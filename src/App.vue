
<template>
  <div class="min-h-screen text-white">
    <AppHeader />
    <div class="flex min-h-[calc(100vh-64px)]">
      <AppSidebar />
      <main class="flex-1 p-6 overflow-x-hidden">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './components/common/AppHeader.vue';
import AppSidebar from './components/common/AppSidebar.vue';
import AppFooter from './components/common/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* Base styles */
body {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #5FCFDA;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #37C3D1;
}
</style>