<script setup lang="ts">
import { computed, h, inject, onMounted, ref, useAttrs } from "vue";
import Image from "primevue/image";
import { Skeleton, type ImageProps, type ImageSlots } from "primevue";
import AppIcon from "./AppIcon.vue";
const { VITE_FALLBACK_IMAGE_URL, VITE_FALLBACK_IMAGE_SVG , VITE_BASE_IMAGE_URL } = import.meta.env;
const baseImageUrl = inject<string>("baseImageUrl") || VITE_BASE_IMAGE_URL;
const fallbackImage = inject<string>("fallbackImageUrl") || VITE_FALLBACK_IMAGE_URL;
const fallbackSvg = inject<string>("fallbackImageSvg") || VITE_FALLBACK_IMAGE_SVG;

const props = defineProps<ImageProps & { src: string }>();
const slots = defineSlots<ImageSlots>();
const src = props.src == '' ? fallbackImage : 
  props.src.startsWith("http") || props.src.startsWith("blob")
    ? props.src
    : `${baseImageUrl}${props.src}`;
const attrs = useAttrs();
const loading = ref(true);
const hasError = ref(false);
const targetUrl = computed(() => {
  if (!props.src) return fallbackImage;
  if (props.src.startsWith("http") || props.src.startsWith("blob")) {
    return props.src;
  }
  return `${baseImageUrl}${props.src}`;
});
const renderFallback = () => {
  if (fallbackSvg) {
    return h('div' , {
      class: 'fallback-icon'
    } , [ h(AppIcon , {icon : fallbackSvg , class: 'custom-icon'}) , h('h3' , {class: 'font-bold text-center text-lg'} , 'NO-IMAGE')])
  }
  return h(Image , {
    ...attrs,
    ...props,
    src: fallbackImage,       
  })
}
const renderImage = () => {
  return    h(
      Image,
      {
        ...attrs,
        ...props,
        src,
      },
      () => slots,
    )
};
onMounted(() => {
  if (props.src == '' )  {
    loading.value = false
    hasError.value = true
    return
  }
  const img = new window.Image();
  img.onload = () => {
    loading.value = false;
  };
  img.onerror = () => {
    loading.value = false;
    hasError.value = true;
  };
  img.src = targetUrl.value;
});
</script>
<template>
  <Skeleton v-if="loading" width="100%" height="200px" />
  <component v-else :is="hasError ? renderFallback : renderImage" />
</template>
