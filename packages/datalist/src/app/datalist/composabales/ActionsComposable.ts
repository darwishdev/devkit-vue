import { ref, computed, h, inject, type Ref, type ComputedRef } from "vue";
import { useRouter, type RouteParamsRaw } from "vue-router";
import { useToast } from "primevue";
import { useDialog } from "primevue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { resolveApiEndpoint, StringUnknownRecord } from "@devkit/apiclient";
import { objectEntries } from "@vueuse/core";
import { AppBtn, AppDialog } from "@devkit/base-components";
import { AppForm } from "@devkit/form";
import {
  ActionButtonProps,
  ApiOptions,
  AppFormSections,
  AvailableActions,
  DataRouter,
  DeleteRestoreVariant,
  FindHandler,
} from "@devkit/config";

/* ------------------------------------------------------------------ */
/* Composable                                                          */
/* ------------------------------------------------------------------ */
export function useActions<
  TApi extends Record<string, Function>,
  TReq extends StringUnknownRecord,
  TRecord extends StringUnknownRecord,
  TApiResponse extends StringUnknownRecord | undefined = undefined,
  TFormSectionsRequest extends StringUnknownRecord | undefined = undefined,
>({
  options,
  rowIdentifier,
  isExportable,
  title,
  viewRouter,
  modelSelectionRef = ref([]),
  isDeletedRef = ref(false),
  formSections,
  dataKeys,
}: {
  options: ComputedRef<ApiOptions>;
  rowIdentifier?: keyof TRecord;
  isDeletedRef?: Ref<boolean>;
  modelSelectionRef?: Ref<TRecord[]>;
  isExportable?: boolean;
  title: string;
  viewRouter?: DataRouter<TRecord>;
  formSections?: AppFormSections<
    TFormSectionsRequest extends undefined
      ? StringUnknownRecord
      : TFormSectionsRequest
  >;
  dataKeys: string[];
}) {
  /* ---------- shared refs / utils ---------------------------------- */
  const apiClient = inject<TApi>("apiClient");
  const router = useRouter();
  const toast = useToast();
  const dialog = useDialog();
  const queryClient = useQueryClient();
  const deleteRestoreVariants = computed(() => {
    const initialVariant: DeleteRestoreVariant = {
      hasSelectedData: modelSelectionRef.value.length > 0,
      hasDeletedRecords: false,
      variant: "outlined",
      disabled: false,
      icon: isDeletedRef.value ? "arrow-go-back-line" : "delete-bin-2-line",
      label: isDeletedRef.value ? "restore" : "delete",
      empty: isDeletedRef.value ? "empty_records_deleted" : "empty_records",
      severity: isDeletedRef.value ? "success" : "danger",
    };
    return initialVariant;
  });
  /* ------------------------------------------------------------------
   * MUTATIONS
   * ---------------------------------------------------------------- */
  const deleteRestoreMutationFn = async ({
    record,
    isHardDelete,
  }: {
    record?: TRecord;
    isHardDelete?: boolean;
  }) => {
    if (!options || !rowIdentifier) return;

    const handler = isHardDelete
      ? options.value.deleteHandler
      : options.value.deleteRestoreHandler;
    if (!handler) return;

    const payload: StringUnknownRecord = {};
    console.log("Recrdo if from ", record);
    payload[handler.requestProperty] = record
      ? [record[rowIdentifier]]
      : modelSelectionRef.value.map((row) => row[rowIdentifier as string]);

    await resolveApiEndpoint(handler.endpoint, apiClient, payload);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteRestoreMutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dataKeys }),
  });

  const deleteRestoreOpenDialog = (params?: {
    record?: TRecord;
    callback?: () => void;
    isHardDelete?: boolean;
  }) => {
    console.log("hadrdddd", params?.record);
    dialog.open(
      h(
        AppDialog,
        {
          onConfirmed: ({ close }) => {
            deleteMutation.mutateAsync(params || {}).finally(() => {
              close();
              modelSelectionRef.value = [];
              toast.add({ detail: "deleted_succesfully", severity: "success" });
              if (params?.callback) {
                params.callback();
              }
            });
          },
        },
        { default: () => h("div", [h("h2", "Are you sure?")]) },
      ),
    );
  };

  const createUpdateRecord = (
    emitFn: (resp: StringUnknownRecord) => void,
    record?: TRecord,
  ) => {
    if (!options.value || !rowIdentifier) return;

    const variant = record ? "update" : "create";
    const handler = record
      ? options.value.updateHandler
      : options.value.createHandler;
    if (!handler) return;

    /* No custom form sections – route to edit page */
    if (!formSections) {
      const params: RouteParamsRaw = record
        ? { id: String(record[rowIdentifier]) }
        : {};
      router.push({ name: handler.routeName, params });
      return;
    }

    /* Using AppForm in a dialog */
    let findHandler:
      | FindHandler<
          TApi,
          TFormSectionsRequest extends undefined
            ? StringUnknownRecord
            : TFormSectionsRequest,
          string,
          string
        >
      | undefined;

    if (record && options.value.updateHandler) {
      const u = options.value.updateHandler;
      findHandler = {
        endpoint: u.findEndpoint,
        requestPropertyName: u.findRequestProperty,
        responsePropertyName: u.findResponseProperty,
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
            title: `${title}_${variant}`,
            sections: formSections,
            invalidateCaches: dataKeys,
            formKey: `${title}_${variant}`,
            findHandler,
            resetOnSuccess: true,
            submitHandler: {
              endpoint: handler.endpoint,
              callback: emitFn,
            },
          },
        },
      ),
    );
  };

  const viewRecord = (emitFn: (r: TRecord) => void, record: TRecord) => {
    if (!viewRouter || !rowIdentifier) return;
    if (!(viewRouter.paramColumnName in record)) return;
    try {
      const params: RouteParamsRaw = {
        [viewRouter.paramName]: record[viewRouter.paramColumnName] as string,
      };
      router.push({ name: viewRouter.name, params });
      emitFn(record);
    } catch (e) {
      toast.add({
        severity: "error",
        summary: "Navigation error",
        detail: String(e),
        life: 3000,
      });
    }
  };

  const exportData = () => {
    /* your custom export logic here */
    console.log("export");
  };
  const permittedActions = computed(() => {
    const availableActions: ActionButtonProps<AvailableActions>[] = [];
    const actionsMap = {
      view: {
        hidden: !viewRouter,
        icon: "eye-line",
        severity: "info" as const,
        fn: (e: (r: TRecord) => void, r: TRecord) => viewRecord(e, r),
      },
      update: {
        hidden: !options.value.updateHandler,
        icon: "edit-circle-line",
        severity: "help" as const,
        fn: (e: (r: StringUnknownRecord) => void, r: TRecord) =>
          createUpdateRecord(e, r),
      },
      create: {
        hidden: !options.value.createHandler,
        icon: "add-circle-line",
        severity: "success" as const,
        fn: (e: (r: StringUnknownRecord) => void) => createUpdateRecord(e),
      },
      export: {
        hidden: !isExportable,
        icon: "upload-cloud-line",
        severity: "contrast" as const,
        fn: exportData,
      },
    } as const;

    for (const [k, v] of objectEntries(actionsMap)) {
      if (!v.hidden) {
        availableActions.push({
          actionKey: k,
          label: k,
          icon: v.icon,
          severity: v.severity,
          actionFn: v.fn,
        });
      }
    }

    return availableActions;
  });

  /* ------------------------------------------------------------------ */
  /* expose                                                             */
  /* ------------------------------------------------------------------ */
  return {
    /* list */
    /* actions data */
    permittedActions,
    /* mutations & helpers */
    createUpdateRecord,
    deleteRestoreOpenDialog,
    deleteRestoreMutationFn,
    deleteMutation,
    deleteRestoreVariants,
    viewRecord,
    exportData,
  };
}
