<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TOptionsReq extends StringUnknownRecord
  "
>
import type { StringUnknownRecord } from "@devkitvue/apiclient";
import { computed, h, ref, watch } from "vue";
import Panel from "primevue/panel";
import type { DropdownOption } from "@devkitvue/form";
import { ToggleSwitch } from "primevue";
import Checkbox from "primevue/checkbox";
const { groupName, items } = defineProps<{
  groupName: string;
  items: DropdownOption[];
}>();
const modeleSelectionRef = ref(new Set<unknown>());
const emit = defineEmits<{
  (e: "valueChange", value: unknown[]): void;
}>();
watch(
  () => Array.from(modeleSelectionRef.value),
  (newVal) => {
    emit("valueChange", newVal);
  },
  { deep: false }, // shallow watch, since it's already primitive array
);

const renderToggleGroup = () => {
  return items.map((o: DropdownOption) =>
    h("div", { class: "flex gap-2 items-center" }, [
      h("h2", o.label),
      h(ToggleSwitch, {
        name: o.label,
        modelValue: modeleSelectionRef.value.has(o.value),
        "onUpdate:modelValue": (checked: boolean) => {
          if (checked) {
            modeleSelectionRef.value.add(o.value);
          } else {
            modeleSelectionRef.value.delete(o.value);
          }
        },
      }),
    ]),
  );
};
const isSelectAllComputed = computed({
  get() {
    return modeleSelectionRef.value.size === items.length;
  },
  set(newValue) {
    if (newValue) {
      modeleSelectionRef.value = new Set(items.map((v) => v.value));
    } else {
      modeleSelectionRef.value.clear();
    }
  },
});
</script>

<template>
  <Panel
    toggleable
    :pt="{
      pcToggleButton: 'panel-toggle-absolute',
      root: 'w-full glass my-2',
      header: 'glass',
      headerActions: 'flex gap-2 items-center',
      content: 'flex gap-2 py-4 flex-wrap',
    }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <span class="font-bold">{{ groupName }}</span>
      </div>
    </template>
    <template #icons>
      <div class="select-all me-[3rem] z-2">
        <Checkbox
          v-model="isSelectAllComputed"
          class="me-2"
          :inputId="groupName"
          binary
        />
        <label for="ingredient1"> check all </label>
      </div>
    </template>
    <component :is="renderToggleGroup" />
  </Panel>
</template>
<style>
.p-panel-header-actions .p-panel-toggle-button {
  position: absolute;
  width: 100%;
  left: 0;
  z-index: 1;
  padding: 0;
  text-align: right;
  justify-content: flex-end;
  padding-inline-end: 20px;
}

.p-panel-header-actions .p-panel-toggle-button:hover {
  background-color: transparent !important;
}
.p-panel-toggleable .p-panel-header {
  padding-block: 1rem;
}
</style>
