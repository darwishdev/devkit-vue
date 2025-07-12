<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function> = Record<string, Function>,
    TRecord extends StringUnknownRecord = StringUnknownRecord
  "
>
import Menu from "primevue/menu";
import { AppBtn } from "@devkitvue/base-components";
import { computed, h, ref, VNode } from "vue";
import { StringUnknownRecord } from "@devkitvue/apiclient";
import {
  DatalistRowActionsEmits,
  DatalistRowActionsProps,
  DatalistRowActionsSlots,
} from "../types";
import { useDatalistStoreWithKey } from "../store/DatalistStore";
const emit = defineEmits<DatalistRowActionsEmits>();
const slots = defineSlots<DatalistRowActionsSlots<TApi, TRecord>>();
const { data, hideShowDeleted, rowIdentifier, isActionsDropdown, storeKey } =
  defineProps<DatalistRowActionsProps<TRecord>>();
const datalistStore = useDatalistStoreWithKey<
  TApi,
  StringUnknownRecord,
  TRecord
>(storeKey);
const isDeleteVisibile = computed(() => {
  if (hideShowDeleted) {
    return typeof datalistStore.optionsInUse.deleteHandler != "undefined";
  }
  return (
    datalistStore.optionsInUse.deleteHandler && datalistStore.isShowDeletedRef
  );
});

const deleteRestoreButtonProps = computed(() => {
  return {
    key: datalistStore.deleteRestoreVariants.label,
    action: datalistStore.deleteRestoreOpenDialog,
    ...datalistStore.deleteRestoreVariants,
  };
});
const renderRowActions = (record: TRecord) => {
  return datalistStore.permittedActions
    .filter(
      (k) =>
        k.actionKey == "update" ||
        k.actionKey == "delete" ||
        k.actionKey == "deleteRestore" ||
        k.actionKey == "view",
    )
    .map((actionBtn) => {
      const callback = (value: StringUnknownRecord) =>
        emit("update:submited", value);

      const slotKey = `rowActions.${actionBtn.actionKey}` as keyof typeof slots;
      return slots[slotKey]
        ? slots[slotKey]!({
            store: datalistStore,
            data: record,
          })
        : h(AppBtn, {
            class: "justify-start",
            action: () => actionBtn.actionFn(callback, record),
            variant: "text",
            ...actionBtn,
          });
    });
};
const actionsMenuRef = ref();
const renderActionsColumn = (): VNode | VNode[] => {
  const children: (VNode | VNode[])[] = [];
  if (slots.actionsPrepend) {
    children[0] = slots.actionsPrepend({ data });
  }
  if (isDeleteVisibile.value) {
    const deleteBtn = slots["rowActions.delete"]
      ? slots["rowActions.delete"]({ data, store: datalistStore })
      : h(AppBtn, {
          action: () =>
            datalistStore.deleteRestoreOpenDialog({
              record: data,
              isHardDelete: true,
            }),
          icon: "delete-bin-2-line",
          class: "justify-start",
          label: "hard_delete",
          severity: "danger",
          variant: "text",
        });
    if (deleteBtn) children.push(deleteBtn);
  }
  if (datalistStore.optionsInUse.deleteRestoreHandler) {
    const deleteBtn = slots["rowActions.deleteRestore"]
      ? slots["rowActions.deleteRestore"]({ data, store: datalistStore })
      : h(AppBtn, {
          ...deleteRestoreButtonProps.value,
          class: "justify-start",
          variant: "text",
          action: () =>
            datalistStore.deleteRestoreOpenDialog({
              record: data,
            }),
        });

    if (deleteBtn) children.push(deleteBtn);
  }

  return isActionsDropdown
    ? h("div", {}, [
        h(AppBtn, {
          icon: "more-2-line",
          ariaHasPopup: true,
          variant: "outlined",
          ariaControls: "actions-" + data[rowIdentifier],
          action: (event: Event) => {
            console.log("actions menu ref is", actionsMenuRef.value);
            console.log("envet ef is", event);
            if (!actionsMenuRef.value) return;
            actionsMenuRef.value.toggle(event);
          },
        }),
        h(
          Menu,
          {
            ref: (ref) => {
              console.log("menu ref is", ref);
              actionsMenuRef.value = ref;
            },
            pt: {
              menu: "flex flex-column",
            },
            id: "actions-" + data[rowIdentifier],
            popup: true,
          },
          {
            start: () =>
              h("div", { class: "flex flex-col" }, [
                children,
                ...renderRowActions(data),
                slots.actionsAppend ? slots.actionsAppend({ data }) : undefined,
              ]),
          },
        ),
      ])
    : h("div", { class: "d-flex" }, [
        children,
        ...renderRowActions(data),
        slots.actionsAppend ? slots.actionsAppend({ data }) : undefined,
      ]);
};
</script>
<template>
  <component :is="renderActionsColumn"></component>
</template>
