import { defineStore, getActivePinia } from "pinia";
import type {
  AppFormOptions,
  AppFormProps,
  StringUnknownRecord,
} from "@devkitvue/config";
import { computed, ref } from "vue";

// import { useDebounceFn } from "@/app/appform/composables/useDebounceFn";
import { useDebounceFn } from "@vueuse/core";
import { RouteQueryAppend } from "@/pkg/utils/QueryUtils";
import { useFormKitContextById, useFormKitNodeById } from "@formkit/vue";
import { ObjectEntries } from "@devkitvue/apiclient";

export const useAppFormStore = <
  TApi extends Record<string, Function>,
  TFormRequest extends StringUnknownRecord = StringUnknownRecord,
  TApiRequest extends StringUnknownRecord = StringUnknownRecord,
  TApiResponse extends StringUnknownRecord = StringUnknownRecord,
  TFindRequestPropName extends string = "recordId",
  TFindResponsePropName extends string = "request",
  TFindCallbakResponse = unknown,
  TCallbakResponse = unknown,
>({
  context,
}: AppFormProps<
  TApi,
  TFormRequest,
  TApiRequest,
  TApiResponse,
  TFindRequestPropName,
  TFindResponsePropName,
  TFindCallbakResponse,
  TCallbakResponse
>) =>
  defineStore(`app-form-${context.formKey}` as string, () => {
    const initialFormValue: StringUnknownRecord = {};
    const formOptions: AppFormOptions = {};
    const formData = ref<Record<string, unknown>>({});
    const debounceInMilliseconds = 1000;
    const formElementContext = useFormKitContextById(context.formKey);
    const formElementNode = useFormKitNodeById(context.formKey);
    const debouncedRouteQueryAppend = useDebounceFn((req) => {
      if (typeof req == "object") {
        RouteQueryAppend(context.formKey, JSON.stringify(req));
        return;
      }
      RouteQueryAppend(context.formKey, req);
    }, debounceInMilliseconds);
    const resetForm = () => {
      if (!formElementNode.value) return;
      formElementNode.value.reset();
    };
    const clearForm = () => {
      if (!formElementNode.value) return;
      formElementNode.value.reset({});
    };
    const formValueString = computed(() => {
      if (!formElementNode.value) return "";
      if (!formElementNode.value._value) return "";
      if (!formElementNode.value.value) return "";
      try {
        const stringValue = JSON.stringify(formElementNode.value._value);
        if (stringValue == "{}") return "";
        return stringValue;
      } catch (e) {
        console.error("error happened while converting value: ", e);
        return "";
      }
    });
    const setFormValue = async (value: StringUnknownRecord) => {
      if (!formElementNode.value) return;
      formElementNode.value.reset(value);
    };
    const setInputValue = async (inputName: string, inputValue: unknown) => {
      if (!formElementNode.value) return;
      const newInputObject: Record<string, unknown> = {};
      newInputObject[inputName] = inputValue;
      console.log("new obj is", newInputObject);
      formElementNode.value.input(newInputObject);
      //formElementNode.value.reset({ ...formElementNode.value, ...newInputObject })
    };

    const refetchDropdownInput = async (inputName: string) => {
      if (!formElementNode.value) return;
      const node = formElementNode.value.find(inputName, "name");
      if (!node) return;
      if ("forceReload" in node.props) {
        node.props.forceReload();
      }
    };

    const clearInput = async (inputName: string) => {
      setInputValue(inputName, null);
    };
    const presistForm = () => {
      if (!formElementNode.value) return;
      localStorage.setItem(context.formKey, formValueString.value);
    };
    const formValue = computed(() => {
      const activeInputs: StringUnknownRecord = {};
      if (!formElementNode) return activeInputs;
      if (!formElementNode.value) return activeInputs;
      if (!formElementNode.value._value) return activeInputs;
      return formElementNode.value._value as StringUnknownRecord;
    });

    const activeInputs = computed(() => {
      const activeInputs: StringUnknownRecord = {};
      console.log("formvalue", formValue.value);
      for (const [key, value] of ObjectEntries(formValue.value)) {
        console.log("formvalue", formValue.value);
        if (value) {
          activeInputs[key] = value;
        }
      }
      return activeInputs;
    });

    return {
      //state
      initialFormValue,
      setFormValue,
      formValue,
      presistForm,
      formValueString,
      clearInput,
      activeInputs,
      refetchDropdownInput,
      setInputValue,
      resetForm,
      formElementNode,
      formElementContext,
      formData,
      debouncedRouteQueryAppend,
      clearForm,
      formOptions,
      //methos
    };
  });
export const useAppFormStoreWithProps = <
  TApi extends Record<string, Function>,
  TFormRequest extends StringUnknownRecord = StringUnknownRecord,
  TApiRequest extends StringUnknownRecord = StringUnknownRecord,
  TApiResponse extends StringUnknownRecord = StringUnknownRecord,
  TFindRequestPropName extends string = "recordId",
  TFindResponsePropName extends string = "request",
  TFindCallbakResponse = unknown,
  TCallbakResponse = unknown,
>(
  props: AppFormProps<
    TApi,
    TFormRequest,
    TApiRequest,
    TApiResponse,
    TFindRequestPropName,
    TFindResponsePropName,
    TFindCallbakResponse,
    TCallbakResponse
  >,
) =>
  useAppFormStore<
    TApi,
    TFormRequest,
    TApiRequest,
    TApiResponse,
    TFindRequestPropName,
    TFindResponsePropName,
    TFindCallbakResponse,
    TCallbakResponse
  >(props)();
export const useAppFormStoreWithKey = (formKey: string) => {
  const pinia = getActivePinia();
  if (!pinia) throw new Error("Pinia not installed");
  const isStoreDefined = `app-form-${formKey}` in pinia.state.value;
  if (!isStoreDefined) throw new Error("store is not defined");
  return useAppFormStoreWithProps({
    context: {
      sections: {},
      formKey,
      title: `formKey`,
      submitHandler: { endpoint: "" },
    },
  });
};
