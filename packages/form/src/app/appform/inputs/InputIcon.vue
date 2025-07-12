<script lang="ts" setup generic="TApi extends Record<string, Function>">
// import { computed, h } from "vue";
// import InputDropdown from "./DropDown.vue"; // Adjust path if necessary
import type { InputDropdownProps } from "./types";
// import { AppIcon } from "@devkitvue/base-components";
import { StringUnknownRecord } from "@devkitvue/config";

// Define simpler props for the InputIcon wrapper
const props = defineProps<{
  context: Omit<
    InputDropdownProps<
      TApi,
      StringUnknownRecord,
      { iconName: string },
      "single"
    >["context"],
    "options" | "optionLabel" | "optionValue" | "slots"
  >;
}>();

// Create the specific context for the InputDropdown to handle icons
// const iconDropdownContext = computed(
//   (): InputDropdownProps<
//     TApi,
//     StringUnknownRecord,
//     { iconName: string },
//     "single"
//   >["context"] => {
//     return {
//       ...props.context,
//       // Pre-configure the options to fetch icons from the API
//       // Provide a default slot for rendering each icon option
//       slots: {
//         option: (optionProps: { option: { iconName: string } }) => {
//           return h("div", { class: "flex items-center  flex-col gap-2" }, [
//             h(AppIcon, { icon: optionProps.option.iconName }),
//             h("span", optionProps.option.iconName),
//           ]);
//         },
//         // Provide a default slot for rendering the selected value
//         value: (slotProps: { value: string; placeholder: string }) => {
//           if (!slotProps.value) {
//             return h("span", { class: "text-gray-400" }, slotProps.placeholder);
//           }
//           return h("div", { class: "flex items-center gap-2" }, [
//             h(AppIcon, { icon: slotProps.value }),
//             h("span", slotProps.value),
//           ]);
//         },
//       },
//     };
//   },
// );
//
console.log("pr", props);
</script>

<template>
  <FormKit
    type="devkitDropdown"
    optionLabel="iconName"
    responseOptionsKey="icons"
    optionValue="iconName"
    iconKey="iconName"
    options="iconList"
    :fluid="true"
    :name="props.context.name"
    :filter="true"
    :pt="{
      list: 'grid grid-cols-5',
      option: 'flex-col',
    }"
  >
  </FormKit>
</template>
