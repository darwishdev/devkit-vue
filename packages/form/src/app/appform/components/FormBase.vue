<script
  setup
  lang="ts"
  generic="
    TApi extends Record<string, Function>,
    TFormRequest extends StringUnknownRecord = StringUnknownRecord,
    TApiRequest extends StringUnknownRecord = StringUnknownRecord,
    TApiResponse extends StringUnknownRecord = StringUnknownRecord,
    TFindRequestPropName extends string = 'recordId',
    TFindResponsePropName extends string = 'request',
    TFindCallbakResponse = unknown,
    TCallbakResponse = unknown
  "
>
import { db } from "@/index";
import { type FormKitSchemaNode, type FormKitNode } from "@formkit/core";
import { h, inject, ref, resolveComponent } from "vue";
import { useToast } from "primevue";
import { useRoute, useRouter } from "vue-router";
import { AppBtn, makeGridWrapperClassName } from "@devkit/base-components";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useAppFormStoreWithProps } from "../store/AppFormStore";
import {
  ObjectKeys,
  resolveApiEndpoint,
  StringUnknownRecord,
} from "@devkit/apiclient";
import { AppFormProps, AppFormSection } from "@devkit/config";
import { useI18n } from "vue-i18n";
import { RouteQueryFind, RouteQueryRemove } from "@/pkg/utils/QueryUtils";

const dialogRef = inject<{ value: { close: () => void } }>("dialogRef");
const formkitSchemaComp = resolveComponent("FormKitSchema");
const queryClient = useQueryClient();
const formkitComp = resolveComponent("FormKit");
const apiClient = inject<TApi>("apiClient");
const toast = useToast();
const props =
  defineProps<
    AppFormProps<
      TApi,
      TFormRequest,
      TApiRequest,
      TApiResponse,
      TFindRequestPropName,
      TFindResponsePropName,
      TFindCallbakResponse,
      TCallbakResponse
    >
  >();
const {
  submitHandler,
  findHandler,
  syncWithUrl,
  usePresist,
  options,
  formKey,
  invalidateCaches,
} = props.context;
const formStore = useAppFormStoreWithProps(props);
const emit = defineEmits<{
  (e: "input", req: TFormRequest): void;
}>();
const { t } = useI18n();
const route = useRoute();
function isNumeric(str: unknown) {
  // Reject non-strings or purely whitespace
  if (typeof str !== "string" || !str.trim()) return false;

  // Convert and test
  return !Number.isNaN(Number(str));
}
const getDataFromFindHandler = async () => {
  if (!findHandler) return;
  if (!findHandler.endpoint) return;
  try {
    const findHandlerRequest: Record<string, unknown> = {};
    console.log("findis data", findHandler.requestPropertyName, route.params);
    const requestValue = findHandler.requestValue
      ? findHandler.requestValue
      : route.params[findHandler.routerParamName || "id"];

    console.log("findis data", requestValue);
    findHandlerRequest[findHandler.requestPropertyName || "recordId"] =
      isNumeric(requestValue) ? parseInt(requestValue as string) : requestValue;

    console.log("findis data", findHandlerRequest);
    const resp = await resolveApiEndpoint<
      TApi,
      Record<TFindRequestPropName, unknown>,
      Record<TFindResponsePropName, TFormRequest>
    >(findHandler.endpoint, apiClient, findHandlerRequest);
    if (!resp) return;
    if (findHandler.responsePropertyName) {
      if (findHandler.responsePropertyName in resp) {
        const formValue = resp[findHandler.responsePropertyName || "request"];
        if (typeof formValue == "object" && formValue) {
          return formValue;
        }
      }
    }
    return resp as TFormRequest;
  } catch (e) {
    console.error("find handler faild to fetch", e);
  }
};

const getInitialValue = (formValues: string) => {
  console.log("initial", formValues);
  if (!formKey || !formValues) return;
  try {
    return JSON.parse(formValues);
  } catch (e) {
    RouteQueryRemove(formKey);
    localStorage.removeItem(formKey);
    console.log("error parsing url", e);
  }
};
const getInitialValueFromLocalStorage = () => {
  if (!usePresist || !formKey) return undefined;
  const formValues = localStorage.getItem(formKey);
  if (!formValues) return {};
  return getInitialValue(formValues);
};
const getInitialValueFromUrl = () => {
  if (!syncWithUrl || !formKey) return undefined;
  const formValues = RouteQueryFind(formKey);

  if (!formValues) return {};
  return getInitialValue(formValues);
};

const getDefaultFormValue = () => {
  console.log("default fetcher");
  if (!syncWithUrl && !usePresist) {
    return;
  }

  const urlFormValues = getInitialValueFromUrl();
  if (urlFormValues) {
    if (ObjectKeys(urlFormValues).length > 0) {
      // formStore.formValueRef = urlFormValues
      return urlFormValues as TFormRequest;
    }
  }
  if (usePresist) {
    const localStorageFormValues = getInitialValueFromLocalStorage();
    if (localStorageFormValues) {
      if (ObjectKeys(localStorageFormValues).length > 0) {
        return localStorageFormValues as TFormRequest;
      }
    }
  }
};
const mutationFn = (req: TApiRequest) =>
  new Promise<TApiResponse>((resolve, reject) => {
    resolveApiEndpoint(submitHandler.endpoint, apiClient, req)
      .then((response) => {
        resolve(response);
      })
      .catch((error: Error) => {
        reject(error);
      });
  });

let defaultValue: TFormRequest | undefined = undefined;
const init = async () => {
  console.log("form init");
  if (findHandler) {
    const initialData = await getDataFromFindHandler();
    defaultValue = initialData;
    console.log("intial data is", initialData);
    return;
  }
  const defaultData = getDefaultFormValue();
  console.log("default data is", defaultData);

  defaultValue = defaultData;
};
await init();
const runAllUploadsBeforeSubmit = async (formNode: FormKitNode) => {
  const uploadTasks: Promise<unknown>[] = [];

  formNode.walk((child) => {
    console.log(child.context);
    const prepare = child.context?._uppyPrepareUpload;
    if (typeof prepare === "function") {
      uploadTasks.push(prepare());
    }
  });

  await Promise.all(uploadTasks);
};
const submitMutation = useMutation({
  mutationFn: mutationFn,
  onSuccess: () => {
    if (!isBulkCreateRef.value) {
      if (submitHandler.redirectRoute) {
        push(submitHandler.redirectRoute);
      }
    }
    if (invalidateCaches) {
      db.dropdownHelper.bulkDelete(invalidateCaches);
      queryClient.invalidateQueries({
        queryKey: props.context.invalidateCaches,
      });
    }
  },
});
const isAppFormSection = (
  input: unknown,
): input is AppFormSection<TFormRequest> => {
  return (
    typeof input !== "undefined" &&
    input != null &&
    typeof input === "object" &&
    "inputs" in input &&
    Array.isArray(input.inputs) &&
    !Array.isArray(input)
  );
};
const generateFormSchema = () => {
  const schema: FormKitSchemaNode[] = [];
  const { sections } = props.context;
  for (let sectionKey in sections) {
    const currentSection = sections[sectionKey];
    const isCurrentSectionObject = isAppFormSection(currentSection);
    // const defaultConfig: GridConfig = {
    //   columns: 1,
    //   gap: 2,
    //   smColumns: 2,
    //   mdColumns: 4,
    //   lgColumns: 6,
    // };
    // const gridConfig = !isCurrentSectionObject
    //   ? defaultConfig
    //   : (currentSection?.gridConfig ?? defaultConfig);
    //
    // const classList = [
    //   "form-section",
    //   "grid",
    //   `grid-cols-${gridConfig.columns}`,
    // ];
    // if (gridConfig.smColumns)
    //   classList.push(`sm:grid-cols-${gridConfig.smColumns}`);
    // if (gridConfig.mdColumns)
    //   classList.push(`md:grid-cols-${gridConfig.mdColumns}`);
    // if (gridConfig.lgColumns)
    //   classList.push(`lg:grid-cols-${gridConfig.lgColumns}`);
    // if (gridConfig.xlColumns)
    //   classList.push(`xl:grid-cols-${gridConfig.xlColumns}`);
    // if (isCurrentSectionObject)
    //   classList.push(currentSection.wrapperClassName ?? "");
    // classList.push(`gap-${gridConfig.gap || 2}`);
    // const className = classList.join(" ");
    const className = makeGridWrapperClassName(currentSection?.gridConfig);
    if (!isCurrentSectionObject) {
      const sectionToBePushed: FormKitSchemaNode = {
        $el: "div",
        attrs: {
          class: `form-section ${className}`,
        },
        children: currentSection,
      };
      schema.push(sectionToBePushed);
      continue;
    }

    const sectionNodes: FormKitSchemaNode[] = [
      {
        $el: "div",
        attrs: {
          class: className,
        },
        children: currentSection.inputs,
      },
    ];
    if (currentSection.title)
      sectionNodes.unshift({
        $el: "div",
        attrs: {
          class: "section-title mb-4 font-bold",
        },
        children: currentSection.title,
      });
    const sectionToBePushed: FormKitSchemaNode = {
      $el: "div",
      children: sectionNodes,
    };
    schema.push(sectionToBePushed);
  }
  return schema;
};
const isBulkCreateRef = ref(false);
const { push } = useRouter();

// function parseValidationError(errorMessage: string) {
//   const errorObject: Record<string, string> = {};
//
//   // Match errors in the format: "- input_name: error message"
//   const regex = /-\s(\w+):\s(.+?)\s\[/g;
//   let match;
//
//   while ((match = regex.exec(errorMessage)) !== null) {
//     const [, inputName, errorValue] = match;
//     errorObject[inputName] = errorValue;
//   }
//
//   return errorObject;
// }
const handleError = (node: FormKitNode, error: unknown) => {
  try {
    if (error && typeof error == "object") {
      console.log("ety", error, ObjectKeys(error));
      ObjectKeys(error).forEach((e) => console.log(e, error[e]));
      let globalErrors: string[] = [];
      let fieldErrors: Record<string, string> = {};
      if ("globalErrors" in error) {
        if (Array.isArray(error.globalErrors)) {
          globalErrors = error.globalErrors as string[];
        }
      }

      if ("fieldErrors" in error) {
        console.log("ety", error.fieldErrors);
        if (typeof error.fieldErrors == "object") {
          fieldErrors = error.fieldErrors as Record<string, string>;
        }
      }

      node.setErrors(globalErrors, fieldErrors);
    }
  } catch (_: unknown) {
    node.setErrors([error as string]);
  }
};

const formSubmitHandler = async (req: TFormRequest, formNode: FormKitNode) => {
  if (props.context.syncWithUrl) {
    formStore.debouncedRouteQueryAppend(req);
  }

  await runAllUploadsBeforeSubmit(formNode);
  const handler = props.context.submitHandler;

  const apiRequest = handler.mapFunction
    ? handler.mapFunction(req)
    : (req as StringUnknownRecord);

  return new Promise((resolve) => {
    submitMutation
      .mutateAsync(apiRequest as TApiRequest)
      .then((response: TApiResponse) => {
        const defaultSummary = "api_success_summary";
        const defaultContent = "api_success_detail";
        if (props.context.resetOnSuccess) formNode.reset();

        if (options) {
          if (!options.isSuccessNotificationHidden) {
            const summary = options.successMessageSummary ?? defaultSummary;
            const detail = options.successMessageDetail ?? defaultContent;
            toast.add({
              severity: "success",
              summary: t(summary),
              detail: t(detail),
              life: 3000,
            });
          }
        }
        if (submitHandler.callback) {
          submitHandler.callback(response);
        }
        if (dialogRef) {
          dialogRef.value.close();
        }
        resolve(null);
      })
      .catch((e: unknown) => {
        console.log("error from the sbmithandler", e);
        handleError(formNode, e);
        resolve(null);
      });
    return;
  });
};
const renderAppForm = () => {
  return h(
    formkitComp,
    {
      type: "form",
      id: props.context.formKey,
      name: formKey,
      onInput: (req: TFormRequest) => {
        if (props.context.syncWithUrl) {
          formStore.debouncedRouteQueryAppend(req);
        }
        if (props.context.invalidateCachesOnChage) {
          queryClient.invalidateQueries({
            queryKey: props.context.invalidateCachesOnChage,
          });
        }
        emit("input", req);
        console.log("form updated");
      },
      value: defaultValue,
      actions: false,
      findHandler: props.context.findHandler,
      syncWithUrl: props.context.syncWithUrl,
      usePresist: props.context.usePresist,
      onSubmit: formSubmitHandler,
    },
    {
      default: () => [
        h(formkitSchemaComp, {
          id: props.context.formKey,
          data: formStore.formData,
          schema: {
            $el: "div",
            attrs: {
              class: "schema-wrapper",
            },
            children: generateFormSchema(),
          },
        }),
        h(
          "div",
          { class: "custom-form-actions flex gap-2" },
          props.context.submitHandler.hideActions
            ? undefined
            : [
                h(AppBtn, {
                  type: "submit",
                  class: "grow",
                  label: t("submit"),
                  severity: "success",
                  icon: "check-line",
                }),
                props.context.useClear
                  ? h(AppBtn, {
                      action: formStore.clearForm,
                      icon: "delete-back-2-line",
                      severity: "danger",
                      variant: "outlined",
                      label: t("clear"),
                    })
                  : undefined,
                props.context.useReset
                  ? h(AppBtn, {
                      action: formStore.resetForm,
                      variant: "outlined",
                      severity: "help",
                      label: t("reset"),
                      icon: "arrow-go-back-line",
                    })
                  : undefined,
                props.context.usePresist
                  ? h(AppBtn, {
                      action: formStore.presistForm,
                      label: "presist",
                    })
                  : undefined,
              ],
        ),
      ],
    },
  );
};
</script>
<template>
  <component :is="renderAppForm()" />
</template>
<style>
.custom-form-actions {
  display: flex;
  gap: var(--gap);

  button:first-child {
    flex: 1;
  }
}
</style>
