<script setup lang="ts" generic="TApi extends Record<string, Function>">
import { ref, inject, type VNode, h } from "vue";
import {
  type DatalistStore,
  Datalist,
  useDatalistStoreWithProps,
  type DatalistProps,
} from "@devkitvue/datalist";
import { bucketInput, bucketsForm } from "./schemas";
import type { FilesHandler, StringUnknownRecord } from "@devkitvue/config";
import { useDialog } from "primevue";
import type {
  BucketCreateUpdateRequest,
  GalleryListRequest,
  FileObject,
  GalleryListResponse,
} from "@devkitvue/config";
import { useI18n } from "vue-i18n";
import { useFormKitNodeById } from "@formkit/vue";
import { AppForm } from "@devkitvue/form";
const fileInput = ref<HTMLInputElement | null>(null);
const filesHandler = inject<FilesHandler<TApi>>("filesHandler");
const formElementNode = useFormKitNodeById("files-filter-form");

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
}>();
const { t } = useI18n();
const datalistProps:
  | DatalistProps<
      TApi,
      GalleryListRequest,
      FileObject,
      GalleryListRequest,
      GalleryListResponse,
      StringUnknownRecord
    >
  | undefined = !filesHandler
  ? undefined
  : {
      context: {
        datalistKey: "files",
        hideShowDeleted: true,
        title: "files",
        formSections: {
          upload: {
            inputs: [
              {
                $formkit: "devkitUpload",
                prefixIcon: "search",
                bucketName: "abchotels",
                isMultiple: true,
                hideSelectFromGallery: true,
                dashboardOptions: {},
                outerClass: "col-span-2",
                name: "fileUpload",
                label: t("file"),
              },
            ],
          },
        },
        gridConfig: {
          gridType: "flex",
          gap: 2,
          columns: 6,
        },
        rowIdentifier: "id",
        filters: props.bucketName ? undefined : [bucketInput],
        isSelectionHidden: props.isSelectionHidden,
        requestMapper: props.bucketName
          ? (req) => {
              return {
                filters: {
                  ...req.filters,
                  bucketId: (props.bucketName as string) || "images",
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
// const bucketName = computed(() => {
//   if (props.bucketName) return props.bucketName;
//   if (!datalistStore) return "";
//   const filtersFormValue = datalistStore.filtersFormStore.formValue;
//   if (!filtersFormValue || !("bucketId" in filtersFormValue)) return "";
//   return filtersFormValue.bucketId as string;
// });
const createSubmitted = (value: StringUnknownRecord) => {
  if (!datalistStore) return;
  //datalistStore.filtersFormStore.refetchDropdownInput("bucketId");
  console.log("submitted value is ", value);
};
const dialog = useDialog();
const buckerCreateDialogOpen = () => {
  dialog.open(
    h(AppForm, {
      context: {
        formKey: "bucketCreate",
        sections: bucketsForm,
        title: "bucker create",
        invalidateCaches: ["bucketId", "files"],
        submitHandler: {
          endpoint: "bucketCreateUpdate",
          callback: (_: unknown) => refetchDropdownInput(),
        },
      },
    }),
  );
  console.log("should open update");
};
const refetchDropdownInput = async () => {
  if (!formElementNode.value) return;
  const node = formElementNode.value.find("bucketId", "name");
  if (!node) return;
  if ("forceReload" in node.props) {
    node.props.forceReload();
  }
};
</script>
<template>
  <div v-if="!filesHandler || !datalistProps">
    files handler is not passed on config
  </div>
  <div v-else class="buckets file-manager">
    <Datalist
      :context="datalistProps.context"
      @create:submited="createSubmitted"
    >
      <template #card="{ data }">
        <slot name="card" :data="data as FileObject">
          <AppImage
            :src="data.name"
            class="rounded bg-gray mb-2 gallery-image"
          />
        </slot>
      </template>
      <template #globalActionsStartAppend>
        <AppBtn :action="buckerCreateDialogOpen" label="create new bucket" />
      </template>
    </Datalist>
  </div>
</template>
<style>
.file-manager {
  .p-datatable-tbody {
    tr {
      position: relative;
      td {
        --tw-border-opacity: 0;
        padding: 0;
        button {
          padding: 0;
          span {
            display: none;
          }
        }
        .gallery-image {
          img {
            margin-bottom: 0.5rem;
            border-radius: 8px;
          }
        }
      }
      td:first-child,
      td:last-child {
        position: absolute;
        z-index: 12;
        top: 2rem;
      }
      td:first-child {
        left: 1rem;
      }
      td:last-child {
        right: 1rem;
        inset-inline-end: 1rem !important;
        > div.d-flex {
          background: var(--glass);
          border-radius: 2px;
          padding: 2px;
        }
      }
    }
  }
}
</style>
