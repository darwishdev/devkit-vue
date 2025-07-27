<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TRequest extends StringUnknownRecord,
    TRecord extends StringUnknownRecord,
    TResp extends StringUnknownRecord,
    TFormSectionsRequest extends StringUnknownRecord | undefined = undefined
  "
>
import { computed, h, inject, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  type ApiResponseFind,
  type DataViewEmits,
  type DataViewProps,
  type DataViewSlots,
} from "./types";
import {
  ObjectEntries,
  resolveApiEndpoint,
  type StringUnknownRecord,
} from "@devkitvue/apiclient";
import { DataList, useActions } from "@devkitvue/datalist";
import { AppBtn, DateStringDigitToDate } from "@devkitvue/base-components";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue";
import { DataCard } from "@devkitvue/datalist";
import { useI18n } from "vue-i18n";
import DataField from "./DataField.vue";
const emit = defineEmits<DataViewEmits>();
const { context } =
  defineProps<
    DataViewProps<TApi, TRequest, TRecord, TResp, TFormSectionsRequest>
  >();
const slots = defineSlots<DataViewSlots<TRecord, TResp>>();
const isDeletedRef = ref(false);
const route = useRoute();
const toast = useToast();
const apiClient = inject<TApi>("apiClient");
const {
  title,
  requestValue,
  viewKey,
  routerParamName = "id",
  endFields,
  cardConfig,
  record,
  pt,
  startFields,
  requestKey = "recordId" as keyof TRequest,
  datalistKey,
  requestMapper,
} = context;

const handleError = (e: unknown) => {
  if (e instanceof Error) {
    toast.add({
      severity: "error",
      summary: "failed",
      detail: e.message,
      life: 3000,
    });
    return;
  }
  toast.add({
    severity: "error",
    summary: "failed",
    detail: e,
    life: 3000,
  });
};
const computedRequestValue = computed(() => {
  if (requestValue) return context.requestValue;
  try {
    const rawParam = route.params[routerParamName!] as string;
    return /^\d+$/.test(rawParam) ? Number(rawParam) : rawParam;
  } catch (e: unknown) {
    handleError(e);
    return 0;
  }
});
const queryFn = async (): Promise<ApiResponseFind<TRecord>> => {
  if (typeof record == "object") {
    return { record: record as TRecord, options: context.options };
  }
  try {
    let reqRecord: StringUnknownRecord = {};
    reqRecord[requestKey as string] = computedRequestValue.value;
    const req: TRequest = reqRecord as TRequest;
    if (requestMapper) {
      requestMapper(req);
    }
    const apiResponse = await resolveApiEndpoint<
      TApi,
      typeof req,
      ApiResponseFind<TRecord>
    >(record, apiClient, req);
    // const newResponse = responseMapper
    //   ? responseMapper(apiResponse)
    //   : apiResponse;
    if (!apiResponse.record) return {};
    isDeletedRef.value = apiResponse.record.deletedAt != "";
    return apiResponse;
  } catch (e) {
    handleError(e);
    throw e;
  }
  // resolveApiEndpoint(records, apiClient, request)
};

// let initialCallbackFinished = false;
const dataViewQueryResult = useQuery<ApiResponseFind<TRecord>, Error>({
  queryKey: [viewKey, computedRequestValue],
  queryFn: () =>
    queryFn().then(async (response) => {
      return response;
    }),
  enabled: true,
});
const optionsInUse = computed(
  () =>
    dataViewQueryResult.data.value?.options ||
    context.options || { title: context.viewKey },
);
const currentData = computed(() => {
  return dataViewQueryResult.data.value?.record || undefined;
});
const {
  permittedActions,
  createUpdateRecord,
  deleteRestoreOpenDialog,
  deleteRestoreVariants,
  // deleteRestoreMutationFn,
  // deleteMutation,
  viewRecord,
} = useActions({
  title: "hamada",
  isDeletedRef: isDeletedRef,
  dataKeys: [datalistKey || ""],
  options: optionsInUse,
  formSections: context.formSections,
  rowIdentifier: context.rowIdentifier,
});

const renderActions = () => {
  return permittedActions.value
    .filter((k) => ["delete", "deleteRestore", "update"].includes(k.actionKey))
    .map((actionBtn) => {
      const typedActionKey = actionBtn.actionKey as
        | "delete"
        | "deleteRestore"
        | "update";
      // const callbackKey = `${typedActionKey}:submited` as const;
      const slotKey = `actions.${typedActionKey}` as const;
      const callback = (value: StringUnknownRecord) =>
        emit("update:submited", value);
      const slotFn = slots[slotKey];
      return slotFn
        ? slotFn({ record: currentData.value! })
        : h(AppBtn, {
            variant: "outlined",
            action: () => actionBtn.actionFn(callback, currentData.value),
            ...actionBtn,
            key: actionBtn.actionKey + actionBtn.label,
          });
    });
};
console.log(
  slots,
  permittedActions,
  createUpdateRecord,
  deleteRestoreOpenDialog,
  // deleteRestoreMutationFn,
  // deleteMutation,
  viewRecord,
);
const { push } = useRouter();
const deleteRestoreButtonProps = computed(() => {
  console.log("Crrent data is", currentData);
  return {
    key: deleteRestoreVariants.value.label,
    action: () => deleteRestoreOpenDialog({ record: currentData.value }),
    ...deleteRestoreVariants.value,
  };
});
const renderFileds = (position: "start" | "end") => {
  const fileds = position == "start" ? startFields : endFields;
  const defaultCalss = "flex items-center gap-8 flex-wrap";
  const className =
    position == "start"
      ? pt.startFieldsWrapper || defaultCalss
      : pt.endFieldsWrapper || defaultCalss;
  if (!fileds || !currentData.value) return;
  return h(
    "div",
    { class: className },
    ObjectEntries(fileds).flatMap(([key, config]) => {
      console.log("Asdasdasd", config);
      if (!config || !currentData.value) return [];
      const slotName = `${position}Field.${String(key)}` as const; // e.g., startField.userEmail
      if (typeof slots[slotName] == "function") {
        const slot = slots[slotName];
        return slot({
          data: currentData.value,
          value: currentData.value[key] as TRecord[string],
        }); // custom slot rendering
      }
      return h(
        DataField<TRecord, typeof key>,
        {
          key,
          ...(config.props || {}),
          data: currentData.value!, // assuming you have `data: TRecord`
          field: String(key),
        },
        config.slots,
      );
    }),
  );
};
const { t } = useI18n();
</script>
<template>
  <div
    class="loading"
    v-if="
      dataViewQueryResult.isLoading.value ||
      dataViewQueryResult.isFetching.value
    "
  >
    <h2>loading</h2>
  </div>
  <slot name="card" v-else-if="currentData" :data="currentData">
    <DataCard :data="currentData" v-bind="cardConfig">
      <template #header-start>
        <slot name="cardHeaderStart" :data="currentData"
          ><h2 v-if="title" class="text-3xl z-30 font-bold p-4 dataview-title">
            {{ t(title) }}
          </h2>
        </slot>
      </template>
      <template #header-end>
        <div class="mt-6 flex gap-4">
          <component :is="renderActions"></component>

          <AppBtn v-bind="deleteRestoreButtonProps" />
          <AppBtn
            v-if="isDeletedRef"
            :action="
              () =>
                deleteRestoreOpenDialog({
                  record: currentData,
                  callback: () => push(context.listRoute || '/'),
                  isHardDelete: true,
                })
            "
            variant="outlined"
            icon="delete-bin-2-line"
            label="hard_delete"
            severity="danger"
          />
        </div>
      </template>
      <template #header>
        <slot name="cardHeader" :data="currentData" />
      </template>
      <template #start>
        <slot name="cardStart" :data="currentData">
          <div class="mt-24 p-8">
            <div class="flex flex-wrap gap-4 items-center">
              <AppImage
                v-if="cardConfig?.imageKey && currentData[cardConfig.imageKey]"
                class="w-[8rem] h-[8rem] rounded-full overflow-hidden my-4"
                :src="currentData[cardConfig.imageKey]"
              />
              <div class="flex flex-col space-y-2">
                <h3 class="text-4xl font-bold mb-4" v-if="cardConfig?.titleKey">
                  {{ currentData[cardConfig.titleKey] }}
                </h3>
                <component :is="renderFileds('start')" />
              </div>
            </div>
          </div>
        </slot>
      </template>
      <template #end>
        <slot name="cardEnd" :data="currentData">
          <component :is="renderFileds('end')" />
        </slot>
      </template>
      <template #start-content>
        <slot name="cardStartContent" :data="currentData" />
      </template>
      <template #card-image>
        <slot name="cardImage" :data="currentData" />
      </template>
      <template #card-info>
        <slot name="cardInfo" :data="currentData" />
      </template>
      <template #subtitle>
        <slot name="cardSubtitle" :data="currentData" />
      </template>
      <template #footer>
        <slot name="cardFooter" :data="currentData" />
      </template>
      <template #footer-start>
        <slot name="cardFooterStart" :data="currentData" />
      </template>
      <template #footer-end>
        <slot name="cardFooterEnd" :data="currentData" />
      </template>
      <template #footer-middle>
        <slot name="cardFooterMiddle" :data="currentData" />
      </template>
      <template #badgeContent>
        <slot name="cardBadgeContent" :data="currentData" />
      </template>
      <template #createdAt>
        <slot name="cardCreatedAt" :data="currentData" />
      </template>
      <template #deletedAt>
        <slot name="cardDeletedAt" :data="currentData" />
      </template>
    </DataCard>
    <slot
      name="footer"
      :data="currentData"
      v-if="dataViewQueryResult.data.value"
      :response="dataViewQueryResult.data.value as TResp"
      :refetch="dataViewQueryResult.refetch"
    />
    <slot
      name="logs"
      :data="currentData"
      :response="dataViewQueryResult.data.value as TResp"
    >
      <div class="w-full glass rounded-lg p-4 mt-8" v-if="currentData.logs">
        <DataList
          class="w-full"
          :context="{
            datalistKey: `${viewKey}_logs`,
            records: currentData.logs,
            filters: [
              {
                matchMode: 'in',
                isGlobal: true,
                input: {
                  $formkit: 'devkitDropdown',
                  name: 'actionType',
                  label: 'Action Type',
                  outerClass: 'col-span-2',
                  fluid: true,
                  optionLabel: 'label',
                  placeholder: 'Select action types',
                  multiple: true,
                  options: [
                    { label: 'Create', value: 'create' },
                    { label: 'Update', value: 'update' },
                    { label: 'Delete', value: 'delete' },
                    { label: 'Delete Restore', value: 'restore' },
                  ],
                },
              },
              {
                matchMode: 'in',
                isGlobal: true,
                input: {
                  $formkit: 'devkitDropdown',
                  fluid: true,

                  outerClass: 'col-span-2',
                  name: 'statusCode',
                  label: 'Status Code',
                  placeholder: 'Select status codes',
                  multiple: true,
                  options: [
                    { label: 'OK', value: 'ok' },
                    { label: 'NOT_FOUND', value: 'not_found' },
                    { label: 'INVALID_ARGUMENT', value: 'invalid_argument' },
                    { label: 'INTERNAL', value: 'internal' },
                    { label: 'UNAUTHENTICATED', value: 'unauthenticated' },
                    { label: 'PERMISSION_DENIED', value: 'permission_denied' },
                  ],
                },
              },
            ],
            displayType: 'table',
            cardConfig: {
              createdAtKey: 'creaddAt',
              dateAdapter: DateStringDigitToDate,
            },
            options: {
              title: 'Logs',
              description: 'User activity logs',
            },
          }"
        />
      </div>
    </slot>
  </slot>
</template>
<style>
.dataview-title {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.dataview-title::before {
  content: "";
  width: 7px;
  background-color: var(--primary-color);
  height: 100%;
  display: inline-block;
  border-radius: 0.5rem;
}
</style>
