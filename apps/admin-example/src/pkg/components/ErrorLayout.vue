<script setup lang="ts">
import { useRouter } from "vue-router";
const { push } = useRouter();
</script>
<!-- src/layouts/ErrorLayout.vue -->
<template>
  <div
    class="flex items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-black"
  >
    <div class="text-center max-w-md space-y-6">
      <RouterView />
      <AppBtn
        label="Go to Dashboard"
        icon="home-6-line"
        variant="outlined"
        severity="success"
        :action="() => push('/')"
      >
      </AppBtn>
    </div>
  </div>
</template>
