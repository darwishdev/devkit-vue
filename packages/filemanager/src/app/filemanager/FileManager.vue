<script setup lang="ts" generic="TApi extends Record<string, Function>">
import { ref, inject, VNode } from "vue";
import {
  DatalistStore,
  Datalist,
  useDatalistStoreWithProps,
  type DatalistProps,
} from "@devkitvue/datalist";
import { bucketInput, bucketsForm } from "./schemas";
import { FilesHandler, StringUnknownRecord } from "@devkitvue/config";
import {
  BucketCreateUpdateRequest,
  GalleryListRequest,
  FileObject,
  GalleryListResponse,
} from "@devkitvue/config";
const fileInput = ref<HTMLInputElement | null>(null);
const filesHandler = inject<FilesHandler<TApi>>("filesHandler");
const props = defineProps<{
  bucketName?: string;
  isSelectionHidden?: boolean;
}>();
defineSlots<{
  card?: (props: { data: FileObject }) => VNode[];
  actions?: (props: { data: FileObject }) => VNode | VNode[];
  globalActions?: (props: {
    store: DatalistStore<
      TApi,
      GalleryListRequest,
      FileObject,
      GalleryListRequest,
      GalleryListResponse,
      GalleryListRequest
    >;
  }) => VNode[] | VNode;
  //global?: (props: { data: FileObject }) => VNode | VNode[];
}>();
const datalistProps:
  | DatalistProps<
      TApi,
      GalleryListRequest,
      FileObject,
      GalleryListRequest,
      GalleryListResponse,
      BucketCreateUpdateRequest
    >
  | undefined = !filesHandler
  ? undefined
  : {
      context: {
        datalistKey: "files",
        hideShowDeleted: true,
        title: "files",
        formSections: bucketsForm,
        rowIdentifier: "id",
        filters: props.bucketName ? undefined : [bucketInput],
        isSelectionHidden: props.isSelectionHidden,
        requestMapper: props.bucketName
          ? (req) => {
              return {
                filters: {
                  ...req.filters,
                  bucketId: props.bucketName as string,
                },
                paginationParams: req.paginationParams,
              };
            }
          : undefined,
        records: filesHandler.galleryListEndpoint,
        isServerSide: true,
        isPresistFilters: true,
        displayType: "card",
        isLazyFilters: false,
        isActionsDropdown: false,
        options: { title: "asd", description: "asd" },
      },
    };

const datalistStore = !datalistProps
  ? undefined
  : useDatalistStoreWithProps(datalistProps);
// Drag and drop handlers
// File upload function
const openUploadDialog = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const createSubmitted = (value: StringUnknownRecord) => {
  if (!datalistStore) return;
  //datalistStore.filtersFormStore.refetchDropdownInput("bucketId");
  console.log("submitted value is ", value);
};
</script>
<template>
  <div v-if="!filesHandler || !datalistProps">
    files handler is not passed on config
  </div>
  <div v-else class="buckets">
    <FormKit
      type="devkitUpload"
      :hideSelectFromGallery="true"
      bucketName="images"
      name="image"
      label="upload"
    />
    <input type="file" ref="fileInput" style="display: none" />
    <Datalist
      :context="datalistProps.context"
      @create:submited="createSubmitted"
    >
      <template #card="{ data }">
        <slot name="card" :data="data as FileObject">
          <AppImage :src="data.name" />
        </slot>
      </template>
      <template #globalActionsStartAppend>
        <AppBtn :action="openUploadDialog" label="upload" />
      </template>
    </Datalist>
  </div>
</template>
