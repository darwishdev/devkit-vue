<script setup lang="ts">
import { Breadcrumb } from "primevue";
import { MenuItem } from "primevue/menuitem";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { items } = defineProps<{ items?: MenuItem[] }>();
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
    :pt="{
      root:'transparent p-0'
    }"
    :model="breadcrumbs"
    v-if="breadcrumbs.length > 0"
  >
    <template #item="{ item }">
      <AppBtn variant="text" class="color-text" v-bind="{label : typeof item.label  == 'function' ? item.label()  :item.label, icon: item.icon , to: item.to , route : item.route }"  />
    </template>
  </Breadcrumb>
</template>
