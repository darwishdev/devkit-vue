<script
  lang="ts"
  setup
  generic="
    TData extends Record<string, unknown>,
    TField extends keyof TData = keyof TData,
    TValue = TData[TField]
  "
>
import { computed, defineProps } from "vue";
import { DataFieldSlots, type DataFieldProps } from "../types";

const {
  data,
  field,
  valueAdapter,
  labelTag = "h3",
  valueTag = "span",
  layoutVariant = "column",
  label,
  defaultValue = "not defined",
  tooltip,
  pt = {},
} = defineProps<DataFieldProps<TData, TField, TValue>>();
defineSlots<DataFieldSlots<TData, TField, TValue>>();
const layoutClass = computed(() => {
  if (pt?.block) return pt.block;
  const variantsMap = {
    column: "flex flex-col gap-2",
    "column-reverse": "flex flex-col-reverse gap-2",
    row: "flex items-center gap-2",
    "row-reverse": "flex items-center gap-2",
  };
  return variantsMap[layoutVariant];
});
const rawValue = data[field] as TValue;
const hasValue = computed(
  () => rawValue !== undefined && rawValue !== null && rawValue !== "",
);

const displayValue = computed(() => {
  return !hasValue.value
    ? defaultValue
    : valueAdapter
      ? valueAdapter(rawValue)
      : String(rawValue);
});
const tooltipValue = computed(() => {
  if (typeof tooltip === "string") return tooltip;
  return `${label} : ${displayValue.value}`;
});
</script>

<template>
  <div
    class="flex gap-4 items-center"
    :class="{ 'glass items-center flex gap-4 rounded-lg p-4': useCardStyle }"
  >
    <div
      v-if="icon"
      class="glass w-12 h-12 flex items-center justify-center rounded-full"
    >
      <AppIcon :icon="icon" class="custom-icon w-8 h-8" />
    </div>
    <div :class="layoutClass">
      <component
        :is="labelTag"
        :class="pt?.label || 'text-xl'"
        @click="onLabelClick"
      >
        {{ label || field }}
      </component>

      <slot
        name="value"
        :hasValue="hasValue"
        :value="rawValue as TValue"
        :displayValue="displayValue"
      >
        <component
          :is="hrefPrefix ? 'a' : valueTag"
          :href="hrefPrefix ? `${hrefPrefix}${rawValue}` : undefined"
          :title="tooltip ? tooltipValue : undefined"
          :class="pt?.value || 'font-bold flex text-2xl items-center'"
          @click="onValueClick"
          v-tooltip="tooltip ? tooltipValue : undefined"
        >
          <slot
            name="displayValue"
            :displayValue="displayValue"
            :value="rawValue as TValue"
          >
            <span :class="pt.valueWrapper || 'line-clamp-1'">{{
              displayValue
            }}</span>
          </slot>
        </component>
      </slot>
    </div>
  </div>
</template>
