<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TOptionsReq extends StringUnknownRecord,
    TValue extends string | number | StringUnknownRecord,
    TOption extends StringUnknownRecord = DropdownOption<TValue>,
    TUseGroup extends boolean = false,
    TGroupOption extends
      | StringUnknownRecord
      | undefined = TUseGroup extends true
      ? DropdownOptionWithGroup<TValue>
      : undefined,
    TOptionsResp extends StringUnknownRecord = TUseGroup extends true
      ? DropdownOptionsWithGroup<TValue>
      : DropdownOptions<TValue>
  "
>
import { type StringUnknownRecord } from "@devkitvue/apiclient";
import { computed, h, ref, type VNode } from "vue";

import type {
  InputToggleCollectionProps,
  DropdownOption,
  DropdownOptionWithGroup,
  DropdownOptionsWithGroup,
  DropdownOptions,
} from "@devkitvue/form";
import DevkitToggleGroup from "./DevkitToggleGroup.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import type { FilterMatchModeValues } from "@devkitvue/config";
import Checkbox from "primevue/checkbox";
import ToggleSwitch from "primevue/toggleswitch";
import { useDropdownKeysFetcher } from "./useDropwdownKeysFetcher";
import { AppBtn, AppIcon } from "@devkitvue/base-components";
type ToggleCollectionSlots = {
  expanstion?: (props: {
    groupName: string;
    groupNote?: string;
    labelKey?: keyof TOption;
    valueKey?: keyof TOption;
    noteKey?: keyof TOption;
    iconKey?: keyof TOption;
    useCheckBox?: boolean;
    modelValue: Set<TValue>;
    "onUpdate:modelValue": (val: Set<TValue>) => void;
    items: TOption[];
  }) => VNode[] | VNode;
  "group-header"?: (props: {
    groupNote: string;
    groupName: string;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
  groupNote?: (props: { groupNote: string }) => VNode[] | VNode;

  "group-select-all"?: (props: {
    groupName: string;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
  "group-option"?: (props: {
    option: TOption;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];

  /** Custom content in the header actions area (wraps all the buttons and input) */
  "header-actions"?: (props: {
    expandAll: () => void;
    collapseAll: () => void;
    modelValue: string | null | undefined;
    "onUpdate:modelValue": (val: string | null) => void;
  }) => VNode[];

  /** Custom button to expand all groups */
  "expand-all"?: (props: { expandAll: () => void }) => VNode[];

  /** Custom button to collapse all groups */
  "collapse-all"?: (props: { collapseAll: () => void }) => VNode[];

  /** Custom checkbox to toggle "select all" */
  "select-all"?: (props: {
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];

  /** Custom input for the global search filter */
  "search-input"?: (props: {
    modelValue: string | null | undefined;
    "onUpdate:modelValue": (val: string | null) => void;
  }) => VNode[];

  /** Custom toggle control (checkbox or switch) per row */
  option?: (props: {
    data: TOption;
    modelValue: boolean;
    "onUpdate:modelValue": (val: boolean) => void;
  }) => VNode[];
};
const slots = defineSlots<ToggleCollectionSlots>();
const props =
  defineProps<
    InputToggleCollectionProps<
      TApi,
      TOptionsReq,
      TValue,
      TOption,
      TUseGroup,
      TGroupOption,
      TOptionsResp
    >
  >();
const { context } = props;
defineEmits<{
  (e: "valueChange", value: unknown): void;
}>();

const {
  node,
  dataTableProps,
  useGroup = false,
  groupNameKey = "groupName" as keyof TGroupOption,
  groupItemsKey = "items" as keyof TGroupOption,
  groupNoteKey = "groupNote" as keyof TGroupOption,
  useCheckBox,
  labelKey = "label" as keyof TOption,
  valueKey = "value" as keyof TOption,
  noteKey = "note" as keyof TOption,
  iconKey = "icon" as keyof TOption,
  groupByKey,
} = context;

const {
  getLabel,
  getValue,
  getIcon,
  getNote,
  getGroupNote,
  getGroupName,
  getGroupItems,
} = useDropdownKeysFetcher<TOption, TGroupOption, TValue>({
  labelKey,
  valueKey,

  iconKey,
  noteKey,
  groupItemsKey,
  groupNoteKey,
  groupNameKey,
});
const { optionsArray } = node.props;

const processedOptionsArray = computed<TOption[] | TGroupOption[]>(() => {
  if (!isGroupedComponent) {
    return (optionsArray.value || []) as TOption[];
  }
  const rawOptions = optionsArray.value || [];
  if (groupByKey) {
    const groupedMap = new Map<string, TOption[]>();
    for (const option of rawOptions as TOption[]) {
      const groupName = String(option[groupByKey] ?? "Ungrouped");
      if (!groupedMap.has(groupName)) {
        groupedMap.set(groupName, []);
      }
      groupedMap.get(groupName)!.push(option);
    }

    return Array.from(groupedMap.entries()).map(([groupName, items]) => {
      return {
        groupName,
        items,
      };
    });
  }
  return (
    optionsArray.value.map((group: TGroupOption) => {
      const labels = getGroupItems(group).map((option) => getLabel(option));
      return { ...group, searchableLabel: labels } as TGroupOption;
    }) || ([] as TGroupOption[])
  );
});

const isGroupedComponent = typeof groupByKey != "undefined" || useGroup;
const isValueGroupOption = (
  value: TOption[] | TGroupOption[],
): value is TGroupOption[] => {
  return isGroupedComponent;
};
const filters = ref<
  Record<
    string,
    { value: string | null | undefined; matchMode: FilterMatchModeValues }
  >
>({ global: { value: null, matchMode: "contains" } });
const expandedRowsRef = ref<Record<string, boolean>>({ page: true });
const isValueSet = <T,>(value: unknown): value is Set<T> => {
  return value instanceof Set;
};
const selectionsRef = ref<Record<string, Set<TValue>> | Set<TValue>>(
  isGroupedComponent
    ? (() => {
        const groupMap: Record<string, Set<TValue>> = {};
        const selected = new Set<TValue>((node._value ?? []) as TValue[]);
        for (const group of processedOptionsArray.value as TGroupOption[]) {
          const groupName = getGroupName(group);
          const items = getGroupItems(group);
          const groupSet = new Set<TValue>();
          for (const item of items) {
            const value = getValue(item);
            if (selected.has(value)) {
              groupSet.add(value);
            }
          }
          groupMap[groupName] = groupSet;
        }
        return groupMap;
      })()
    : new Set<TValue>((node._value as TValue[]) ?? []),
);
const flattenedInputValue = computed(() => {
  if (!isGroupedComponent) {
    return Array.from(selectionsRef.value as Set<TValue>);
  }
  const arr = Object.values(selectionsRef.value).flatMap((set: Set<TValue>) =>
    Array.from(set),
  );
  return arr;
});

const isAllCheckedComputed = computed<boolean>({
  get() {
    if (flattenedInputValue.value.length == 0) return false;
    if (!isGroupedComponent) {
      return (
        processedOptionsArray.value.length === flattenedInputValue.value.length
      );
    }
    return (
      processedOptionsArray.value.flatMap((group) =>
        getGroupItems(group as TGroupOption).map((item) => getValue(item)),
      ).length == flattenedInputValue.value.length
    );
  },
  set(checked: boolean) {
    if (!checked) {
      const newSelections = isValueSet(selectionsRef.value)
        ? new Set<TValue>()
        : ({} as Record<string, Set<TValue>>);
      selectionsRef.value = newSelections;
      node.input(flattenedInputValue.value);
      return;
    }
    if (!isGroupedComponent) {
      selectionsRef.value = new Set<TValue>(
        processedOptionsArray.value.map((item) => getValue(item as TOption)),
      );
      node.input(flattenedInputValue.value);
      return;
    }
    const newSelections: Record<string, Set<TValue>> = {};
    const items = processedOptionsArray.value as TGroupOption[];
    for (const group of items) {
      const groupName = getGroupName(group);
      const items = getGroupItems(group);
      newSelections[groupName] = new Set<TValue>(
        items.map((item) => getValue(item)),
      );
    }
    selectionsRef.value = newSelections;
    node.input(flattenedInputValue.value);
  },
});
const renderExpansionSlot = ({ data }: { data: TGroupOption }) => {
  if (!isGroupedComponent) return;
  const selections = selectionsRef.value as Record<string, Set<TValue>>;
  if (!selections[getGroupName(data)]) {
    selections[getGroupName(data)] = new Set<TValue>();
  }
  const groupProps = {
    groupName: getGroupName(data),
    groupNote: getGroupNote(data),
    modelValue: selections[getGroupName(data)],
    "onUpdate:modelValue": (selected: Set<TValue>) => {
      selections[getGroupName(data)] = selected;
      selectionsRef.value = selections;
      node.input(flattenedInputValue.value);
    },
    items: getGroupItems(data),
  };
  if (slots.expanstion) return slots.expanstion(groupProps);
  return h("div", { class: "p-4 border-none" }, [
    h(DevkitToggleGroup<TValue, TOption>, groupProps, {
      header: slots["group-header"],
      note: slots.groupNote,
      "select-all": slots["group-select-all"],
      option: slots["group-option"],
    }),
  ]);
};
const renderTableColumns = () => {
  if (isGroupedComponent) {
    return [
      h(
        Column,
        { header: "group", class: "w-[95%] p-0 border-none" },
        {
          body: ({ data }: { data: TGroupOption }) =>
            h(AppBtn, {
              action: () =>
                getGroupName(data) in expandedRowsRef.value
                  ? delete expandedRowsRef.value[getGroupName(data)]
                  : (expandedRowsRef.value[getGroupName(data)] = true),
              label: getGroupName(data),
              fluid: true,
              class:
                "color-text h-full p-4 hover-none px-8 text-left justify-start",

              variant: "text",
            }),
        },
      ),
      h(Column, {
        expander: true,
        class: "border-none  p-0",
        headerStyle: { width: "5%" },
      }),
    ];
  }
  const selections = selectionsRef.value as Set<TValue>;
  const onChecked = (data: TOption, checked: boolean) => {
    if (checked) {
      selections.add(getValue(data));
    } else {
      selections.delete(getValue(data));
    }
  };
  const modelValue = (data: TOption) => selections.has(getValue(data));
  return h(
    Column,
    { header: "group", class: "border-none" },
    {
      body: ({ data }: { data: TOption }) => [
        slots.option
          ? slots.option({
              data,
              modelValue: modelValue(data),
              "onUpdate:modelValue": (checked: boolean) =>
                onChecked(data, checked),
            })
          : useCheckBox
            ? h(Checkbox, {
                modelValue: modelValue(data),
                binary: true,
                "onUpdate:modelValue": (checked: boolean) =>
                  onChecked(data, checked),
              })
            : h(ToggleSwitch, {
                modelValue: modelValue(data),
                "onUpdate:modelValue": (checked: boolean) =>
                  onChecked(data, checked),
              }),

        h("label", [
          getIcon(data) ? h(AppIcon, { icon: getIcon(data) }) : undefined,
          getLabel(data),
          h("p", getNote(data)),
        ]),
      ],
    },
  );
};
const expandAll = () => {
  const rows: Record<string, boolean> = {};
  if (!isValueGroupOption(processedOptionsArray.value)) return;
  processedOptionsArray.value.forEach((item: TGroupOption) => {
    rows[getGroupName(item)] = true;
  });
  expandedRowsRef.value = rows;
};
const collapseAll = () => {
  expandedRowsRef.value = {};
};
const renderInputToggleCollectionGroup = () => {
  return h(
    DataTable,
    {
      value: processedOptionsArray.value,
      rows: 3,
      dataKey: isGroupedComponent ? groupNameKey : valueKey,
      expandedRows: !isGroupedComponent ? undefined : expandedRowsRef.value,
      pt: {
        header: "transparent",
        footer: "transparent",
        rowExpansion: "rounded border-none",
        bodyRow: "glass rounded my-2 flex items-center",
        rowExpansionCell: "border-none",
        thead: "hidden",
        headerRow: "hidden",
      },
      "onUpdate:expandedRows": !isGroupedComponent
        ? undefined
        : (val: Record<string, boolean>) => (expandedRowsRef.value = val),
      paginator: true,
      paginatorTemplate:
        "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown",
      globalFilterFields: [
        groupNameKey,
        groupNoteKey,
        noteKey,
        labelKey,
        "searchableLabel",
      ],
      filters: filters.value,
      ...dataTableProps,
    },
    {
      expansion: renderExpansionSlot,
      default: () => renderTableColumns(),
      header: () =>
        slots["header-actions"]
          ? slots["header-actions"]({
              expandAll,
              collapseAll,
              modelValue: filters.value["global"].value,
              "onUpdate:modelValue": (v: string | null) =>
                (filters.value["global"].value = v),
            })
          : h("div", { class: "flex justify-between items-center" }, [
              h("h2", { class: "font-bold" }, node.props.label),
              h(
                "div",
                {
                  class: "flex items-center gap-4",
                },
                [
                  slots["expand-all"]
                    ? slots["expand-all"]({ expandAll })
                    : h(AppBtn, {
                        label: "expand all",
                        outlined: true,
                        icon: "add-circle-line",
                        action: expandAll,
                      }),

                  slots["collapse-all"]
                    ? slots["collapse-all"]({ collapseAll })
                    : h(AppBtn, {
                        label: "collapse all",
                        severity: "warn",
                        outlined: true,
                        icon: "substract-line",
                        action: collapseAll,
                      }),
                  slots["select-all"]
                    ? slots["select-all"]({
                        modelValue: isAllCheckedComputed.value,
                        "onUpdate:modelValue": (val: boolean) => {
                          isAllCheckedComputed.value = val;
                        },
                      })
                    : h("div", { class: "flex gap-2 items-center" }, [
                        h(Checkbox, {
                          binary: true,
                          modelValue: isAllCheckedComputed.value,
                          "onUpdate:modelValue": (val: boolean) => {
                            isAllCheckedComputed.value = val;
                          },
                        }),
                        h("label", "check all"),
                      ]),
                  slots["search-input"]
                    ? slots["search-input"]({
                        modelValue: filters.value["global"].value,
                        "onUpdate:modelValue": (v: string | null) =>
                          (filters.value["global"].value = v),
                      })
                    : h(InputText, {
                        modelValue: filters.value["global"].value,
                        placeholder: "search",
                        "onUpdate:modelValue": (v: string | null) =>
                          (filters.value["global"].value = v),
                      }),
                ],
              ),
            ]),
    },
  );
};
</script>
<template>
  <component :is="renderInputToggleCollectionGroup" />
</template>
<style></style>
