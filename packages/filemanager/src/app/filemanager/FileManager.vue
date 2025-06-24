<script setup lang="ts" generic="TApi extends Record<string, Function>">
import { ref, inject, computed, VNode } from "vue";
import {
  DatalistStore,
  Datalist,
  useDatalistStoreWithProps,
  type DatalistProps,
} from "@devkit/datalist";
import { bucketInput, bucketsForm } from "./schemas";
import { FilesHandler, StringUnknownRecord } from "@devkit/config";
import {
  BucketCreateUpdateRequest,
  GalleryListRequest,
  FileObject,
  GalleryListResponse,
} from "@devkit/config";
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
const bucketName = computed(() => {
  if (props.bucketName) return props.bucketName;
  if (!datalistStore) return "";
  const filtersFormValue = datalistStore.filtersFormStore.formValue;
  if (!filtersFormValue || !("bucketId" in filtersFormValue)) return "";
  return filtersFormValue.bucketId as string;
});

const uploadFiles = async (files: FileList) => {
  if (!datalistStore || !filesHandler) return;
  console.log("uploading", files);

  console.log(
    "reader is ",
    datalistStore.filtersFormStore.formValue,
    filesHandler,
  );
  try {
    const file = files[0];
    // const filePath = file.name; // Adjust based on your needs
    // const fileType = file.type;

    if (bucketName.value) return;
    const reader = new FileReader();

    console.log("reader is ", filesHandler);
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        console.log("reader is ", filesHandler);
        // const fileRequest = {
        //   path: filePath,
        //   bucketName: bucketName.value,
        //   reader: new Uint8Array(reader.result),
        //   fileType: fileType,
        // };
        // // resolveApiEndpoint(
        //   filesHandler.fileCreate,
        //   apiClient,
        //   fileRequest,
        // ).then((response) => {
        //   datalistStore.datalistQueryResult.refetch();
        //   console.log("response", response);
        // });
      }
    };

    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
const openUploadDialog = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const handleFileChange = (event: Event) => {
  console.log("filte changed", event);
  const bucketId = { value: "images" };
  if (!bucketId.value) {
    console.error("bucket should be selected to be able to upload");
    return;
  }
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  console.log("should handle the upload", bucketId.value);
  uploadFiles(target.files);
};
const createSubmitted = (value: StringUnknownRecord) => {
  if (!datalistStore) return;
  datalistStore.filtersFormStore.refetchDropdownInput("bucketId");
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
    <input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      style="display: none"
    />
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
