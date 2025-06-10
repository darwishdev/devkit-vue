<script lang="ts" setup generic="TApi extends Record<string, Function>">
import { InputUploadProps } from "./types";
import { computed, h, inject, onMounted, ref, watch, watchEffect } from "vue";
import {
  Badge,
  FileUpload,
  FileUploadSelectEvent,
  useDialog,
  useToast,
} from "primevue";
import { FilesHandler } from "@/pkg/types/types";
import { ObjectKeys } from "@devkit/apiclient";
import InputUploadDialog from "./InputUploadDialog.vue";
import { AppBtn, AppImage } from "@devkit/base-components";
import { useI18n } from "vue-i18n";
import { createFileBulkRequestFromFiles } from "./InputUploadAdapter";
const { context } = defineProps<InputUploadProps>();
const previewFilesRef = ref<Record<string, string>>({});
const filesHandler = inject<FilesHandler<TApi>>("filesHandler");
const dialog = useDialog();
const toast = useToast();
const { t } = useI18n();
const {
  multiple = false,
  fileLimit,
  auto,
  node,
  bucketName = filesHandler?.defauleBucketName || "",
} = context;
const onSlectedFilesEvent = async (event: FileUploadSelectEvent) => {
  if (auto || !node.parent) return;

  emitValue();
  if (node.parent.props.type == "form") {
    const request = await createFileBulkRequestFromFiles(
      event.files,
      bucketName,
    );
    node.parent.props.uploads = request;
  }
};
const emitValue = () => {
  const allFiles: string[] = [];
  console.log("allfiles");
  if (fileUploadElementRef.value) {
    const filesValue = [
      ...fileUploadElementRef.value.files,
      ...fileUploadElementRef.value.uploadedFiles,
    ];
    filesValue.forEach((file) => allFiles.push(`${bucketName}/${file.name}`));
  }
  const keys = [...ObjectKeys(previewFilesRef.value), ...allFiles];

  console.log("allfiles", allFiles, keys);
  if (!keys.length) return node.input(multiple ? [] : "");
  return node.input(multiple ? keys : keys[0]);
};

const handleFileLimitExceeded = () => {
  toast.add({
    severity: "error",
    summary: t("max_files"),
    detail: t("file_limit_exceeded"),
    life: 3000,
  });
};
const isFileLimitExceeded = (len: number) => {
  if (!multiple) {
    return len > 0;
  }

  if (!fileLimit) return false;
  return len + len > fileLimit;
};
const reflectValues = ({
  name,
  src,
  bucket = "",
}: {
  name: string;
  src?: string;
  fileIndex?: number;
  uploadedFileIndex?: number;
  bucket?: string;
}) => {
  const fileName = `${bucket}${name}`;
  previewFilesRef.value[fileName] = src || fileName;
};

onMounted(() => {
  // In case context._value is already available on mount
  handleValueChange(context._value);
});

// Watch for changes to context._value
watch(
  () => context._value,
  (newValue) => {
    handleValueChange(newValue);
  },
);
function handleValueChange(value: any) {
  if (!value || ObjectKeys(previewFilesRef.value).length) return;

  if (Array.isArray(value)) {
    value.forEach((v: string) => {
      if (v) {
        previewFilesRef.value[v] = `${v}`;
      }
    });
  } else {
    previewFilesRef.value[value] = value;
  }
}
const openGallery = (filesLength: number, uploadedFilesLength: number) => {
  dialog.open(
    h(InputUploadDialog, {
      bucketName,
      onChoose: async (files) => {
        console.error(
          "max files exceeded",
          files.length + filesLength + uploadedFilesLength,
        );
        if (
          isFileLimitExceeded(files.length + filesLength + uploadedFilesLength)
        ) {
          handleFileLimitExceeded();
          console.error(
            "max files exceeded",
            files.length + filesLength + uploadedFilesLength,
          );
          return;
        }
        files.forEach(reflectValues);
        emitValue();
      },
    }),
  );
};
const removeSelectedFile = (key: string) => {
  delete previewFilesRef.value[key];
  emitValue();
};
const renderEmptySlot = () => h("h2", `drop files hear`);
const renderHeaderSlot = ({
  files = [],
  uploadedFiles = [],
  chooseCallback,
  clearCallback,
}: {
  files: File[];
  uploadedFiles: File[];
  chooseCallback: Function;
  clearCallback: Function;
}) =>
  h("div", { class: "header" }, [
    h(
      "div",
      {
        class: "flex gap-2",
      },
      [
        h(AppBtn, {
          icon: "images",
          label: "choose",
          rounded: true,
          outlined: true,
          severity: "info",
          action: () => {
            const limit = multiple ? fileLimit : 1;
            console.log("limit is", limit);
            if (limit) {
              console.log("limit is", files, "uppp", uploadedFiles);
              if (limit < files.length + uploadedFiles.length) {
                handleFileLimitExceeded();
              }
            }
            chooseCallback();
          },
        }),
        h(AppBtn, {
          icon: "images",
          label: "select from gallery",
          rounded: true,
          outlined: true,
          severity: "success",
          action: () => {
            openGallery(files.length, uploadedFiles.length);
          },
        }),
        h(AppBtn, {
          icon: "images",
          label: "cancel",
          rounded: true,
          outlined: true,
          severity: "danger",
          action: async () => {
            clearCallback();
          },
        }),
      ],
    ),
    h(
      "div",
      {
        class: "flex",
      },
      [
        ObjectKeys(previewFilesRef.value).map((key) =>
          h(
            "div",
            {
              class: "p-fileupload-file",
            },
            [
              h(AppImage, {
                width: "50",
                src: previewFilesRef.value[key],
              }),
              h(
                "div",
                {
                  class: "p-fileupload-file-info",
                  "data-pc-section": "fileinfo",
                },
                [
                  h(
                    "div",
                    {
                      class: "p-fileupload-file-name",
                      "data-pc-section": "filename",
                    },
                    previewFilesRef.value[key],
                  ),
                  h(
                    "span",
                    {
                      class: "p-fileupload-file-size",
                      "data-pc-section": "filesize",
                    },
                    "18.385 KB",
                  ),
                ],
              ),
              h(Badge, { severity: "success" }, "Completed"),
              h(
                "div",
                {
                  class: "p-fileupload-file-actions",
                  "data-pc-section": "fileactions",
                },
                [
                  h(AppBtn, {
                    icon: "close_red",
                    iconOnly: true,
                    variant: "text",
                    action: () => {
                      removeSelectedFile(key);
                    },
                  }),
                ],
              ),
            ],
          ),
        ),
      ],
    ),
    // h(
    //   "div",
    //   {
    //     class: "flex",
    //   },
    //   [
    //     Array.isArray(context._value)
    //       ? context._value.map((key) =>
    //           h(
    //             "div",
    //             {
    //               class: "p-fileupload-file",
    //             },
    //             [
    //               h(AppImage, {
    //                 width: "50",
    //                 src: key,
    //               }),
    //               h(
    //                 "div",
    //                 {
    //                   class: "p-fileupload-file-info",
    //                   "data-pc-section": "fileinfo",
    //                 },
    //                 [
    //                   h(
    //                     "div",
    //                     {
    //                       class: "p-fileupload-file-name",
    //                       "data-pc-section": "filename",
    //                     },
    //                     key,
    //                   ),
    //                 ],
    //               ),
    //               h(Badge, { severity: "success" }, "Completed"),
    //               h(
    //                 "div",
    //                 {
    //                   class: "p-fileupload-file-actions",
    //                   "data-pc-section": "fileactions",
    //                 },
    //                 [
    //                   h(AppBtn, {
    //                     icon: "close_red",
    //                     iconOnly: true,
    //                     variant: "text",
    //                     action: () => {
    //                       removeSelectedFile(key);
    //                     },
    //                   }),
    //                 ],
    //               ),
    //             ],
    //           ),
    //         )
    //       : h("div", "hi"),
    //   ],
    // ),
  ]);
const fileUploadElementRef = ref();
const renderInputUpload = () => {
  return h(
    FileUpload,
    {
      ...context,
      url: filesHandler?.uploadUrl,
      fileLimit: multiple ? fileLimit : 1,
      onSelect: onSlectedFilesEvent,
      ref: (r) => (fileUploadElementRef.value = r),
      onUpload: () => {
        emitValue();
      },
      onRemoveUploadedFile: (event: { file: File }) => {
        console.log("files removed", event);
        if (fileUploadElementRef.value) {
          fileUploadElementRef.value.uploadedFileCount--;
        }
      },
    },
    {
      empty: renderEmptySlot,
      header: renderHeaderSlot,
    },
  );
};
</script>
<template>
  <component :is="renderInputUpload" />
</template>
