<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TReq extends Record<string, unknown>,
    TRecord extends Record<string, unknown>,
    TFiltersReq extends StringUnknownRecord | undefined = undefined,
    TApiResponse extends StringUnknownRecord | undefined = undefined,
    TFormSectionsRequest extends StringUnknownRecord | undefined = undefined
  "
>
import type { StringUnknownRecord } from "@devkitvue/config";
import {
  type DatalistEmits,
  type DatalistProps,
  type DatalistSlots,
  DataList as DevkitDataList,
} from "@devkitvue/datalist";
import { h } from "vue";
const emit = defineEmits<DatalistEmits<TRecord, TApiResponse>>();
const props =
  defineProps<
    DatalistProps<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >
  >();
const slots =
  defineSlots<
    DatalistSlots<
      TApi,
      TReq,
      TRecord,
      TFiltersReq,
      TApiResponse,
      TFormSectionsRequest
    >
  >();
const renderDatalist = h(DevkitDataList, props, slots);
</script>
<template>
  <component :is="renderDatalist" v-on="emit" />
</template>
