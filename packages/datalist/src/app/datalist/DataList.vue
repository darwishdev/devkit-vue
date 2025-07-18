<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TReq extends Record<string, unknown>,
    TRecord extends Record<string, unknown>
  "
>
import DataTable, {
  type DataTablePassThroughOptions,
} from "primevue/datatable";
import { onBeforeUnmount } from "vue";
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
import { AppBtn, makeGridWrapperClassName } from "@devkitvue/base-components";
import { useI18n } from "vue-i18n";
import { computed, h, VNode } from "vue";
import { ObjectEntries, type StringUnknownRecord } from "@devkitvue/apiclient";
import DatalistRowActions from "./components/DatalistRowActions.vue";
const { t } = useI18n();
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
const {
  hideShowDeleted,
  isActionsDropdown,
  datalistKey,
  hideActions,
  gridConfig,
  displayType,
  rowIdentifier,
  datatableProps,
  isSelectionHidden,
} = props.context;
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
const isShowDeletedSwitctVisible = computed(() => {
  const deleted = datalistStore.datalistQueryResult.data?.deletedRecords;
  return (
    !hideShowDeleted &&
    ((deleted && deleted.length > 0) || datalistStore.isShowDeletedRef)
  );
});
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
const renderGlobalActions = () => {
  return datalistStore.permittedActions
    .filter((a) => a.actionKey == "create" || a.actionKey == "export")
    .map((actionBtn) => {
      const callback = (value: StringUnknownRecord) =>
        emit("create:submited", value);
      const slotKey =
        `globalActions.${actionBtn.actionKey as "create" | "export"}` as const;
      const slotFn = slots[slotKey];
      return slotFn
        ? slotFn({ store: datalistStore })
        : h(AppBtn, {
            variant: "outlined",
            action: () => actionBtn.actionFn(callback),
            ...actionBtn,
            key: actionBtn.actionKey,
          });
    });
};
const renderActionsColumn = (data: TRecord): VNode | VNode[] => {
  if (slots.actions) {
    return slots.actions({ data });
  }
  if (!rowIdentifier) return [];
  return h(
    DatalistRowActions,
    {
      data,
      rowIdentifier: rowIdentifier as string,
      hideShowDeleted,
      isActionsDropdown,
      storeKey: datalistKey,
    },
    slots,
  );
};
const globalInputChanged = (value: unknown) => {
  console.log("global input changed", value);
  if (!datalistStore.formElementNode) return;
  if (typeof datalistStore.formElementNode._value != "object") return;
  datalistStore.formElementNode.input({
    ...datalistStore.formElementNode._value,
    global: value,
  });
};
onBeforeUnmount(() => {
  datalistStore.$dispose();
});
const dataTablePassThrough = computed<DataTablePassThroughOptions>(() => {
  if (displayType != "card") {
    return {
      header: "transparent",
      thead: "transparent",
      foorer: "transparet",
    };
  }
  const bodyClassName = makeGridWrapperClassName(gridConfig);
  return {
    header: "transparent",
    thead: "hidden",
    tbody: bodyClassName,
    foorer: "transparet",
    headerRow: "hidden",
  };
});
</script>
<template>
  <Dialog />
  <DataTable
    :dataKey="(rowIdentifier as string) || undefined"
    :rows="10"
    :value="datalistStore.currenData"
    stateStorage="session"
    :stateKey="`${datalistKey}`"
    :max-height="200"
    :pt="dataTablePassThrough"
    :globalFilterFields="datalistStore.globalFilters"
    :filters="datalistStore.filtersFormValueRef"
    v-model:selection="datalistStore.modelSelectionRef"
    paginator
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :loading="
      datalistStore.datalistQueryResult.isLoading ||
      datalistStore.datalistQueryResult.isFetching
    "
    v-bind="datatableProps"
  >
    <template #header="">
      <slot name="header" :store="datalistStore">
        <div class="d-flex">
          <slot name="globalActions" :store="datalistStore">
            <div
              class="global-actions flex-wrap gap-2 flex-col md:flex-row p-4 rounded border border-slate-300 dark:border-zinc-700 my-4 flex justify-between md:items-center"
            >
              <div class="global-actions__start flex gap-2 flex-wrap">
                <slot name="globalActionsStartPrepend" :store="datalistStore" />

                <!-- eslint-disable-next-line vue/valid-v-for -->
                <component
                  v-for="slotContent in renderGlobalActions()"
                  :is="slotContent"
                />
                <slot name="globalActionsStartAppend" :store="datalistStore" />
              </div>
              <div
                class="global-actions__end flex-wrap flex gap-4 items-center"
              >
                <div
                  class="deleted-switch flex gap-2 items-center"
                  v-if="isShowDeletedSwitctVisible"
                >
                  <ToggleSwitch v-model="datalistStore.isShowDeletedRef" />
                  show deleted
                </div>
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
                    variant="outlined"
                    icon="delete-bin-2-line"
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
          <div
            class="middle flex flex-wrap gap-4 justify-between items-center my-8"
          >
            <slot name="title">
              <div class="start">
                <h2 class="font-bold text-3xl">
                  {{ t(datalistStore.optionsInUse.title) }}
                </h2>
                <p
                  v-if="datalistStore.optionsInUse.description"
                  class="pu-2 me-4 hidden md:block"
                >
                  {{ t(datalistStore.optionsInUse.description) }}
                </p>
              </div>
            </slot>
            <IconField fluid v-if="datalistStore.globalFilters.length">
              <InputIcon>
                <AppIcon icon="menu-search-line" />
              </InputIcon>
              <InputText
                placeholder="Keyword Search"
                :defaultValue="
                  (datalistStore.filterFormValue?.global as string) || ''
                "
                @value-change="globalInputChanged"
              />
            </IconField>
          </div>
        </div>
        <slot name="filtersPanel" :store="datalistStore">
          <DatalistFiltersForm
            v-if="datalistStore.filtersFormSchema.length"
            :datalistKey="context.datalistKey"
          />
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
      :pt="{ headerCell: 'transparent', bodyCell: 'transparent' }"
    >
    </Column>

    <Column v-if="context.displayType == 'card'" key="card">
      <template #body="{ data }: { data: TRecord }">
        <slot name="card" :data="data">
          <div class="card-item">
            <slot name="cardStart" :data="data as TRecord" />
            <slot name="cardEnd" :data="data as TRecord" />
          </div>
        </slot>
      </template>
    </Column>
    <Column
      v-else
      v-for="[columnKey, columnValue] in ObjectEntries(
        datalistStore.datatableColumnsRef,
      )"
      :key="columnKey"
      :pt="{ headerCell: 'transparent', bodyCell: 'transparent' }"
      v-bind="columnValue?.props"
    >
      <template v-if="columnValue" #body="{ data }">
        <slot
          :name="`column.${columnKey as string}`"
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
      field="actions"
      :frozen="true"
      key="actions-column"
      :pt="{ headerCell: 'transparent', bodyCell: 'transparent' }"
      alignFrozen="right"
      :header-style="{ width: '3rem' }"
      v-if="!hideActions && rowIdentifier"
    >
      <template #body="{ data: record }">
        <component
          :key="record[rowIdentifier]"
          :is="renderActionsColumn(record)"
        />
      </template>
    </Column>
  </DataTable>
</template>
<style>
td .fallback-icon {
  width: 50px !important;
  height: 50px;
}

.p-datatable-tbody > tr,
.p-datatable .p-paginator,
.p-datatable-scrollable
  > .p-datatable-table-container
  > .p-datatable-table
  > .p-datatable-thead,
.p-datatable-scrollable
  > .p-datatable-table-container
  > .p-virtualscroller
  > .p-datatable-table
  > .p-datatable-thead {
  --tw-bg-opacity: 0;
}

td .fallback-icon {
  width: 50px !important;
  height: 50px;
}
</style>
