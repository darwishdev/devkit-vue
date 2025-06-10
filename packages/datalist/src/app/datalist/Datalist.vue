<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TReq extends Record<string, unknown> = StringUnknownRecord,
    TRecord extends Record<string, unknown> = StringUnknownRecord,
    TFiltersReq extends Record<string, unknown> | undefined = undefined,
    TApiResponse extends Record<string, unknown> | undefined = undefined,
    TFormSectionsRequest extends Record<string, unknown> | undefined = undefined
  "
>
import DataTable from "primevue/datatable";
import Menu from "primevue/menu";

import { Dialog } from "primevue";
import { useDatalistStoreWithProps } from "./store/DatalistStore";

import {
  Column,
  IconField,
  InputIcon,
  InputText,
  ToggleSwitch,
} from "primevue";
import {
  type DatalistEmits,
  type DatalistProps,
  type DatalistSlots,
  type DatalistStore,
} from "./types";
import DatalistFiltersForm from "./components/DatalistFiltersForm.vue";
import { AppBtn } from "@devkit/base-components";
import { objectEntries } from "@vueuse/core";
import { computed, h, ref, VNode } from "vue";
import { StringUnknownRecord } from "@devkit/apiclient";
const emit = defineEmits<DatalistEmits<TRecord, TApiResponse>>();
const props =
  defineProps<
    DatalistProps<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >
  >();
const { hideShowDeleted, isActionsDropdown, isSelectionHidden } = props.context;
const datalistStore: DatalistStore<
  TApi,
  TReq,
  TRecord,
  TFiltersReq,
  TApiResponse,
  TFormSectionsRequest
> = useDatalistStoreWithProps(props);
const isDeleteVisibile = computed(
  () =>
    datalistStore.optionsInUse.deleteHandler &&
    (hideShowDeleted || datalistStore.isShowDeletedRef),
);
const isShowDeletedSwitctVisible = computed(
  () =>
    !hideShowDeleted &&
    (datalistStore.deleteRestoreVariants.hasDeletedRecords ||
      datalistStore.isShowDeletedRef),
);
const slots =
  defineSlots<
    DatalistSlots<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >
  >();
const deleteRestoreButtonProps = computed(() => {
  return {
    key: datalistStore.deleteRestoreVariants.label,
    action: datalistStore.deleteRestoreOpenDialog,
    ...datalistStore.deleteRestoreVariants,
  };
});
await datalistStore.init();
const renderRowActions = (record: TRecord) => {
  return datalistStore.permittedActions.rowActions.map((actionBtn) => {
    const callback = (value: StringUnknownRecord) =>
      emit("update:submited", value);
    return slots[`rowActions.${actionBtn.actionKey}`]
      ? slots[`rowActions.${actionBtn.actionKey}`]!({
          store: datalistStore,
          data: record,
        })
      : h(AppBtn, {
          action: () => actionBtn.actionFn(callback, record),
          ...actionBtn,
        });
  });
};
const renderGlobalActions = () => {
  return datalistStore.permittedActions.globalActions.map((actionBtn) => {
    const callback = (value: StringUnknownRecord) =>
      emit("create:submited", value);
    return slots[`globalActions.${actionBtn.actionKey}`]
      ? slots[`globalActions.${actionBtn.actionKey}`]!({ store: datalistStore })
      : h(AppBtn, { action: () => actionBtn.actionFn(callback), ...actionBtn });
  });
};
const actionsMenuRef = ref();
const renderActionsColumn = (data: TRecord): VNode | VNode[] => {
  const children: any[] = [];
  if (slots.actions) {
    return slots.actions({ data });
  }
  if (slots.actionsPrepend) {
    children[0] = slots.actionsPrepend({ data });
  }
  if (isDeleteVisibile) {
    const deleteBtn = slots["rowActions.delete"]
      ? slots["rowActions.delete"]({ data, store: datalistStore })
      : h(AppBtn, {
          action: () =>
            datalistStore.deleteRestoreOpenDialog({
              record: data,
              isHardDelete: true,
            }),
          icon: "trash",
          label: "hard_delete",
          severity: "danger",
        });
    children.push(deleteBtn);
  }
  if (datalistStore.optionsInUse.deleteRestoreHandler) {
    const deleteBtn = slots["rowActions.deleteRestore"]
      ? slots["rowActions.deleteRestore"]({ data, store: datalistStore })
      : h(AppBtn, {
          ...deleteRestoreButtonProps.value,
          action: () =>
            datalistStore.deleteRestoreOpenDialog({
              record: data,
            }),
        });

    children.push(deleteBtn);
  }

  return isActionsDropdown
    ? h("div", {}, [
        h(AppBtn, {
          icon: "menu",
          ariaHasPopup: true,
          label: "open",
          ariaControls: "actions",
          action: (event: Event) => {
            if (!actionsMenuRef.value) return;
            actionsMenuRef.value.toggle(event);
          },
        }),
        h(
          Menu,
          {
            ref: "actionsMenuRef",
            id: "actions",
            popup: true,
          },
          {
            start: () => [
              children,
              ...renderRowActions(data),
              slots.actionsAppend ? slots.actionsAppend({ data }) : undefined,
            ],
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
  <Dialog />
  <DataTable
    :dataKey="(context.rowIdentifier as string) || undefined"
    :rows="10"
    :value="datalistStore.currenData"
    :max-height="200"
    :globalFilterFields="datalistStore.globalFilters"
    :filters="datalistStore.filtersFormValueRef"
    v-model:selection="datalistStore.modelSelectionRef"
    paginator
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :loading="
      datalistStore.datalistQueryResult.isLoading ||
      datalistStore.datalistQueryResult.isFetching
    "
  >
    <template #header="">
      <slot name="header" :store="datalistStore">
        <div class="d-flex">
          <slot name="globalActions" :store="datalistStore">
            <div class="global-actions">
              <div class="global-actions__start">
                <slot name="globalActionsStartPrepend" :store="datalistStore" />
                <component
                  v-for="(slotContent, index) in renderGlobalActions()"
                  :key="index"
                  :is="slotContent"
                />
                <slot name="globalActionsStartAppend" :store="datalistStore" />
              </div>
              <div class="global-actions__end">
                <slot name="globalActionsEndPrepend" :store="datalistStore" />
                <slot
                  name="globalActions.delete"
                  v-if="isDeleteVisibile"
                  :store="datalistStore"
                >
                  <AppBtn
                    :action="
                      () =>
                        datalistStore.deleteRestoreOpenDialog({
                          isHardDelete: true,
                        })
                    "
                    label="hard_delete"
                    severity="danger"
                  />
                </slot>
                <slot
                  name="globalActions.deleteRestore"
                  v-if="datalistStore.optionsInUse.deleteRestoreHandler"
                  :store="datalistStore"
                >
                  <AppBtn v-bind="deleteRestoreButtonProps" />
                </slot>

                <slot name="globalActionsEndAppend" :store="datalistStore" />
              </div>
            </div>
          </slot>
          <div class="deleted-switch" v-if="isShowDeletedSwitctVisible">
            show deleted
            <ToggleSwitch v-model="datalistStore.isShowDeletedRef" />
          </div>
          <IconField v-if="datalistStore.globalFilters.length">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              :modelValue="
                (datalistStore.filtersFormStore.initialFormValue[
                  'global'
                ] as string) || ''
              "
              @update:modelValue="
                (value: unknown) => {
                  console.log('val; ', value);
                  datalistStore.filtersFormStore.setInputValue('global', value);
                }
              "
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
        <slot
          name="filtersPanel"
          :store="datalistStore"
          v-if="datalistStore.filtersFormSchema.length"
        >
          <DatalistFiltersForm :datalistKey="context.datalistKey" />
        </slot>
      </slot>
    </template>
    <template #empty>
      <slot name="empty">
        <h2 v-if="!datalistStore.isFiltersFormValid">select filters</h2>
        <h2 v-else>{{ datalistStore.deleteRestoreVariants.empty }}</h2>
      </slot>
    </template>
    <Column
      v-if="!isSelectionHidden"
      selectionMode="multiple"
      :pt="{ headerCell: 'transparent' }"
    >
    </Column>

    <Column v-if="context.displayType == 'card'" key="card">
      <template #body="{ data }">
        <slot name="card" :data="data as TRecord">
          <div class="card-item">
            <slot name="cardStart" :data="data as TRecord" />
            <slot name="cardEnd" :data="data as TRecord" />
          </div>
        </slot>
      </template>
    </Column>
    <Column
      v-else
      v-for="[columnKey, columnValue] in objectEntries(
        datalistStore.datatableColumnsRef,
      )"
      :key="columnKey"
      v-bind="columnValue?.props"
    >
      <template v-if="columnValue" #body="{ data }">
        <slot
          :name="`column.${columnKey}`"
          :data="data as TRecord"
          :store="datalistStore"
        >
          <component
            v-if="typeof columnValue.renderHtml == 'function'"
            :is="() => columnValue.renderHtml!(data)"
          />
        </slot>
      </template>
    </Column>
    <Column
      header="actions"
      :header-style="{ width: '1rem' }"
      v-if="!context.hideActions"
    >
      <template #body="{ data: record }">
        <component :is="renderActionsColumn(record)" />
      </template>
    </Column>
  </DataTable>
</template>
