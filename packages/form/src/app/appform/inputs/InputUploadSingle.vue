<script lang="ts" setup generic="TApi extends Record<string, Function>">
import { resolveApiEndpoint } from "@devkit/apiclient";
import { InputUploadProps } from "./types";
import FileUpload, {
  FileUploadSelectEvent,
  FileUploadUploaderEvent,
} from "primevue/fileupload";
import { h, inject, ref } from "vue";
import InputUploadDialog from "./InputUploadDialog.vue";
import { useDialog } from "primevue";
import { AppBtn, AppImage } from "@devkit/base-components";
import { createFileBulkRequestFromFiles } from "./InputUploadAdapter";
import { FilePreview, FilesHandler } from "@/pkg/types/types";
import { FileCreateBulkRequest } from "@buf/ahmeddarwish_devkit-api.community_timostamm-protobuf-ts/devkit/v1/public_storage_pb";

const { context } = defineProps<InputUploadProps & { multiple: false }>();
const { bucketName, auto, node } = context;
const apiClient = inject<TApi>("apiClient");
const previewFileRef = ref<{ src: string; value: string }>({
  value: node.value || "",
  src: node.value || "",
});
const dialog = useDialog();
const filesHandler = inject<FilesHandler<TApi>>("filesHandler");
const fileUploadElementRef = ref();
// When files are selected
const emitInput = (preview: FilePreview) => {
  previewFileRef.value = preview;
  node.input(preview.value);
};
const filePreviewFromFile = (file: File): FilePreview => {
  return {
    src: URL.createObjectURL(file),
    value: file.name,
  };
};
const onSelectedFiles = async (event: FileUploadSelectEvent) => {
  if (!event.files.length || auto) return;
  const [file] = event.files;
  emitInput(filePreviewFromFile(file));
  if (node.parent) {
    if (node.parent.props.type == "form") {
      const request = await createFileBulkRequestFromFiles(
        event.files,
        bucketName,
      );
      node.parent.props.uploads = request;
    }
  }
};
const openGallery = () => {
  dialog.open(
    h(InputUploadDialog, {
      bucketName,
      isSelectionHidden: true,
      onChoose: async (files) => {
        console.log("choossssing", files);
        if (files.length || auto) return;
        const [file] = files;
        emitInput({ src: file.name, value: file.name });
      },
    }),
  );
};
const clearInput = () => {
  fileUploadElementRef.value.files = [];
  fileUploadElementRef.value.uploads = [];
  emitInput({ src: "", value: "" });
};
const removeUploadedFile = async () => {
  if (!filesHandler) return;
  if (!filesHandler.fileDeleteByBucket) return;
  await resolveApiEndpoint(filesHandler.fileDeleteByBucket, apiClient, {
    bucketName: bucketName,
    records: [previewFileRef.value.value],
  });
};
const uploadSingleFile = async (request: FileCreateBulkRequest) => {
  if (!filesHandler) return;
  if (filesHandler.fileCreate) {
    const { path } = await resolveApiEndpoint(
      filesHandler.fileCreate,
      apiClient,
      request.files[0],
    );
    emitInput({ src: path, value: path });
    return;
  }
  if (filesHandler.fileBulkCreate) {
    await resolveApiEndpoint(filesHandler.fileBulkCreate, apiClient, request);
    return;
  }
};

// On successful upload
const uploader = async (e: FileUploadUploaderEvent) => {
  if (!filesHandler) return;
  if (!filesHandler.fileBulkCreate && !filesHandler.fileCreate) return;
  if (!e.files) return;
  if (Array.isArray(e.files) && e.files.length == 0) return;
  const filesArr = Array.isArray(e.files) ? e.files : [e.files];
  const request = await createFileBulkRequestFromFiles(filesArr, bucketName);
  if (!request.files.length) return;
  await uploadSingleFile(request);
};
const renderFileUpload = () => {
  return h(
    FileUpload,
    {
      ...context,
      ref: (r) => (fileUploadElementRef.value = r),
      onSelect: onSelectedFiles,
      onUploader: uploader,
      fileLimit: 1,
      customUpload: true,
    },
    {
      content: () =>
        h(
          "div",
          {
            class: "flex",
          },
          [
            !previewFileRef.value.value
              ? undefined
              : h(
                  "div",
                  {
                    class: "card",
                  },
                  [
                    h(AppImage, {
                      width: "150px",
                      src: previewFileRef.value.src,
                    }),
                    h(AppBtn, {
                      label: "remove",
                      icon: "trash",
                      action: () => {
                        clearInput();
                        if (auto) {
                          removeUploadedFile();
                        }
                      },
                    }),
                  ],
                ),
          ],
        ),
      empty: () => h("h2", `drop files hear`),
      header: ({
        chooseCallback,
        clearCallback,
      }: {
        chooseCallback: Function;
        clearCallback: Function;
      }) =>
        h(
          "div",
          {
            class: "flex gap-2",
          },
          [
            h(AppBtn, {
              icon: "images",
              label: "select from files",
              rounded: true,
              disabled: previewFileRef.value.value.length > 0,
              outlined: true,
              severity: "info",
              action: () => {
                clearInput();
                chooseCallback();
                console.log("choose");
              },
            }),
            h(AppBtn, {
              icon: "images",
              label: "select from gallery",
              rounded: true,
              outlined: true,
              severity: "success",
              action: () => {
                openGallery();
              },
            }),
            h(AppBtn, {
              icon: "images",
              label: "cancel",
              rounded: true,
              outlined: true,
              severity: "danger",
              action: async () => {
                if (auto) {
                  //await removeUploadedFile(previewFileRef.value);
                }
                clearInput();
                clearCallback();
              },
            }),
          ],
        ),
    },
  );
};
</script>
<template>
  <component :is="renderFileUpload" />
</template>
