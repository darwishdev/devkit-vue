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
import { AppBtn } from "@devkit/base-components";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useAppFormStoreWithProps } from "../store/AppFormStore";
import {
  ObjectKeys,
  resolveApiEndpoint,
  StringUnknownRecord,
} from "@devkit/apiclient";
import { AppFormProps } from "@/pkg/types/types";
import { AppFormSection } from "@/pkg/types/types";
import { useI18n } from "vue-i18n";
import { RouteQueryFind, RouteQueryRemove } from "@/pkg/utils/QueryUtils";

const dialogRef = inject("dialogRef") as any;
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
const getDataFromFindHandler = async () => {
  if (!findHandler) return;
  if (!findHandler.endpoint) return;
  try {
    const findHandlerRequest: any = {};
    const requestValue = findHandler.requestValue
      ? findHandler.requestValue
      : route.params[findHandler.routerParamName || "id"];
    findHandlerRequest[findHandler.requestPropertyName] = requestValue;
    const resp = await resolveApiEndpoint<any, any, any>(
      findHandler.endpoint,
      apiClient,
      findHandlerRequest,
    );
    if (!resp) return;
    if (findHandler.responsePropertyName) {
      if (findHandler.responsePropertyName in resp) {
        const formValue = resp[findHandler.responsePropertyName];
        if (typeof formValue == "object" && formValue) {
          return formValue as TFormRequest;
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
  input: any,
): input is AppFormSection<TFormRequest> => {
  return (
    typeof input === "object" &&
    Array.isArray(input.inputs) &&
    !Array.isArray(input)
  );
};
const generateFormSchema = () => {
  const schema: FormKitSchemaNode[] = [];
  const { sections } = props.context;
  for (let sectionKey in sections) {
    const currentSection = sections[sectionKey];
    let className = `form-section`;
    const isCurrentSectionArray = !isAppFormSection(currentSection);
    const sectionToBePushed: FormKitSchemaNode = {
      $el: "div",
      attrs: {
        class: isCurrentSectionArray
          ? className
          : `${className} ${currentSection.isTransparent ? " glass" : ""}`,
      },
      children: isCurrentSectionArray ? currentSection : currentSection.inputs,
    };
    schema.push(sectionToBePushed);
  }
  return schema;
};
const isBulkCreateRef = ref(false);
const { push } = useRouter();

function parseValidationError(errorMessage: string) {
  const errorObject: Record<string, string> = {};

  // Match errors in the format: "- input_name: error message"
  const regex = /-\s(\w+):\s(.+?)\s\[/g;
  let match;

  while ((match = regex.exec(errorMessage)) !== null) {
    const [, inputName, errorValue] = match;
    errorObject[inputName] = errorValue;
  }

  return errorObject;
}
const handleError = (node: FormKitNode, error: any) => {
  console.log("error is here from handlerRrorrr methoed", error.message);
  try {
    const errorObject: any = JSON.parse(error.rawMessage);
    node.setErrors(errorObject.globalErrors, errorObject.fieldErrors);
    console.log(errorObject);
  } catch (_err: any) {
    console.log(error, "error from catch", parseValidationError(error));
    node.setErrors([error.message]);
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
      .catch((e: Error) => {
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
          { class: "custom-form-actions" },
          props.context.submitHandler.hideActions
            ? undefined
            : [
                h(AppBtn, { type: "submit", label: "submit", icon: "send" }),
                props.context.useClear
                  ? h(AppBtn, { action: formStore.clearForm, label: "clear" })
                  : undefined,
                props.context.useReset
                  ? h(AppBtn, { action: formStore.resetForm, label: "reset" })
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
