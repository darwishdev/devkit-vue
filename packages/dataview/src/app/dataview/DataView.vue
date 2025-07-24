<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TRequest extends StringUnknownRecord,
    TRecord extends StringUnknownRecord,
    TFormSectionsRequest extends StringUnknownRecord | undefined = undefined
  "
>
import { computed, h, inject, ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import {
  ApiResponseFind,
  type DataViewEmits,
  type DataViewProps,
  type DataViewSlots,
} from "./types";
import {
  resolveApiEndpoint,
  type StringUnknownRecord,
} from "@devkitvue/apiclient";
import { useActions } from "@devkitvue/datalist";
import { AppBtn } from "@devkitvue/base-components";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue";
const emit = defineEmits<DataViewEmits>();
const { context } =
  defineProps<DataViewProps<TApi, TRequest, TRecord, TFormSectionsRequest>>();
const slots = defineSlots<DataViewSlots<TRecord>>();
const isDeletedRef = ref(false);
const route = useRoute();
const toast = useToast();
const apiClient = inject<TApi>("apiClient");
const {
  requestValue,
  viewKey,
  routerParamName = "id",
  record,
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
const datalistQueryResult = useQuery<ApiResponseFind<TRecord>, Error>({
  queryKey: [viewKey, computedRequestValue],
  queryFn: () =>
    queryFn().then(async (response) => {
      return response;
    }),
  enabled: true,
});
const optionsInUse = computed(
  () =>
    datalistQueryResult.data.value?.options ||
    context.options || { title: context.viewKey },
);
const currentData = computed(() => {
  return datalistQueryResult.data.value?.record || undefined;
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
</script>
<template>
  <slot name="card" v-if="currentData" :data="currentData">
    <section
      class="mx-auto max-w-4xl overflow-hidden rounded-lg bg-gradient-to-b from-[#121624] to-[#0d0f1a] shadow-lg"
    >
      <div
        class="h-32 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-600"
      ></div>
      <div class="relative px-8 pb-10 pt-4 md:px-12">
        <!-- profile picture -->
        <div
          class="absolute -top-14 h-28 w-28 rounded-full border-4 border-white object-cover"
        >
          <slot name="cardImage" :data="currentData" />
        </div>

        <!-- basic info -->
        <div class="mt-16 flex flex-col gap-1 text-white">
          <h2 class="text-2xl font-semibold">
            <slot name="cardTitle" :data="currentData">
              {{ context.headerKey ? currentData[context.headerKey] : "" }}
            </slot>
          </h2>
          <p class="text-sm text-gray-300">
            <slot name="cardInfo" :data="currentData"> </slot>
          </p>
        </div>
        <!-- actions -->
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
      </div>
    </section>
  </slot>
</template>
