<script setup lang="ts">
import { AppDialogProps, AppDialogSlots } from "@/pkg/types/types";
import Message from "primevue/message";
import { inject } from "vue";
import { useI18n } from "vue-i18n";
const dialogRef = inject<{ value: { close: () => void } } | undefined>(
  "dialogRef",
  undefined,
);
const emit = defineEmits<{
  (e: "confirmed", dialog: { close: () => void }): void;
  (e: "close"): void;
}>();
const { errorRef } = defineProps<AppDialogProps>();
const { t } = useI18n();
defineSlots<AppDialogSlots>();

const close = () => {
  if (errorRef) {
    errorRef.value = "";
  }
  if (dialogRef) {
    dialogRef.value.close();
  }
  emit("close");
};
const confirm = () => {
  if (dialogRef?.value) {
    emit("confirmed", dialogRef.value);
  }
};
</script>
<template>
  <div class="app-dialog">
    <slot name="error">
      <div v-if="errorRef" class="my-2">
        <Message severity="error" v-if="errorRef.value">
          {{ t(errorRef.value) }}</Message
        >
      </div>
    </slot>
    <slot />
    <slot name="actions" :confirm="confirm" :close="close">
      <div class="actions flex gap-2 items-center">
        <slot name="confirm" :confirm="confirm">
          <AppBtn
            icon="check-line"
            :action="confirm"
            label="confirm"
            outlined
            class="success"
          />
        </slot>
        <slot name="cancel" :close="close">
          <AppBtn
            icon="close-line"
            :action="close"
            :label="t('cancel')"
            :outlined="true"
            severity="danger"
          />
        </slot>
      </div>
    </slot>
  </div>
</template>
