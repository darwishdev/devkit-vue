<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TOptionsReq extends StringUnknownRecord,
    TOptionsResp extends StringUnknownRecord = DropdownOptions,
    TComponentType extends 'single' | 'multi' | 'button' = 'single'
  "
>
import { StringUnknownRecord } from "@devkitvue/apiclient";
import Select, { SelectProps } from "primevue/select";
import { h } from "vue";
import {
  MultiSelect,
  MultiSelectProps,
  SelectButton,
  SelectButtonProps,
} from "primevue";
import { AppBtn, AppIcon } from "@devkitvue/base-components";
import { InputDropdownProps, DropdownOptions } from "./types";
import { renderErr, renderLoading } from "./_baseInputComponents";
const props =
  defineProps<
    InputDropdownProps<TApi, TOptionsReq, TOptionsResp, TComponentType>
  >();
const { context } = props;
const emit = defineEmits<{
  (e: "valueChange", value: unknown): void;
}>();
const {
  options,
  dependsOn,
  createRoute,
  node,
  useLazy,
  hideReload,
  iconKey = "icon",
} = context;
const getPrimevueProps = () => {
  const primevuePops: typeof context.useButtons extends true
    ? SelectButtonProps
    : typeof context.multiple extends true
      ? MultiSelectProps
      : SelectProps = { ...context };
  if (Array.isArray(options)) {
    return primevuePops;
  }
  primevuePops.optionLabel = primevuePops.optionLabel || "label";
  primevuePops.optionValue = primevuePops.optionValue
    ? primevuePops.optionValue
    : context.convertToFlat
      ? primevuePops.optionLabel
      : "value";
  if ("placeholder" in primevuePops)
    primevuePops.placeholder = context.node.props.placeholder;
  return primevuePops;
};
const onBeforeShow = () => {
  if (dependsOn) {
    if (node.props.lastParentValue == node.props.getParentFormValue()) {
      return;
    }
    node.props.optionsFetcher();
    return;
  }
  if (!useLazy || !options || node.props.optionsArray.value.length) return;
  node.props.optionsFetcher();
};
const onValueChange = (value: unknown) => {
  node.input(value);
  emit("valueChange", value);
};
const forceReload = () => {
  node.props.forceReload();
};
const renderOption = (optionProps: {
  option: unknown;
  selected: boolean;
  index: number;
}) => {
  if (node.props.isLoading.value || node.props.errorMessageRef.value) return;
  if (typeof context.slots.option == "function")
    return context.slots.option(optionProps);
  const { selected, option } = optionProps;
  let icon = "";
  let label = "";
  let note = "";
  if (option && typeof option == "object") {
    const optionsMap = option as Record<string, unknown>;
    icon = iconKey in optionsMap ? (optionsMap[iconKey] as string) : "";
    if (typeof selectProps.optionLabel === "string") {
      if (selectProps.optionLabel in optionsMap) {
        const key = selectProps.optionLabel;
        if (key in option) {
          label = String(optionsMap[key]);
        }
      }
    }
  }
  return h(
    "div",
    {
      class: `flex ${context.pt?.option || ""} items-center ${selected ? "selected" : ""}`,
    },
    [
      icon ? h(AppIcon, { icon }) : undefined,
      h("span", label),
      note ? h("span", note) : undefined,
    ],
  );
};
const selectProps = getPrimevueProps();
const renderInputDropdown = () => {
  return h(
    context.useButtons ? SelectButton : context.multiple ? MultiSelect : Select,
    {
      ...selectProps,
      size: "small",
      pt: { overlay: "z-2000", ...(context.pt || {}) },
      modelValue: context._value,
      "onUpdate:modelValue": onValueChange,
      loading: node.props.isLoading.value,
      options: node.props.optionsArray?.value || [],
      onBeforeShow,
    },
    {
      ...context.slots,
      header: (_: unknown) =>
        h("div", { class: "select-header" }, [
          !hideReload
            ? h(AppBtn, {
                action: forceReload,
                label: "reload",
                icon: "refresh-line",
              })
            : undefined,
          createRoute
            ? h(AppBtn, { action: createRoute, label: "create", icon: "plus" })
            : undefined,
        ]),
      option: (optionProps: {
        option: unknown;
        selected: boolean;
        index: number;
      }) => [
        renderLoading(node.props.isLoading),
        renderErr(node),
        renderOption(optionProps),
      ],
      empty: () => [
        renderLoading(node.props.isLoading),
        renderErr(node),
        h("h2", "No options available"),
      ],
    },
  );
};
</script>
<template>
  <component :is="renderInputDropdown" />
</template>
<style>
.uppy-Root .uppy-Dashboard .uppy-Dashboard-AddFiles {
  border-color: var(--glass);
}
.uppy-Root .uppy-Dashboard .uppy-Dashboard-inner {
  background: transparent;
  border-color: var(--color-glass);
}

.uppy-DashboardTab-inner,
.uppy-DashboardTab-btn:hover {
  background: var(--glass);
}
[data-uppy-drag-drop-supported="true"] .uppy-Dashboard-AddFiles {
  border-color: var(--glass);
}
.uppy-Dashboard-AddFiles-title {
  color: var(--color-text);
}
</style>
