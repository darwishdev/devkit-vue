import { FormKitPlugin } from "@formkit/core";
import { ObjectKeys, resolveApiEndpoint } from "@devkit/apiclient";
import { FindHandler } from "@/pkg/types/types";
import { useRoute } from "vue-router";
import { RouteQueryFind, RouteQueryRemove } from "@/pkg/utils/QueryUtils";
import { inject } from "vue";

export const FormDataGetterPlugin: FormKitPlugin = (node) => {
  if (!node.props) return
  if (node.props.type == 'form') {
    const { id: formKey, attrs } = node.props
    const apiClient = inject('apiClient')
    const { findHandler, syncWithUrl, usePresist } = attrs
    const getDataFromFindHandler = (handler: FindHandler<any, any, any>) => {
      const route = useRoute()
      if (!handler) return
      if (!handler.endpoint) return
      const findHandlerRequest: any = {};
      const requestValue = handler.requestValue
        ? handler.requestValue
        : route.params[handler.routerParamName || "id"];
      findHandlerRequest[handler.requestPropertyName] = requestValue;
      resolveApiEndpoint<any, any, any>(handler.endpoint, apiClient, findHandlerRequest)
        .then((resp) => {
          if (!resp) return
          if (handler.responsePropertyName) {
            if (handler.responsePropertyName in resp) {
              const formValue = resp[handler.responsePropertyName];
              if (typeof formValue == "object" && formValue) {
                node.input(formValue)
                return
              }
            }
          }
          node.input(resp)
        })
        .catch((e: Error) => {
          console.error("find handler failed", e);
        });
    }

    const getInitialValue = (formValues: string) => {
      console.log("initial", formValues)
      if (!formKey || !formValues) return
      try {
        return JSON.parse(formValues);
      } catch (e) {
        RouteQueryRemove(formKey);
        localStorage.removeItem(formKey);
        console.log("error parsing url", e);
      }
    }
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
      console.log("default fetcher")
      if (!syncWithUrl && !usePresist) {
        return;
      }
      if (usePresist) {
        const localStorageFormValues = getInitialValueFromLocalStorage();
        if (localStorageFormValues) {
          if (ObjectKeys(localStorageFormValues).length > 0) {
            node.input(localStorageFormValues)
            return
          }
        }
      }

      console.log("default fetcher", node.props)
      const urlFormValues = getInitialValueFromUrl();
      if (urlFormValues) {
        if (ObjectKeys(urlFormValues).length > 0) {
          // formStore.formValueRef = urlFormValues
          node.input(urlFormValues)
        }
      }
    };

    if (findHandler) {
      getDataFromFindHandler(findHandler)
      return
    }
    getDefaultFormValue()
    console.log("node is node", node.props.attrs.findHandler)
  }
}
