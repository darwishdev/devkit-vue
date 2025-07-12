import type {
  AppFormSections,
  BucketCreateUpdateRequest,
} from "@devkitvue/config";
export const bucketInput = {
  $formkit: "devkitDropdown",
  useButtons: true,
  options: "bucketList",
  responseOptionsKey: "buckets",
  optionValue: "id",
  optionLabel: "name",
  validation: "required",
  prefixIcon: "tools",
  showClear: true,
  outerClass: "col-12 sm:col-6 md:col-3",
  name: "bucketId",
  placeholder: "buckets",
};
export const bucketsForm: AppFormSections<BucketCreateUpdateRequest> = {
  bucket_info: {
    isTitleHidden: true,
    isTransparent: true,
    inputs: [
      {
        $formkit: "text",
        prefixIcon: "tools",
        outerClass: "col-12 sm:col-6 md:col-5",
        name: "bucketName",
        validation: "required",
        placeholder: "bucketName",
        label: "bucketName",
      },
      {
        $formkit: "text",
        prefixIcon: "tools",
        outerClass: "col-12 sm:col-6 md:col-5",
        name: "fileSizeLimit",
        placeholder: "fileSizeLimit",
        label: "fileSizeLimit",
      },
      {
        $formkit: "devkitDropdown",
        options: [{ label: "image/webp", value: "image/webp" }],

        optionValue: "label",
        optionLabel: "value",
        multiple: true,
        prefixIcon: "tools",
        outerClass: "col-12 sm:col-6 md:col-5",
        name: "allowedFileTypes",
        placeholder: "allowedFileTypes",
        label: "allowedFileTypes",
      },
      {
        $formkit: "checkbox",
        prefixIcon: "tools",
        outerClass: "col-12 sm:col-6 md:col-5",
        name: "isPulic",
        value: true,
        placeholder: "isPulic",
        label: "userPassword",
      },
    ],
  },
};
