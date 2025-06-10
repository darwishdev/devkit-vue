<script lang="ts" setup generic="
TApi extends Record<string, Function>, 
TDisabledDatesReq extends StringUnknownRecord, 
TDisabledDatesResp extends StringUnknownRecord">
import { StringUnknownRecord } from '@devkit/apiclient';
import InputDatepicker from './InputDatepicker.vue'
import { InputDatepickerProps } from './types';
import { onErrorCaptured, ref } from 'vue';

import Message from 'primevue/message';
const props = defineProps<InputDatepickerProps<TApi, TDisabledDatesReq, TDisabledDatesResp>>()
const errRef = ref('')
onErrorCaptured((err: unknown) => {
	console.log("error capture", err)
	if (err instanceof Error) {
		errRef.value = err.message
	} else {
		errRef.value = 'An unexpected error occurred in the date picker';
	}
})

</script>
<template>
	<Suspense>
		<InputDatepicker v-bind="props" @valueChange="props.context.node.input" />
		<template #fallback>
			<Message v-if="errRef" severity="error">{{ errRef }}</Message>
			<Skeleton v-else height="2rem" class="mb-2"></Skeleton>
		</template>
	</Suspense>
</template>
