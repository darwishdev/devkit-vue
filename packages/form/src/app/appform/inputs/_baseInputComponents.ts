import type { FormKitNode } from '@formkit/core';
import { objectEntries } from '@vueuse/core';
import { h, VNode } from 'vue'
export const renderErr = (node: FormKitNode) => {
	if (!node.context) return
	if (!node.context.messages) return
	const [values] = objectEntries(node.context.messages)
	if (!values) return
	if (!values.length) return
	const errorMessages: VNode[] = []
	for (const [_, msg] of objectEntries(node.context.messages)) {
		if (msg.type != 'error') continue
		errorMessages.push(h(
			"p",
			{ class: "input-error text-red-500" },
			`Error: ${msg.value}`,
		))
	}
	return errorMessages;
}
export const renderLoading = (isLoading: boolean) => {
	if (isLoading) return
	return h("h2", "Loading...");
}
