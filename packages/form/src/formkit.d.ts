/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropType, type FormKitInputs } from "@formkit/inputs";
import {
  DropdownContext,
  InputDropdownSlots,
  InputUploadContext,
} from "./app/appform/inputs/types";
declare module "@formkit/inputs" {
  interface FormKitInputProps<Props extends FormKitInputs<Props>> {
    // This key and the `type` should match:
    devkitDropdown: {
      type: "devkitDropdown";
    } & Omit<DropdownContext<any, any, any, any>, "node" | "slots" | "_value">;
    devkitUpload: {
      type: "devkitUpload";
    } & Omit<InputUploadContext<any>, "node" | "slots" | "_value">;
  }
  interface FormKitInputSlots<Props extends FormKitInputs<Props>> {
    devkitDropdown: InputDropdownSlots<
      PropType<Props, "multiple"> extends true ? "multi" : "single"
    >;
  }
}
