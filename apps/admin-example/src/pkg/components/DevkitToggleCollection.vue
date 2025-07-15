<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TOptionsReq extends StringUnknownRecord
  "
>
import { ObjectKeys, type StringUnknownRecord } from "@devkitvue/apiclient";
// import Select, { SelectProps } from "primevue/select";
import { h, ref } from "vue";
// import {
//   MultiSelect,
//   MultiSelectProps,
//   SelectButton,
//   SelectButtonProps,
// } from "primevue";
// import { AppBtn, AppIcon } from "@devkitvue/base-components";
import type {
  InputToggleCollectionProps,
  DropdownOption,
} from "@devkitvue/form";
import { ToggleSwitch } from "primevue";
import DevkitToggleGroup from "./DevkitToggleGroup.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import type { FilterMatchModeValues } from "@devkitvue/config";
// import { renderErr, renderLoading } from "./_baseInputComponents";
const props =
  defineProps<InputToggleCollectionProps<TApi, TOptionsReq, TOptionsReq>>();
const { context } = props;
defineEmits<{
  (e: "valueChange", value: unknown): void;
}>();
const {
  node,
  // toggleType = "switch",
  // dependsOn,
  // createRoute,
  // node,
  // useLazy,
  // hideReload,
  // iconKey = "icon",
} = context;
const renderToggleGroup = (groupOptions: DropdownOption[]) => {
  console.log("group", groupOptions);
  // const componentType = toggleType ? ToggleSwitch : Checkbox;
  return groupOptions.map((o: DropdownOption) =>
    h("div", { class: "flex gap-2 items-center" }, [
      h("h2", o.label),
      h(ToggleSwitch, {
        name: o.label,
        trueValue: o.value,
        falseValue: false,
        onValueChange: (v: unknown) => {
          console.log("v", v);
        },
        label: o.label,
      }),
    ]),
  );
};
// const getPrimevueProps = () => {
//   const primevuePops: typeof context.useButtons extends true
//     ? SelectButtonProps
//     : typeof context.multiple extends true
//       ? MultiSelectProps
//       : SelectProps = { ...context };
//
//
//     return primevuePops;
//   }
//   primevuePops.optionLabel = primevuePops.optionLabel || "label";
//   primevuePops.optionValue = primevuePops.optionValue
//     ? primevuePops.optionValue
//     : context.convertToFlat
//       ? primevuePops.optionLabel
//       : "value";
//   if ("placeholder" in primevuePops)
//     primevuePops.placeholder = context.node.props.placeholder;
//   return primevuePops;
// };
// const onBeforeShow = () => {
//   if (dependsOn) {
//     if (node.props.lastParentValue == node.props.getParentFormValue()) {
//       return;
//     }
//     node.props.optionsFetcher();
//     return;
//   }
//   if (!useLazy || !options || node.props.optionsArray.value.length) return;
//   node.props.optionsFetcher();
// };
// const onValueChange = (value: unknown) => {
//   node.input(value);
//   emit("valueChange", value);
// };
// const forceReload = () => {
//   node.props.forceReload();
// };
// const renderOption = (optionProps: {
//   option: unknown;
//   selected: boolean;
//   index: number;
// }) => {
//   if (node.props.isLoading.value || node.props.errorMessageRef.value) return;
//   if (typeof context.slots.option == "function")
//     return context.slots.option(optionProps);
//   const { selected, option } = optionProps;
//   let icon = "";
//   let label = "";
//   let note = "";
//   if (option && typeof option == "object") {
//     const optionsMap = option as Record<string, unknown>;
//     icon = iconKey in optionsMap ? (optionsMap[iconKey] as string) : "";
//     if (typeof selectProps.optionLabel === "string") {
//       if (selectProps.optionLabel in optionsMap) {
//         const key = selectProps.optionLabel;
//         if (key in option) {
//           label = String(optionsMap[key]);
//         }
//       }
//     }
//   }
//   return h(
//     "div",
//     {
//       class: `flex ${context.pt?.option || ""} items-center ${selected ? "selected" : ""}`,
//     },
//     [
//       icon ? h(AppIcon, { icon }) : undefined,
//       h("span", label),
//       note ? h("span", note) : undefined,
//     ],
//   );
// };
// const selectProps = getPrimevueProps();
const filters = ref<
  Record<
    string,
    { value: string | null | undefined; matchMode: FilterMatchModeValues }
  >
>({ global: { value: null, matchMode: "contains" } });
const renderInputToggleCollection = () => {
  if (node.props.optionsArray?.value) {
    console.log("grpoois", node.props.optionsArray.value);
    return h(
      DataTable,
      {
        value: node.props.optionsArray,
      },
      {
        default: () => [
          h(
            Column,
            { header: "group" },
            {
              body: (data: unknown) => {
                console.log("datais", data.data, node.props.optionsArray);
                // return h(DevkitToggleGroup, {
                //   groupName: data.data.groupName as string,
                //   items: data.data.items as DropdownOption[],
                //   onValueChange: (v: unknown[]) => {
                //     if (node._value) {
                //       if (Array.isArray(node._value)) {
                //         node.input([...node._value, ...v]);
                //       }
                //     }
                //   },
                // });

                return h("h2", typeof data.data as string);
              },
            },
          ),
        ],
        header: () =>
          h(InputText, {
            modelValue: filters.value["global"].value,
            "onUpdate:modelValue": (v: string | null) =>
              (filters.value["global"].value = v),
          }),
      },
    );

    return node.props.optionsArray.value.map((a: unknown) => {
      console.log("grpoois", a);
      if (typeof a == "object" && a) {
        if ("items" in a && "groupName" in a) {
          return h(
            DataTable,
            {
              rows: 3,
              value: node.props.optionsArray,
            },
            {
              default: () => [
                h(Column, { field: "groupName", header: "group" }),
              ],
              header: () =>
                h(InputText, {
                  modelValue: filters.value["global"].value,
                  "onUpdate:modelValue": (v: string | null) =>
                    (filters.value["global"].value = v),
                }),
            },
          );

          return h(
            "div",
            {
              class: "flex justify-center flex-col items-center gap-2",
            },
            [
              h(DevkitToggleGroup, {
                groupName: a.groupName as string,
                items: a.items as DropdownOption[],
                onValueChange: (v: unknown[]) => {
                  if (node._value) {
                    if (Array.isArray(node._value)) {
                      node.input([...node._value, ...v]);
                    }
                  }
                },
              }),
            ],
          );
        }
      }
    });
  }
  return h("h2", node.props.optionsArray?.value || []);
};
</script>
<template>
  <component :is="renderInputToggleCollection" />
</template>
<style></style>
