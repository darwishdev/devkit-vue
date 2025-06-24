<script setup lang="ts">
import { cacheHelper } from "@/index";
import { toggleLocale } from "@/pkg/utils/LocaleUtils";
import AppBtn from "./AppBtn.vue";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const { icon = "global-line" , callBack} = defineProps<{ icon?: string ,callBack?: (local : string) => void}>();
const slots = defineSlots<{
  default?: (props: { toggleLocale: () => void }) => any;
}>();
const toggle = () => {
  toggleLocale({ i18n: i18n, cacheHelper });
  if (callBack) {
    callBack(i18n.locale.value);
  }
};
</script>

<template>
  <slot name="default" :toggle-locale="toggle">
      <AppBtn
       :icon="icon"
      v-bind="$attrs"
       variant="text"
       :action="toggle"
      />
  </slot>
</template>
