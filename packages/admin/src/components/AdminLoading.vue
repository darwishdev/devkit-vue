<script setup lang="ts">
import Skeleton from "primevue/skeleton";
</script>
<template>
  <div class="flex w-full min-h-screen">
    <!-- Sidebar -->
    <div
      class="hidden md:flex flex-col w-[var(--menu-width)] border-e px-4 py-6 gap-6"
    >
      <!-- Logo -->
      <Skeleton height="2rem" width="60%" border-radius="0.5rem" />

      <!-- Menu Items -->
      <div class="flex flex-col gap-4 mt-6">
        <Skeleton
          height="1.5rem"
          width="80%"
          v-for="i in 8"
          :key="'menu-' + i"
        />
      </div>
    </div>

    <!-- Main Page -->
    <div class="flex-1 flex flex-col gap-6 px-4 py-6">
      <!-- Top Filter Form -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <Skeleton
          height="2.5rem"
          class="w-full"
          v-for="i in 6"
          :key="'input-' + i"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-2">
        <Skeleton height="2.5rem" width="120px" class="rounded" />
        <Skeleton height="2.5rem" width="80px" class="rounded" />
        <Skeleton height="2.5rem" width="80px" class="rounded" />
      </div>

      <!-- Table Header -->
      <div
        class="grid grid-cols-[40px_repeat(8,minmax(0,1fr))] gap-2 mt-6 mb-2"
      >
        <Skeleton height="1.5rem" v-for="i in 9" :key="'thead-' + i" />
      </div>

      <!-- Table Rows -->
      <div class="space-y-3">
        <div
          v-for="row in 14"
          :key="'row-' + row"
          class="grid grid-cols-[40px_repeat(8,minmax(0,1fr))] gap-2 items-center"
        >
          <Skeleton
            height="1.25rem"
            v-for="i in 9"
            :key="'cell-' + row + '-' + i"
          />
        </div>
      </div>

      <!-- Footer -->
      <div
        class="mt-auto pt-8 text-center text-xs text-gray-400 dark:text-gray-500"
      >
        <Skeleton width="200px" height="1rem" class="mx-auto" />
      </div>
    </div>
  </div>
</template>
