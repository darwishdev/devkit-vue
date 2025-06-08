<script setup lang="ts">
import { ref } from "vue";
import AppBtn from "./AppBtn.vue";
const {
  darkIcon = "sun",
  lightIcon = "moon",
  className = "dark",
  callBack,
} = defineProps<{
  className?: string;
  darkIcon?: string;
  lightIcon?: string;
  callBack?: (mode: "dark" | "light") => void;
}>();
const iconName = ref(lightIcon);
const toggle = () => {
  document.body.classList.toggle(className);
  const isDark = document.body.classList.contains(className);
  iconName.value = isDark ? darkIcon : lightIcon;
  if (callBack) {
    callBack(isDark ? "dark" : "light");
  }
};
</script>

<template>
  <slot name="default" :toggle-locale="toggle">
    <div class="w-24">
      <slot name="default" :toggle="toggle">
        <AppBtn
          size="small"
          :useReset="true"
          :icon="iconName"
          variant="text"
          :action="toggle"
        />
      </slot>
    </div>
  </slot>
</template>
