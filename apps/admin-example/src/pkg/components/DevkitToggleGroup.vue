<script
  lang="ts"
  setup
  generic="
    TValue extends string | number | StringUnknownRecord,
    TOption extends StringUnknownRecord = DropdownOption<TValue>
  "
>
import type { StringUnknownRecord } from "@devkitvue/apiclient";
import { computed, h, type VNode } from "vue";
import type { DropdownOption } from "@devkitvue/form";
import { ToggleSwitch } from "primevue";
import Checkbox from "primevue/checkbox";
import { useDropdownKeysFetcher } from "./useDropwdownKeysFetcher";
import { AppIcon } from "@devkitvue/base-components";
type ToggleGroupSlots = {
  header?: (props: {
    groupNote: string;
    groupName: string;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
  note?: (props: { groupNote: string }) => VNode[] | VNode;

  "select-all"?: (props: {
    groupName: string;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
  option?: (props: {
    option: TOption;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
};
const slots = defineSlots<ToggleGroupSlots>();
const {
  groupName,
  modelValue,
  useCheckBox,
  labelKey = "label" as keyof TOption,
  valueKey = "value" as keyof TOption,
  noteKey = "note" as keyof TOption,
  iconKey = "icon" as keyof TOption,
  items,
  groupNote = "",
} = defineProps<{
  groupName: string;
  groupNote?: string;
  labelKey?: keyof TOption;
  valueKey?: keyof TOption;
  noteKey?: keyof TOption;
  iconKey?: keyof TOption;
  useCheckBox?: boolean;
  modelValue: Set<TValue>;
  items: TOption[];
}>();
const { getLabel, getValue, getIcon, getNote } = useDropdownKeysFetcher<
  TOption,
  { groupName: string; groupNote: string; items: TOption[] },
  TValue
>({
  labelKey,
  valueKey,
  iconKey,
  noteKey,
  groupItemsKey: "items",
  groupNoteKey: "groupNote",
  groupNameKey: "groupName",
});
const emit = defineEmits<{
  (e: "update:modelValue", value: Set<TValue>): void;
}>();

const renderToggleGroup = () => {
  const onModelValueChange = (checked: boolean, option: TOption) => {
    if (!modelValue) return;
    if (checked) {
      modelValue.add(getValue(option));
    } else {
      modelValue.delete(getValue(option));
    }
    emit("update:modelValue", modelValue);
  };
  return items.map((option) =>
    h("div", { class: "flex gap-2 items-center" }, [
      slots.option
        ? slots.option({
            option,
            modelValue: !modelValue ? false : modelValue.has(getValue(option)),
            "onUpdate:modelValue": (checked: boolean) =>
              onModelValueChange(checked, option),
          })
        : h("div", { class: "flex gap-2 items-center" }, [
            useCheckBox
              ? h(Checkbox, {
                  binary: true,
                  name: getLabel(option),
                  id: getLabel(option),
                  modelValue: !modelValue
                    ? false
                    : modelValue.has(getValue(option)),
                  "onUpdate:modelValue": (checked: boolean) =>
                    onModelValueChange(checked, option),
                })
              : h(ToggleSwitch, {
                  name: getLabel(option),
                  id: getLabel(option),
                  modelValue: !modelValue
                    ? false
                    : modelValue.has(getValue(option)),
                  "onUpdate:modelValue": (checked: boolean) =>
                    onModelValueChange(checked, option),
                }),

            h(AppIcon, { icon: getIcon(option) }),
            h("label", { for: getLabel(option) }, getLabel(option)),
            h("span", { class: "whitespace-nowrap" }, getNote(option)),
          ]),
    ]),
  );
};
const isSelectAllComputed = computed({
  get() {
    return !modelValue ? false : modelValue.size === items.length;
  },
  set(newValue) {
    if (!modelValue) return;
    modelValue.clear();
    if (newValue) {
      items.map((item) => {
        console.log("item", item);
        modelValue.add(getValue(item));
      });
    }
    emit("update:modelValue", modelValue);
  },
});
</script>

<template>
  <slot
    name="header"
    :groupNote="groupNote"
    :groupName="groupName"
    :modelValue="isSelectAllComputed"
    :onModelValueChange="(checked: boolean) => (isSelectAllComputed = checked)"
  >
    <div class="flex justify-between mb-8">
      <div class="flex gap-2 items-center">
        <slot name="note" :groupNote="groupNote">
          <h2>{{ groupNote }}</h2>
        </slot>
      </div>

      <slot
        name="select-all"
        :groupName="groupName"
        :modelValue="isSelectAllComputed"
        :onModelValueChange="
          (checked: boolean) => (isSelectAllComputed = checked)
        "
      >
        <div class="select-all me-[3rem] z-2">
          <Checkbox
            v-model="isSelectAllComputed"
            class="me-2"
            :id="`select-all-${groupName}`"
            :inputId="groupName"
            binary
          />
          <label :for="`select-all-${groupName}`"> check all </label>
        </div>
      </slot>
    </div>
  </slot>
  <div class="flex gap-8 flex-wrap">
    <component :is="renderToggleGroup" />
  </div>
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
