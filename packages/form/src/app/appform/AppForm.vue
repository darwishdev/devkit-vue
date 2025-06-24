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
import { useAppFormStoreWithProps } from "./store/AppFormStore";
import { AppFormProps } from "@/pkg/types/types";

import FormBase from "./components/FormBase.vue";
import { StringUnknownRecord } from "@devkit/apiclient";
// import { onUnmounted } from "vue";

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

useAppFormStoreWithProps(props);
// onUnmounted(() => {
//   // store.$dispose()
// });
</script>
<template>
  <Suspense>
    <FormBase v-bind="props" />
    <template #fallback>
      <div class="loading-indicator">
        <p>Loading form...</p>
        <div class="spinner"></div>
      </div>
    </template>
  </Suspense>
</template>
