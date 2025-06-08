<script setup lang="ts">
import { AppDialogProps, AppDialogSlots } from "@/pkg/types/types";
import Message from 'primevue/message';
import { inject } from "vue";
const dialogRef = inject("dialogRef") as any;
const emit = defineEmits<{
  confirmed: [dialog: { close: Function }]; // Keeping the existing emit type
  close: []; // Define "close" event with no arguments
}>();
const { errorRef } = defineProps<AppDialogProps>();
defineSlots<AppDialogSlots>();

const close = (e: any) => {
  if (errorRef) {
    errorRef.value = ''
  }

  dialogRef.value.close(e);
  emit("close");
};
const confirm = () => {
  emit("confirmed", dialogRef.value);
};
</script>
<template>
  <div class="app-dialog">
    <slot name="error">
      <div v-if="errorRef" class="my-2">
        <Message severity="error" v-if="errorRef.value"> {{ $t(errorRef.value) }}</Message>
      </div>
    </slot>
    <slot />
    <slot name="actions" :confirm="confirm" :close="close">
      <div class="actions">
        <slot name="confirm" :confirm="confirm">
          <AppBtn icon="health_check" :action="confirm" label="confirm" class="success" />
        </slot>
        <slot name="cancel" :close="close">
          <AppBtn icon="close" :action="close" label="canel" class="danger" />
        </slot>
      </div>
    </slot>
  </div>
</template>
