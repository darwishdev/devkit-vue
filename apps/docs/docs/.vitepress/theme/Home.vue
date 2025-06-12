
<template>
  <!-- 1. Hero -->
  <VPHomeHero />

  <!-- 2. Features grid -->
  <VPFeatures :items="frontmatter.features" />

  <!-- 3. Screenshot gallery -->
  <section class="screenshots grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
    <img
      v-for="shot in frontmatter.screenshots"
      :key="shot.src"
      :src="shot.src"
      :alt="shot.alt"
      class="rounded-2xl shadow-lg"
    />
  </section>

  <!-- 4. Email capture -->
  <section class="newsletter bg-gray-50 p-8 rounded-2xl text-center">
    <h2 class="text-2xl font-semibold mb-4">Stay in the loop</h2>
    <form
      action="https://your-newsletter.service/subscribe"
      method="POST"
      class="flex flex-col sm:flex-row items-center justify-center gap-3"
    >
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        required
        class="px-4 py-2 rounded-lg border w-full sm:w-auto flex-1"
      />
      <button type="submit" class="px-6 py-2 rounded-lg bg-primary text-white">
        Subscribe
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { VPFeatures, VPHomeHero } from 'vitepress/theme';

const { frontmatter } = useData()
</script>

<style scoped>
.newsletter { max-width: 600px; margin: 0 auto; }
.bg-primary { background-color: var(--vp-c-brand); }
</style>
