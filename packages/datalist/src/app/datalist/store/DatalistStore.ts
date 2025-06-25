import { ref, computed, h, inject, type Ref, watch, Suspense } from "vue";
import { defineStore, getActivePinia } from "pinia";
import {
  ActionButtonProps,
  ApiListOptions,
  ApiResponseList,
  DatalistColumnsBase,
  DatalistFilter,
  DatalistFilterInput,
  DatalistFiltersModel,
  DatalistGlobalActions,
  DatalistProps,
  DatalistRowActions,
  FilterMatchModeValues,
  PaginationParams,
} from "../types";
import { FormKitSchemaNode } from "@formkit/core";
import {
  ObjectKeys,
  resolveApiEndpoint,
  StringUnknownRecord,
} from "@devkit/apiclient";
import { _constructColumns } from "../utilites/_columnUtils";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/vue-query";
import { objectEntries, useDebounceFn } from "@vueuse/core";
import { AppDialog } from "@devkit/base-components";
import { useRouter } from "vue-router";
import { useDialog, useToast } from "primevue";
import { AppForm } from "@devkit/form";
import { AppFormProps, FindHandler } from "@devkit/config";
import { DeleteRestoreVariant } from "../types";
import { useFormKitNodeById } from "@formkit/vue";

export const useDatalistStore = <
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
>({
  context,
}: DatalistProps<
  TApi,
  TReq,
  TRecord,
  TFiltersReq,
  TApiResponse,
  TFormSectionsRequest
>) =>
  defineStore(`datalist-${context.datalistKey}` as string, () => {
    const filtersFormSchema: FormKitSchemaNode[] = [];
    const filtersMatchModesMap: Map<string, FilterMatchModeValues> = new Map();
    const isShowDeletedRef = ref(false);
    const modelSelectionRef = ref<TRecord[]>(
      context.initiallySelectedItems || [],
    );
    const contextOptions: ApiListOptions = {
      title: context.datalistKey,
      ...context.options,
    };
    let initialCallbackFinished = false;
    const toast = useToast();
    const filtersFormValueRef = ref({});
    const dialogRef = inject("dialogRef");
    const apiClient = inject<TApi>("apiClient");
    const debounceInMilliseconds = context.debounceInMilliseconds || 1000;
    const paginationParamsRef = ref<PaginationParams>();
    const dialog = useDialog();
    const globalFilters: string[] = [];
    const queryClient = useQueryClient();
    const datatableColumnsRef: Ref<DatalistColumnsBase<TRecord, TFiltersReq>> =
      ref(context.columns || {});
    const errorRef = ref("");
    const filtersFormKey = `${context.datalistKey}-filter-form`;
    const { datalistKey, rowIdentifier, isServerSide } = context;
    const filtersValueFromReq = (req: StringUnknownRecord) => {
      const datalistFiltersModel: DatalistFiltersModel = {};
      if (context.isServerSide) return datalistFiltersModel;
      let globalValue = "";
      for (const [filterName, filterValue] of Object.entries(req)) {
        if (filterName == "global") {
          globalValue = filterValue as string;
          datalistFiltersModel[filterName] = {
            value: filterValue || null,
            matchMode: "contains",
          };
          continue;
        }
        datalistFiltersModel[filterName] = {
          value: filterValue || null,
          matchMode: filtersMatchModesMap.get(filterName),
        };
      }

      return datalistFiltersModel;
    };
    const filtersFormProps: AppFormProps<
      TApi,
      Record<string, unknown>,
      Record<string, unknown>
    > = {
      context: {
        title: filtersFormKey,
        syncWithUrl: true,
        usePresist: context.isPresistFilters,
        useClear: true,
        invalidateCachesOnChage: isServerSide ? [datalistKey] : undefined,
        invalidateCaches: isServerSide ? [datalistKey] : undefined,
        useReset: true,
        isLazy: context.isLazyFilters,
        formKey: filtersFormKey,
        sections: {},
        submitHandler: {
          hideActions: !context.isLazyFilters,
          endpoint: async (req: StringUnknownRecord) => {
            filtersFormValueRef.value = filtersValueFromReq(req);
            return req;
          },
        },
        options: {
          isBulkCreateHidden: true,
          isHeaderSubmitHidden: true,
          isSuccessNotificationHidden: true,
          isFormTransparent: true,
        },
      },
    };
    const optionsInUse = computed(
      () => datalistQueryResult.data.value?.options || contextOptions,
    );
    const permittedActions = computed(() => {
      const rowActions: ActionButtonProps<DatalistRowActions>[] = [];
      const globalActions: ActionButtonProps<DatalistGlobalActions>[] = [];
      const rowActionsMap = {
        view: {
          hidden: !context.viewRouter,
          icon: "eye-line",
          severity: "info" as const,
          fn: (record: TRecord) => viewRecord(record),
        },
        update: {
          hidden: !optionsInUse.value.updateHandler,
          severity: "help" as const,
          icon: "edit-circle-line",
          fn: (
            emitFn: (response: StringUnknownRecord) => void,
            record: TRecord,
          ) => createUpdateRecord(emitFn, record),
        },
      };
      const globalActionsMap = {
        create: {
          hidden: !optionsInUse.value.createHandler,
          severity: "success" as const,
          icon: "add-circle-line",
          fn: (emitFn: (response: StringUnknownRecord) => void) =>
            createUpdateRecord(emitFn),
        },
        export: {
          hidden: !context.isExportable,
          severity: "contrast" as const,
          icon: "upload-cloud-line",
          fn: (record: TRecord) => viewRecord(record),
        },
      };
      for (const [k, v] of objectEntries(rowActionsMap)) {
        if (!v.hidden) {
          rowActions.push({
            actionKey: k,
            label: k,
            icon: v.icon,
            severity: v.severity,
            actionFn: v.fn,
          });
        }
      }
      for (const [k, v] of objectEntries(globalActionsMap)) {
        if (!v.hidden) {
          globalActions.push({
            actionKey: k,
            label: k,
            severity: v.severity,
            icon: v.icon,
            actionFn: v.fn,
          });
        }
      }
      return { rowActions, globalActions };
    });

    const debouncedRefetch = useDebounceFn(() => {
      datalistQueryResult.refetch();
    }, debounceInMilliseconds);

    const generateFilters = async () => {
      if (filtersFormSchema.length > 0) return;
      const { filters, columns } = context;
      let allFiltersCombined: (
        | DatalistFilterInput<TFiltersReq>
        | DatalistFilter<TFiltersReq>
      )[] = [...(filters || [])];
      if (columns) {
        for (const [columnKey, columnValue] of objectEntries(columns)) {
          if (!columnValue) continue;
          if (columnKey == "deletedAt" && !isShowDeletedRef.value) continue;
          if (columnValue.isGlobalFilter) {
            globalFilters.push(columnKey as string);
          }
          datatableColumnsRef.value[columnKey] = columnValue;
          const columnFilters = columnValue.filters;
          if (columnFilters) {
            allFiltersCombined = [...allFiltersCombined, ...columnFilters];
          }
        }
      }
      allFiltersCombined.forEach(
        (
          filter:
            | DatalistFilterInput<TFiltersReq>
            | DatalistFilter<TFiltersReq>,
        ) => {
          const inputField = "input" in filter ? filter.input : filter;
          console.log("filters is", filter);
          if ("isGlobal" in filter) {
            if (filter.isGlobal) {
              globalFilters.push(inputField.name);
            }
          }
          if ("matchMode" in filter)
            filtersMatchModesMap.set(inputField.name, filter.matchMode);
          filtersFormSchema.push(inputField);
        },
      );

      if (globalFilters.length)
        filtersFormSchema.push({ $formkit: "hidden", name: "global" });
    };

    const formElementNode = useFormKitNodeById(filtersFormKey);
    const filterFormValue = computed(() => {
      const activeInputs: StringUnknownRecord = {};
      if (!formElementNode) return activeInputs;
      if (!formElementNode.value) return activeInputs;
      if (!formElementNode.value._value) return activeInputs;
      return formElementNode.value._value as StringUnknownRecord;
    });

    const datalistFilterFormValue = computed(() => {
      const datalistFiltersModel: DatalistFiltersModel = {};
      if (context.isServerSide || !filterFormValue.value)
        return datalistFiltersModel;
      let globalValue = "";
      for (const [filterName, filterValue] of Object.entries(
        filterFormValue.value,
      )) {
        if (filterName == "global") {
          globalValue = filterValue as string;
          datalistFiltersModel[filterName] = {
            value: filterValue || null,
            matchMode: "contains",
          };
          continue;
        }
        datalistFiltersModel[filterName] = {
          value: filterValue || null,
          matchMode: filtersMatchModesMap.get(filterName),
        };
      }
      return datalistFiltersModel;
    });
    //
    function isApiResponseList<TRecord extends StringUnknownRecord>(
      response: object,
    ): response is ApiResponseList<TRecord> {
      return (
        "records" in response && response && Array.isArray(response.records)
      );
    }
    const datalistQueryFn = async (): Promise<ApiResponseList<TRecord>> => {
      const { records, responseMapper, isServerSide, requestMapper } = context;
      if (Array.isArray(records)) {
        return { records };
      }
      const requestPayload = {
        //filters: {},
        filters: filterFormValue.value,
        paginationParams: paginationParamsRef.value,
      };
      let request: TFiltersReq extends undefined ? TReq : TFiltersReq;
      try {
        const requestBody = requestMapper
          ? requestMapper(requestPayload)
          : isServerSide
            ? requestPayload
            : filterFormValue.value;
        request = requestBody as TFiltersReq extends undefined
          ? TReq
          : TFiltersReq;
        const apiResponse = await resolveApiEndpoint<
          TApi,
          typeof request,
          TApiResponse extends undefined
            ? ApiResponseList<TRecord>
            : TApiResponse
        >(records, apiClient, request);
        console.log("api response is", apiResponse);
        const newResponse = responseMapper
          ? responseMapper(apiResponse)
          : apiResponse;
        if (!isApiResponseList<TRecord>(newResponse)) {
          throw new Error(
            "invalid response type. pass a response mapper or return object with key records as response",
          );
        }
        return newResponse;
      } catch (e) {
        console.log("error on fetching data", e);
        if (e instanceof Error) {
          errorRef.value = e.message;
          toast.add({
            severity: "error",
            summary: "failed",
            detail: e.message,
            life: 3000,
          });
        }
        throw e;
      }
      // resolveApiEndpoint(records, apiClient, request)
    };
    const deleteRestoreVariants = computed(() => {
      const initialVariant: DeleteRestoreVariant = {
        hasSelectedData: modelSelectionRef.value.length > 0,
        hasDeletedRecords: false,
        variant: "outlined",
        disabled: false,
        icon: isShowDeletedRef.value
          ? "arrow-go-back-line"
          : "delete-bin-2-line",
        label: isShowDeletedRef.value ? "restore" : "delete",
        empty: isShowDeletedRef.value
          ? "empty_records_deleted"
          : "empty_records",
        severity: isShowDeletedRef.value ? "success" : "danger",
      };
      if (!datalistQueryResult.data.value) return initialVariant;
      if (datalistQueryResult.data.value.deletedRecords) {
        initialVariant.hasDeletedRecords =
          datalistQueryResult.data.value.deletedRecords.length > 0;
      }
      return initialVariant;
    });
    const { push } = useRouter();
    const deleteRestoreOpenDialog = (params?: {
      record?: TRecord;
      isHardDelete?: boolean;
    }) => {
      dialog.open(
        h(
          AppDialog,
          {
            onConfirmed: ({ close }) => {
              deleteMutation.mutateAsync(params || {}).finally(() => {
                close();
                modelSelectionRef.value = [];
              });
            },
          },
          {
            default: () => h("div", [h("h2", "are you sure?")]),
          },
        ),
      );
    };
    const createUpdateRecord = (
      emitFn: (response: StringUnknownRecord) => void,
      record?: TRecord,
    ) => {
      const options: ApiListOptions | undefined =
        datalistQueryResult.data.value?.options || context.options;
      if (!options || !rowIdentifier) return;
      const variant = record ? "update" : "create";
      const handler = record ? options.updateHandler : options.createHandler;
      if (!handler) return;
      const { formSections, datalistKey } = context;
      if (!formSections) {
        push({ name: handler.routeName });
        return;
      }
      //type FormReq = TFormSectionsRequest extends undefined
      //  ? StringUnknownRecord
      //  : TFormSectionsRequest;
      let findHandler: FindHandler<
        TApi,
        TFormSectionsRequest extends undefined
          ? StringUnknownRecord
          : TFormSectionsRequest,
        string,
        string
      >;
      if (record && options.updateHandler) {
        const updateHandler = options.updateHandler;
        findHandler = {
          endpoint: updateHandler.findEndpoint,
          requestPropertyName: updateHandler.findRequestProperty,
          responsePropertyName: updateHandler.findResponseProperty,
          requestValue: record[rowIdentifier],
        };
      }
      dialog.open(
        h(
          AppForm<
            TApi,
            TFormSectionsRequest extends undefined
              ? StringUnknownRecord
              : TFormSectionsRequest,
            StringUnknownRecord,
            StringUnknownRecord,
            string,
            string
          >,
          {
            context: {
              title: `${datalistKey}_${variant}`,
              sections: formSections,
              invalidateCaches: [datalistKey],
              formKey: `${datalistKey}_${variant}`,
              findHandler: findHandler!,
              resetOnSuccess: true,
              submitHandler: {
                endpoint: handler.endpoint,
                callback: (response) => {
                  emitFn(response);
                },
              },
            },
          },
        ),
      );
    };
    const viewRecord = (record: TRecord) => {
      const { viewRouter, rowIdentifier } = context;
      if (!viewRouter || !rowIdentifier || typeof record != "object") return;
      if (!(viewRouter.paramColumnName in record)) return;
      try {
        const params: Record<string, string> = {};
        if (viewRouter.paramColumnName in record)
          params[viewRouter.paramName] = record[
            viewRouter.paramColumnName
          ] as string;
        push({ name: viewRouter.name, params });
      } catch (e: unknown) {
        toast.add({
          severity: "error",
          summary: "error routing to view route",
          detail: e,
          life: 3000,
        });
        console.error("error routing to view route", e);
      }
      console.log("view record", record);
    };
    const deleteRestoreMutationFn = async ({
      record,
      isHardDelete,
    }: {
      record?: TRecord;
      isHardDelete?: boolean;
    }) => {
      const options: ApiListOptions | undefined =
        datalistQueryResult.data.value?.options || context.options;
      const { rowIdentifier } = context;
      if (!options || !rowIdentifier) return;
      const handler = isHardDelete
        ? options.deleteHandler
        : options.deleteRestoreHandler;
      if (!handler) return;
      const deleteRestoreRequest: StringUnknownRecord = {};
      deleteRestoreRequest[handler.requestProperty] = record
        ? [record[rowIdentifier]]
        : modelSelectionRef.value.map((row) => row[rowIdentifier as string]);

      console.log("recordis", deleteRestoreRequest);
      try {
        await resolveApiEndpoint(
          handler.endpoint,
          apiClient,
          deleteRestoreRequest,
        );
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "failed",
          detail: e,
          life: 3000,
        });
        console.error("delete restore failed", e);
      }
    };
    const deleteMutation = useMutation({
      mutationFn: deleteRestoreMutationFn,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [context.datalistKey] });
      },
    });

    const currenData = computed(() => {
      if (!datalistQueryResult.data.value) return [];
      if (!isFiltersFormValid.value) return [];
      const { records, deletedRecords = [] } = datalistQueryResult.data.value;
      if (isShowDeletedRef.value)
        return context.isServerSide ? records : deletedRecords;
      return records;
    });
    const isFiltersFormValid = computed(() => {
      console.log(
        "valid is here",
        formElementNode.value?.context?.state?.valid,
      );
      console.log(
        "valid is here",
        formElementNode.value?.context?.value?.state?.valid,
      );
      return filtersFormSchema.length > 0
        ? formElementNode.value?.context?.state?.valid || false
        : false;
    });
    const filtersFormCtx = computed(() => {
      return formElementNode.value?.context || null;
    });

    const datalistQueryResult = useQuery<ApiResponseList<TRecord>, Error>({
      queryKey: [context.datalistKey],
      queryFn: () =>
        datalistQueryFn().then(async (response) => {
          if (initialCallbackFinished) return response;
          const { records } = response;
          if (
            records.length > 0 &&
            context.displayType == "table" &&
            ObjectKeys(datatableColumnsRef.value).length == 0
          ) {
            const datalistColumns = _constructColumns(
              records[0],
              context.execludedColumns,
            );
            datatableColumnsRef.value = datalistColumns;
          }
          initialCallbackFinished = true;
          return response;
        }),
      enabled: isFiltersFormValid,
      placeholderData: keepPreviousData,
    });
    const init = async () => {
      await Promise.all([generateFilters()]);
    };
    return {
      //state
      filtersFormSchema,
      datatableColumnsRef,
      filtersValueFromReq,
      filterFormValue,
      datalistFilterFormValue,
      currenData,
      globalFilters,
      datalistQueryResult,
      filtersFormProps,
      deleteRestoreOpenDialog,
      modelSelectionRef,
      formElementNode,
      isFiltersFormValid,
      viewRecord,
      //filtersFormStore,
      createUpdateRecord,
      isShowDeletedRef,
      debouncedRefetch,
      permittedActions,
      filtersFormValueRef,
      optionsInUse,
      filtersFormCtx,
      deleteRestoreVariants,
      filtersFormKey,
      dialogRef,
      // actions
      init,
    };
  });

export const useDatalistStoreWithProps = <
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
>(
  props: DatalistProps<
    TApi,
    TReq,
    TRecord,
    TFiltersReq,
    TApiResponse,
    TFormSectionsRequest
  >,
) =>
  useDatalistStore<
    TApi,
    TReq,
    TRecord,
    TFiltersReq,
    TApiResponse,
    TFormSectionsRequest
  >(props)();

export const useDatalistStoreWithKey = <
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TFiltersReq extends StringUnknownRecord | undefined = undefined,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
>(
  datalistKey: string,
) => {
  const pinia = getActivePinia();
  if (!pinia) throw new Error("Pinia not installed");
  const isStoreDefined = `datalist-${datalistKey}` in pinia.state.value;
  if (!isStoreDefined) throw new Error("store is not defined");
  return useDatalistStoreWithProps<
    TApi,
    TReq,
    TRecord,
    TFiltersReq,
    TApiResponse,
    TFormSectionsRequest
  >({ context: { datalistKey, records: [] } });
};
