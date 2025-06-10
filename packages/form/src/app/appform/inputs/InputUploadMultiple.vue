<script lang="ts" setup generic="TApi extends Record<string, Function>">
import { FileCreateBulkRequest, FileObject } from "@/pkg/types/api_types";
import { resolveApiEndpoint } from "@devkit/apiclient";
import { InputUploadProps } from "./types";
import FileUpload, {
  FileUploadSelectEvent,
  FileUploadUploaderEvent,
} from "primevue/fileupload";
import { h, inject, ref } from "vue";
import InputUploadDialog from "./InputUploadDialog.vue";
import { FilePreview, FilesHandler } from "@/pkg/types/types";
import { useDialog } from "primevue";
import { AppBtn, AppImage } from "@devkit/base-components";
import { createFileBulkRequestFromFiles } from "./InputUploadAdapter";
const { context } = defineProps<InputUploadProps & { multiple: true }>();
const { bucketName, auto, fileLimit, node } = context;
const apiClient = inject<TApi>("apiClient");
const previewFilesRef = ref<FilePreview[]>([]);
// const selectedFilesRef = ref<File[]>([]);
// const galleryFilesRef = ref<FileObject[]>([]);
const dialog = useDialog();
const filesHandler = inject<FilesHandler<TApi>>("filesHandler");
const fileUploadElementRef = ref();
// const totalFilesLength = () => {
//   return selectedFilesRef.value.length + galleryFilesRef.value.length;
// };
const inputValue = (): string[] | string => {
  if (!previewFilesRef.value.length) return [];
  return previewFilesRef.value.map((i) => i.value);
};
// Emit types
// When files are selected
const onSelectedFiles = async (event: FileUploadSelectEvent) => {
  if (!event.files.length || auto) return;
  if (fileLimit) {
    if (previewFilesRef.value.length + event.files.length > fileLimit) {
      alert("exceeded max files");
      return;
    }
  }
  console.log("changed");
  event.files.forEach((f: File) => {
    const name = `${bucketName}/${f.name}`;
    previewFilesRef.value.push({ src: name, value: name });
  });

  console.log("changed", previewFilesRef.value);
  node.input(inputValue());
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
      onChoose: async (files) => {
        // previewFilesRef.value = [...previewFilesRef.value, ...files];
        // node.input(inputValue());
      },
    }),
  );
};
const removeSelectedFile = (file: FilePreview) => {
  const index = previewFilesRef.value.indexOf(file);
  if (index !== -1) {
    previewFilesRef.value.splice(index, 1);
    node.input(inputValue());
    if (auto) {
      removeUploadedFile(file);
    }
  }
};

const removeUploadedFile = async (file: FilePreview) => {
  if (!filesHandler) return;
  if (!filesHandler.fileDeleteByBucket) return;
  await resolveApiEndpoint(filesHandler.fileDeleteByBucket, apiClient, {
    bucketName: bucketName,
    records: Array.isArray(file) ? file.map((f) => f.name) : [file.value],
  });
};
const uploadMultipleFiles = async (request: FileCreateBulkRequest) => {
  if (!filesHandler) return;
  if (filesHandler.fileBulkCreate) {
    await resolveApiEndpoint(filesHandler.fileBulkCreate, apiClient, request);
    return;
  }

  if (filesHandler.fileCreate) {
    for (let i = 0; i < request.files.length; i++) {
      await resolveApiEndpoint(
        filesHandler.fileCreate,
        apiClient,
        request.files[i],
      );
    }
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
  let request = await createFileBulkRequestFromFiles(filesArr, bucketName);
  if (!request.files.length) return;
  await uploadMultipleFiles(request);
  node.input(inputValue());
};
const renderFileUpload = () => {
  return h(
    FileUpload,
    {
      ...context,
      ref: (r) => (fileUploadElementRef.value = r),
      onSelect: onSelectedFiles,
      onUploader: uploader,
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
            previewFilesRef.value.map((f) =>
              h(
                "div",
                {
                  class: "card",
                },
                [
                  h(AppImage, {
                    width: "150px",
                    src: f.src,
                  }),
                  h(AppBtn, {
                    label: "remove",
                    icon: "trash",
                    action: () => removeSelectedFile(f),
                  }),
                ],
              ),
            ),
          ],
        ),
      empty: () => h("h2", "drop files hear"),
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
              outlined: true,
              severity: "info",
              action: () => {
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
                  // await removeUploadedFile();
                }
                previewFilesRef.value = [];
                node.input(inputValue());
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
