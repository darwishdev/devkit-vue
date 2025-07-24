<script setup lang="ts">
import { ref } from "vue";
import AppBtn from "./AppBtn.vue";
import { toggleDarkTheme } from "@/pkg/utils/ThemeUtils";
import { cacheHelper } from "@/index";
const {
  darkIcon = "sun-line",
  lightIcon = "moon-line",
  className = "dark",
  callBack,
} = defineProps<{
  className?: string;
  darkIcon?: string;
  lightIcon?: string;
  callBack?: (mode: "dark" | "light") => void;
}>();
const iconName = ref(lightIcon);
const toggle = async () => {
  const isDark = await toggleDarkTheme({ className, cacheHelper });
  iconName.value = isDark ? darkIcon : lightIcon;
  if (callBack) {
    callBack(isDark ? "dark" : "light");
  }
};
</script>

<template>
  <slot name="default" :toggle="toggle">
    <AppBtn
      variant="text"
      v-bind="$attrs"
      :key="iconName"
      :icon="iconName"
      :action="toggle"
    >
    </AppBtn>
  </slot>
</template>
