import type { FormKitNode } from '@formkit/core';
export type FormKitInputContext<V = unknown> = {
	node: FormKitNode<V>
	_value: V
	slots: any
}
export type InputEmits = {
	(e: 'valueChange', value: unknown): void
}

