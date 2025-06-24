<script lang="ts" setup generic="TApi extends Record<string, Function>">
import { onBeforeUnmount, inject, computed } from "vue";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/vue";
import Tus, { TusBody } from "@uppy/tus";
import ImageEditor from "@uppy/image-editor";
import Compressor from "@uppy/compressor";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/image-editor/dist/style.css";

import GallerySelectPlugin from "../plugins/GallerySelector";
import { InputUploadProps, InputUploadMeta } from "./types";
import { FilesHandler } from "@/pkg/types/types";
import { resolveApiEndpoint } from "@devkit/apiclient";

const props = defineProps<InputUploadProps<TApi>>();
const filesHandler = inject<FilesHandler<TApi>>("filesHandler");
const apiClient = inject<TApi>("apiClient");
const {
  node,
  bucketName = filesHandler?.defauleBucketName || "",
  hideSelectFromGallery,
  isMultiple,
  dashboardOptions,
  baseUrl: baseUrlOption,
  fallbackImageUrl,
  uppyOptions = {
    autoProceed: false,
    restrictions: {
      maxNumberOfFiles: isMultiple ? null : 1,
      minFileSize: null,
      maxTotalFileSize: null,
      minNumberOfFiles: null,
      allowedFileTypes: null,
      requiredMetaFields: ["bucketName"],
    },
    meta: {
      bucketName,
      objectName: "",
      isGallery: false,
      isInitial: false,
      contentType: "",
    },
  },

  tusOptions = {},
  galleryOptions = {},
  imageEditorOptions = {},
} = props.context;
const fallbackImage = fallbackImageUrl || inject<string>("fallbackImageUrl");
const baseUrl = baseUrlOption || inject<string>("baseUrl");
const { autoProceed } = uppyOptions;
const uploadConfig = filesHandler
  ? await resolveApiEndpoint(filesHandler.fileUploadUrlFind, apiClient)
  : undefined;

const uppy = new Uppy({
  ...uppyOptions,
});
uppy.on("upload-success", (file) => {
  console.log("upload success done");
  if (!file) return;
  const path = `${file.meta.bucketName}/${file.name}`;
  if (!path.length) return;
  if (isMultiple) {
    const currentList = Array.isArray(node._value)
      ? node._value.filter((f) => f.length > 0)
      : [];
    node.input([...currentList, path]);
  } else {
    node.input(path);
  }
});

uppy.on("file-added", (file) => {
  if (!file) return;
  const currentMeta = file.meta;
  if (currentMeta.isInitial) return;
  uppy.setFileMeta(file.id, {
    bucketName: bucketName,
    objectName: file.name!,
    contentType: file.type!,
  });
});

uppy.on("file-removed", (file) => {
  const { meta } = file;
  if (!meta.isGallery && autoProceed) {
    if (filesHandler?.fileDeleteByBucket) {
      resolveApiEndpoint(filesHandler.fileDeleteByBucket, apiClient, {
        bucketName: meta.bucketName,
        records: [meta.objectName],
      })
        .then(() => {
          console.log("file removed successfully");
        })
        .catch((e) => {
          console.error("file remove failur", e);
        });
      console.log("should remove this file from the api");
    }
  }
  const path = `${file.meta.bucketName}/${file.name}`;
  if (isMultiple) {
    const filtered = Array.isArray(node._value)
      ? node._value.filter((v) => v !== path)
      : [];
    node.input(filtered);
  } else {
    node.input("");
  }
});

uppy.use(Compressor);
uppy.use(Tus<InputUploadMeta, TusBody>, {
  endpoint: uploadConfig?.uploadUrl || "",
  chunkSize: 6 * 1024 * 1024,
  uploadDataDuringCreation: true,
  removeFingerprintOnSuccess: true,
  retryDelays: [0, 3000, 5000, 10000, 20000],
  headers: {
    Authorization: `Bearer ${uploadConfig?.token || ""}`,
    "x-upsert": "true",
  },
  onProgress: (uploaded, total) => {
    const percent = ((uploaded / total) * 100).toFixed(2);
    console.log(`${uploaded}/${total} (${percent}%)`);
  },
  ...tusOptions,
});

if (!hideSelectFromGallery)
  uppy.use(GallerySelectPlugin, {
    defaultSelected: Array.isArray(node._value)
      ? (node._value as string[])
      : [node._value as string],
    baseUrl,
    bucketName,
    fallbackImage,
    listEndpoint: async () => {
      if (!filesHandler) return [];
      const response = await resolveApiEndpoint(
        filesHandler.galleryListEndpoint,
        apiClient,
        { filters: { bucketId: bucketName } },
      );
      return response.records.map((r: { name: string }) => r.name);
    },
    ...galleryOptions,
  });

uppy.use(ImageEditor, { quality: 0.8, ...imageEditorOptions });

node.context!._uppyPrepareUpload = async () => {
  if (!autoProceed && uppy.getFiles().some((f) => !f.progress.uploadComplete)) {
    await uppy.upload();
  }
};
const themName = computed(() =>
  document.documentElement.classList.contains("dark") ? "dark" : "light",
);
onBeforeUnmount(() => {
  uppy.destroy();
});
// const plugins = computed(() =>
//   hideSelectFromGallery ? [] : ["GallerySelectPlugin"],
// );
</script>

<template>
  <Dashboard
    :uppy="uppy"
    :props="{
      theme: themName,
      showRemoveButtonAfterComplete: true,
      proudlyDisplayPoweredByUppy: false,
      hideUploadButton: true,
      metaFields: [
        { id: 'name', name: 'Name', placeholder: 'file name' },
        { id: 'objectName', name: 'objectName', placeholder: 'objectName' },
        { id: 'contentType', name: 'contentType', placeholder: 'contentType' },
        { id: 'bucketName', name: 'bucketName', placeholder: 'bucketName' },
        {
          id: 'caption',
          name: 'Caption',
          placeholder: 'describe what the image is about',
        },
      ],
      ...dashboardOptions,
    }"
  />
</template>
