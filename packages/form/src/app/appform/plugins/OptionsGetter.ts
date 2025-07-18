import { FormKitPlugin } from "@formkit/core";
import { db } from "@/index";
import { StringUnknownRecord } from "@devkitvue/apiclient";
import { useMemoizedDropdownOptions } from "./OptionsGetterUtils";
import { inject, ref } from "vue";

export const DependencyManagerPlugin: FormKitPlugin = (node) => {
  if (!node.props) return;
  if (
    "dependsOn" in node.props ||
    "requestMapper" in node.props ||
    "requestPropertyName" in node.props
  ) {
    node.props.constructRequest = (): StringUnknownRecord | false => {
      const { requestMapper, requestPropertyName = "recordId" } = node.props;
      let request: StringUnknownRecord = {};
      if (node.props.dependsOn) {
        const parentValue = node.props.getParentFormValue();
        if (!parentValue) return false;
        node.props.lastParentValue = parentValue;
        request[requestPropertyName as string] = parentValue;
      }
      if (requestMapper) {
        request = requestMapper(request);
      }
      return request;
    };
  }
  if ("dependsOn" in node.props) {
    node.props.errorMessageRef = ref("");
    const { dependsOn } = node.props;
    const getParentFormValue = () => {
      if (!dependsOn) return {};
      if (!node.parent) {
        node.setErrors(["dependsOn is passed but the input has no parent"]);
        node.props.errorMessageRef.value =
          "dependsOn is passed but the input has no parent";
        return false;
      }
      if (!node.parent.value) return false;
      if (typeof node.parent.value != "object") return false;
      const formValue = node.parent.value as StringUnknownRecord;
      // Maybe you will need to use node.parent.value instead of it's clone formValue for reactivity bug
      if (!(dependsOn in formValue)) {
        node.setErrors([
          `dependsOn is passed but the input has no sibling with this name "${dependsOn}"`,
        ]);
        return false;
      }
      if (!formValue[dependsOn]) {
        node.props.errorMessageRef.value = `please select value from this input "${dependsOn}" in order to fetch options for this input`;
        return false;
      }
      return formValue[dependsOn];
    };
    node.props.getParentFormValue = getParentFormValue;
  }
};
export const OptionsGetterPlugin: FormKitPlugin = (node) => {
  if (!node.props) return;
  const inputyType = node.props.type;
  if (
    inputyType == "devkitDropdown" ||
    inputyType == "devkitMultiDropdown" ||
    inputyType == "devkitToggleCollection" ||
    inputyType == "devkitIcon"
  ) {
    node.props.isLoading = ref(false);
    node.props.optionsArray = ref([]);
    node.props.errorMessageRef = ref("");
    node.props.lastParentValue = "";
    const apiClient = inject<Record<string, Function>>("apiClient");
    const {
      options,
      dependsOn,
      cacheKey = node.name,
      bypassCache,
      useLazy,
      optionsMapper,
      responseOptionsKey = "options",
      cacheTimeout = 60 * 60 * 1000 * 200,
    } = node.props;
    const getCacheName = () => {
      console.log(
        "getting cache name here",
        cacheKey,
        node,
        node.props,
        node.name,
      );
      if (!node.props.getParentFormValue || !dependsOn) return cacheKey;
      const parentValue = node.props.getParentFormValue();
      if (parentValue) {
        return `${cacheKey}-${parentValue.value}`;
      }
      return cacheKey;
    };
    const optionsFetcherFn = async () => {
      if (Array.isArray(options)) {
        return options;
      }

      const request = node.props.constructRequest
        ? node.props.constructRequest()
        : {};
      const cacheName = getCacheName();
      if (!request) return Promise.resolve([]);
      return useMemoizedDropdownOptions()(cacheName, cacheTimeout, {
        options,
        request: request,
        bypassCache,
        apiClient,
        optionsMapper,
        responseOptionsKey,
      });
    };
    const optionsFetcher = () => {
      node.props.isLoading.value = true;
      if (Array.isArray(node.props.options)) {
        node.props.optionsArray.value = options;
        node.props.isLoading.value = false;
        return;
      }
      optionsFetcherFn()
        .then((resp) => {
          node.props.optionsArray.value = resp;
        })
        .catch((e) => {
          console.log("e", e);
          if ("message" in e) {
            if (e.message.includes("is not a function")) {
              node.props.errorMessageRef.avalue =
                "the function name passed on options not found on injected api client";
              return;
            }
            node.props.errorMessageRef.value = e.message;
            return;
          }
          node.props.errorMessageRef.value = e;
        })
        .finally(() => (node.props.isLoading.value = false));
    };
    const forceReload = () => {
      db.dropdownHelper.bulkDelete([getCacheName()]);
      optionsFetcher();
    };
    if (!useLazy) {
      optionsFetcher();
    }
    node.props.optionsFetcher = optionsFetcher;
    node.props.forceReload = forceReload;
  }
};
