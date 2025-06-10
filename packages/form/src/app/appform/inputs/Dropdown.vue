<script lang="ts" setup generic="
    TApi extends Record<string, Function>,
    TOptionsReq extends StringUnknownRecord,
    TOptionsResp extends StringUnknownRecord = DropdownOptions,
    TComponentType extends 'single' | 'multi' | 'button' = 'single'
  ">
import { StringUnknownRecord } from "@devkit/apiclient";
import Select, { SelectProps } from "primevue/select";
import { h } from "vue";
import { MultiSelect, MultiSelectProps, SelectButton, SelectButtonProps, } from "primevue";
import { AppBtn, AppIcon } from "@devkit/base-components";
import { InputDropdownProps, DropdownOptions } from "./types";
import { renderErr, renderLoading } from "./_baseInputComponents";
const props =
	defineProps<InputDropdownProps<TApi, TOptionsReq, TOptionsResp, TComponentType>>();
const { context } = props
const emit = defineEmits<{
	(e: "valueChange", value: unknown): void;
}>();
const {
	options,
	dependsOn,
	createRoute,
	node,
	useLazy,
	hideReload,
} = context;
const getPrimevueProps = () => {
	const primevuePops: typeof context.useButtons extends true ? SelectButtonProps : typeof context.multiple extends true ? MultiSelectProps : SelectProps = { ...context };
	if (Array.isArray(options)) {
		return primevuePops
	}
	primevuePops.optionLabel = primevuePops.optionLabel || "label";
	primevuePops.optionValue = primevuePops.optionValue
		? primevuePops.optionValue
		: context.convertToFlat
			? primevuePops.optionLabel
			: "value";
	if ('placeholder' in primevuePops) primevuePops.placeholder = context.node.props.placeholder;
	return primevuePops
}
const onBeforeShow = () => {
	if (dependsOn) {
		if (node.props.lastParentValue == node.props.getParentFormValue()) {
			return
		}
		node.props.optionsFetcher();
		return
	}
	if (!useLazy || !options || node.props.optionsArray.value.length)
		return;
	node.props.optionsFetcher();
};
const onValueChange = (value: any) => {
	node.input(value)
	emit('valueChange', value)
};
const forceReload = () => {
	node.props.forceReload();
};
const renderOption = (optionProps: { option: any, selected: boolean, index: number }) => {
	if (node.props.isLoading.value || node.props.errorMessageRef.value) return
	if (typeof context.slots.option == 'function') return context.slots.option(optionProps)
	const { selected, option } = optionProps
	return h(
		"div",
		{
			class: `flex items-center ${selected ? "selected" : ""}`,
		},
		[
			option.icon ? h(AppIcon, { icon: option.icon }) : undefined,
			typeof selectProps.optionLabel === "string" &&
				option[selectProps.optionLabel]
				? h("span", option[selectProps.optionLabel])
				: undefined,
			"note" in option ? h("span", option["note"]) : undefined,
		],
	)
}
const selectProps = getPrimevueProps();
const renderInputDropdown = () => {
	return h(
		context.useButtons ? SelectButton : context.multiple ? MultiSelect : Select,
		{
			...selectProps,
			pt: { overlay: 'z-2000' },
			modelValue: context._value as any,
			"onUpdate:modelValue": onValueChange,
			loading: node.props.isLoading.value,
			options: node.props.optionsArray?.value || [],
			onBeforeShow,
		},
		{
			...context.slots,
			header: (_: any) =>
				h("div", { class: "select-header" }, [
					!hideReload
						? h(AppBtn, {
							action: forceReload,
							label: "reload",
							icon: "reload",
						})
						: undefined,
					createRoute
						? h(AppBtn, { action: createRoute, label: "create", icon: "plus" })
						: undefined,
				]),
			option: (optionProps: { option: any; selected: boolean, index: number }) => [
				renderLoading(node.props.isLoading), renderErr(node), renderOption(optionProps)
			],
			empty: () => [
				renderLoading(node.props.isLoading),
				renderErr(node),
				h("h2", "No options available")
			]
		},
	);
};

</script>
<template>
	<component :is="renderInputDropdown" />
</template>
