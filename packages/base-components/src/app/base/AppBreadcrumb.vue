<script setup lang="ts">
import { Breadcrumb } from "primevue";
import { MenuItem } from "primevue/menuitem";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { items } = defineProps<{ items: MenuItem[] }>();
const breadcrumbHome = {
  icon: "house",
  to: "/",
};
const breadcrumbs = computed(() => {
  if (items) return items;
  if (!route.meta) return [];
  if (!route.meta.breadcrumbs) return [];
  return route.meta.breadcrumbs as MenuItem[];
});
</script>
<template>
  <Breadcrumb
    :home="breadcrumbHome"
    :model="breadcrumbs"
    v-if="breadcrumbs.length > 0"
  >
    <template #item="{ item, props }">
      <a
        href="#"
        v-if="item.to"
        v-bind="props.action"
        @click.prevent="router.push(item.to)"
      >
        <AppIcon color="mr-3" v-if="item.icon" :icon="item.icon" />
        <span class="text-color" v-if="item.label">{{
          t(item.label as string)
        }}</span>
      </a>
      <div
        v-else
        class="cursor-text"
        :href="item.to"
        :target="item.target"
        v-bind="props.action"
      >
        <AppIcon color="text-primary mr-3" v-if="item.icon" :icon="item.icon" />
        <span class="text-primary" v-if="item.label">{{
          t(item.label as string)
        }}</span>
      </div>
    </template>
  </Breadcrumb>
</template>
