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
</script>
<template>
  <Suspense>
    <FormBase v-bind="props" />
  </Suspense>
</template>
