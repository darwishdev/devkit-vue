<!-- <script setup lang="ts"> -->
<!-- import { inject, ComputedRef } from "vue"; -->
<!-- import { -->
<!--   FileObject, -->
<!--   GalleryListRequest, -->
<!--   GalleryListResponse, -->
<!-- } from "@/pkg/types/api_types"; -->
<!-- import { AppBtn, AppImage } from "@devkit/base-components"; -->
<!-- import { DynamicDialogInstance } from "primevue/dynamicdialogoptions"; -->
<!---->
<!-- const dialog = inject<ComputedRef<DynamicDialogInstance>>("dialogRef"); -->
<!-- const props = defineProps<{ -->
<!--   isSelectionHidden?: boolean; -->
<!--   bucketName?: string; -->
<!-- }>(); -->
<!-- const emit = defineEmits<{ -->
<!--   (e: "choose", file: FileObject[]): void; -->
<!-- }>(); -->
<!-- const chooseFile = (file: FileObject) => { -->
<!--   console.log("close", dialog); -->
<!--   if (!dialog) return; -->
<!--   dialog.value.close(); -->
<!--   emit("choose", [file]); -->
<!-- }; -->
<!-- const chooseFiles = ( -->
<!--   store: DatalistStore< -->
<!--     Record<string, Function>, -->
<!--     GalleryListRequest, -->
<!--     FileObject, -->
<!--     GalleryListRequest, -->
<!--     GalleryListResponse, -->
<!--     GalleryListRequest -->
<!--   >, -->
<!-- ) => { -->
<!--   console.log(store.modelSelectionRef); -->
<!--   console.log("close", dialog); -->
<!--   if (!dialog) return; -->
<!--   dialog.value.close(); -->
<!--   emit("choose", store.modelSelectionRef); -->
<!--   store.modelSelectionRef = []; -->
<!-- }; -->
<!-- </script> -->
<!-- <template> -->
<!--   <Suspense> -->
<!--     <FileManager v-bind="props"> -->
<!--       <template #actions> </template> -->
<!--       <template #globalActions="{ store }"> -->
<!--         <AppBtn :action="() => chooseFiles(store)" label="choose" /> -->
<!--       </template> -->
<!---->
<!--       <template #card="{ data }"> -->
<!--         <AppImage :width="150" :src="data.name" /> -->
<!--         {{ data.name }} -->
<!--         <AppBtn :action="() => chooseFile(data)" label="choose" /> -->
<!--       </template> -->
<!--     </FileManager> -->
<!--   </Suspense> -->
<!-- </template> -->
