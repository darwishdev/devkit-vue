<script setup lang="ts">
import { h, inject, ref, useAttrs } from "vue";
import Image from "primevue/image";
import type { ImageProps, ImageSlots } from "primevue";
const { VITE_FALLBACK_IMAGE_URL, VITE_BASE_IMAGE_URL } = import.meta.env;
const baseImageUrl = inject<string>("baseImageUrl") || VITE_BASE_IMAGE_URL;
const fallbackImage = inject<string>("noImageUrl") || VITE_FALLBACK_IMAGE_URL;

const props = defineProps<ImageProps & { src: string }>();
const slots = defineSlots<ImageSlots>();
const src =
  props.src.startsWith("http") || props.src.startsWith("blob")
    ? props.src
    : `${baseImageUrl}${props.src}`;
const attrs = useAttrs();
const imageSrcRef = ref(src);
const renderImage = () => {
  return h(
    Image,
    {
      ...attrs,
      ...props,
      src: imageSrcRef.value,
      onError: () => (imageSrcRef.value = fallbackImage),
    },
    () => slots,
  );
};
</script>
<template>
  <component :is="renderImage" />
</template>
