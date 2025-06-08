<script setup lang="ts">
import { cacheHelper } from "@/index";
import { toggleLocale } from "@/pkg/utils/LocaleUtils";
import AppBtn from "./AppBtn.vue";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const { icon = "globe" } = defineProps<{ icon?: string }>();
const toggle = () => {
  toggleLocale({ i18n: i18n, cacheHelper });
};
</script>

<template>
  <slot name="default" :toggle-locale="toggle">
    <div class="w-24">
      <AppBtn
        size="small"
        :icon="icon"
        variant="text"
        :action="toggle"
        label=""
      />
    </div>
  </slot>
</template>
