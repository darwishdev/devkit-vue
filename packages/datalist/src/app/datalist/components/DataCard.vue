<script setup lang="ts" generic="TRecord extends StringUnknownRecord">
import { AppImage, dateHumanFormat } from "@devkitvue/base-components";
import type { StringUnknownRecord } from "@devkitvue/config";
import { computed } from "vue";
import Badge from "primevue/badge";
import { makeGridWrapperClassName } from "@devkitvue/base-components";
import { useI18n } from "vue-i18n";
import { DataCardProps, DataCardSlots } from "../types";

const {
  data,
  layout = "horizontal",
  pt = {},
  imageProps = { useBackgroundImage: true },
  createdAtKey,
  deletedAtKey,
  imageHeight,
  dateAdapter,
  gridConfig = { columns: 3, gridType: "grid" },
} = defineProps<DataCardProps<TRecord>>();
const slots = defineSlots<DataCardSlots>();
const { t } = useI18n();

const imageHeightStyle = computed(() =>
  layout == "vertical"
    ? `height: ${imageHeight}`
    : imageHeight
      ? `min-height:  ${imageHeight}`
      : "",
);
const formatedDates = computed(() => {
  if (!deletedAtKey && !createdAtKey) return;
  const deletedAtValue = deletedAtKey ? data[deletedAtKey] : undefined;
  const createdAtValue = createdAtKey ? data[createdAtKey] : undefined;
  if (!createdAtKey && !createdAtValue) return;
  const createdAtFormated =
    createdAtValue && typeof createdAtValue == "string"
      ? dateHumanFormat(createdAtValue, dateAdapter)
      : undefined;
  const deletedAtFormated =
    deletedAtValue && typeof deletedAtValue == "string"
      ? dateHumanFormat(deletedAtValue, dateAdapter)
      : undefined;
  return { createdAt: createdAtFormated, deletedAt: deletedAtFormated };
});

const isFooterExisted =
  slots["footer-end"] ||
  slots["footer-start"] ||
  slots.footer ||
  formatedDates.value;

const layoutClass = computed(() => {
  const padding =
    isFooterExisted && layout == "vertical"
      ? "pb-10"
      : layout == "vertical"
        ? "pb-4"
        : "";
  if (layout && layout == "vertical") return padding;
  return `grid ${padding} ${makeGridWrapperClassName(gridConfig)}`;
});
const infoClass =
  layout == "vertical"
    ? `${isFooterExisted ? "pb-8" : ""}`
      ? "pb-8"
      : ""
    : `${isFooterExisted ? "pb-8" : ""} relative col-span-2`;
</script>
<template>
  <article
    class="glass relative shadow-sm overflow-hidden rounded-lg h-full w-full cursor-pointer"
    :class="layoutClass"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
  >
    <!-- Header Slot -->
    <slot name="header">
      <header
        class="absolute top-0 z-20 flex justify-between p-4 w-full"
        :class="pt.header || ''"
      >
        <slot name="header-start" />
        <slot name="header-end" />
      </header>
    </slot>

    <!-- Start / Image -->
    <slot name="start">
      <div
        class="bg-primary/40 flex-col flex justify-center item-center"
        :class="pt.start || ''"
      >
        <slot name="start-content">
          <figure
            v-if="imageKey"
            class="card-image w-full h-full"
            :class="pt.imageWrapper || ''"
          >
            <slot name="card-image">
              <AppImage
                class="w-full"
                v-bind="imageProps"
                :src="data[imageKey] as string"
                :style="imageHeightStyle"
                :class="pt.image || ''"
              />
            </slot>
          </figure>
        </slot>
      </div>
    </slot>
    <slot name="end">
      <section
        class="flex flex-col h-full"
        :class="`${pt.info || ''} ${infoClass}`"
      >
        <slot name="card-info">
          <div class="info-top px-4 pt-4">
            <AppBtn
              v-if="titleKey"
              variant="text"
              v-tooltip="`${t(String(titleKey))} : ${data[titleKey]}`"
              :action="
                titleRouter && identefier
                  ? `${titleRouter}${data[identefier]}`
                  : ''
              "
              justify="start"
              class="font-bold mb-2 text-2xl"
              :class="pt.title || ''"
            >
              <template #label>
                <span class="line-clamp-1 break-words">{{
                  data[titleKey]
                }}</span>
              </template>
            </AppBtn>
            <slot name="subtitle" :class="pt.subtitle || ''" />
          </div>
        </slot>

        <!-- Footer Section -->
        <slot name="footer">
          <footer
            class="absolute bottom-2 w-full px-4 gap-2 text-sm flex items-center justify-between"
            :class="pt.footer || ''"
          >
            <!-- Footer Start -->
            <slot name="footer-start">
              <slot name="createdAt">
                <time
                  v-if="formatedDates?.createdAt && !formatedDates.deletedAt"
                  class="text-xs italic line-clamp-1"
                  :class="pt.createdAt || ''"
                  v-tooltip="`${t('createdAt')} : ${formatedDates.createdAt}`"
                >
                  {{ formatedDates.createdAt }}
                </time>
              </slot>
              <slot name="deletedAt">
                <time
                  v-if="formatedDates?.deletedAt"
                  class="text-xs italic text-red-400 line-clamp-1 font-medium"
                  v-tooltip="`${t('deletedAt')} : ${formatedDates.deletedAt}`"
                  :class="pt.deletedAt || ''"
                >
                  {{ formatedDates.deletedAt }}
                </time>
              </slot>
            </slot>

            <!-- Footer Middle -->
            <slot name="footer-middle" />

            <!-- Footer End -->
            <slot name="footer-end">
              <span v-if="badgeKey" class="text-xs">
                <Badge
                  v-tooltip="
                    `${t(badgeKey as string)} : ${String(data[badgeKey])}`
                  "
                  class="text-white"
                  :class="pt.badge || ''"
                >
                  <slot name="badgeContent">
                    {{ String(data[badgeKey]) }}
                  </slot>
                </Badge>
              </span>
            </slot>
          </footer>
        </slot>
      </section>
    </slot>
  </article>
</template>
