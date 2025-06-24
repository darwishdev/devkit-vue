<script
  lang="ts"
  setup
  generic="
    TApi extends Record<string, Function>,
    TReq extends Record<string, unknown>,
    TRecord extends Record<string, unknown>,
    TFiltersReq extends Record<string, unknown> | undefined = undefined,
    TApiResponse extends Record<string, unknown> | undefined = undefined,
    TFormSectionsRequest extends Record<string, unknown> | undefined = undefined
  "
>
import { useDatalistStoreWithKey } from "../store/DatalistStore";
import { Panel, ToggleButton } from "primevue";
import {AppForm} from "@devkit/form";
import { objectEntries } from "@vueuse/core";
import { useFormKitContextById } from "@formkit/vue";
import { StringUnknownRecord } from "@devkit/apiclient";
import { ref } from "vue";

const props = defineProps<{ datalistKey: string }>();
const datalistStore = useDatalistStoreWithKey(props.datalistKey);
const formkCtx = useFormKitContextById(
  datalistStore.filtersFormProps.context.formKey,
);

const pannelPassThrough = {
  root: "transparent",
  header: "relative ",
  pcToggleButton: 'filters-panel-toggler',
  headerActions: "filters-panel-actions",
};
</script>
<template>
  <Panel toggleable :pt="pannelPassThrough">
    <template #header>
      <div v-if="formkCtx" class="filters-header flex gap-4">
        <strong>Filters </strong>
        <div v-for="[key, value] in objectEntries(formkCtx._value)" :key="key">
          <Chip
            v-if="value"
            removable
            class="z-10 cursor-pointer"
            @click="datalistStore.filtersFormStore.clearInput(key as string)"
            @remove="datalistStore.filtersFormStore.clearInput(key as string)"
          >
            <h2>{{ key }} : {{ value }}</h2>
          </Chip>
        </div>
      </div>
    </template>
    <AppForm
      @input="
        (req: StringUnknownRecord) => {
          if (!datalistStore.filtersFormProps.context.isLazy) {
            datalistStore.filtersFormValueRef =
              datalistStore.filtersValueFromReq(req);
          }
        }
      "
      :context="{
        ...datalistStore.filtersFormProps.context,
        sections: { filters: { inputs: datalistStore.filtersFormSchema } },
      }"
    />
  </Panel>
</template>
