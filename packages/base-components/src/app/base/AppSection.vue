<script setup lang="ts">
import type { TenantsSchemaSectionView } from '@/pkg/types/api_types'
defineProps<Partial<TenantsSchemaSectionView> & { dark: boolean, narrow: boolean, center: boolean }>()
</script>

<template>
  <div class="py-8" :class="{ 'darker': dark }">
    <div class="wrapper" :class="{ 'narrow': narrow }">
      <h2 v-if="sectionName" class="reveal" :class="{ 'text-center': center }">{{ sectionName }}</h2>
      <p v-if="sectionDescription" class="reveal" :class="{ 'text-center': center }">{{ sectionDescription }}</p>
      <slot></slot>
    </div>
  </div>
</template>
