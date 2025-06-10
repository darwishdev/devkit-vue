
import { createInput, defaultConfig, DefaultConfigOptions } from '@formkit/vue'
import type { FormKitPlugin } from '@formkit/core';
import { DependencyManagerPlugin, OptionsGetterPlugin } from './OptionsGetter';
import Datepicker from '../inputs/Datepicker.vue';
import { Upload } from '../inputs';
import Dropdown from '../inputs/Dropdown.vue';
const isCheckboxAndRadioMultiple: FormKitPlugin = (node: any) => (node.props.type === 'checkbox' || node.props.type === 'radio') && node.props.options
const addAsteriskPlugin: FormKitPlugin = (node) => {
  node.on('created', () => {
    const isRequired = node.props.parsedRules.some((rule: any) => rule.name === 'required');
    if (!isRequired || !node.props) return
    if (!node.props.definition) return
    const isMultiOption = isCheckboxAndRadioMultiple(node)
    node.props.definition.schemaMemoKey = `required_${isMultiOption ? 'multi_' : ""}${node.props.definition.schemaMemoKey}`
    const schemaFn = node.props.definition.schema;
    node.props.definition.schema = (sectionsSchema: any = {}) => {
      if (isRequired) {
        if (isMultiOption) {
          sectionsSchema.legend = {
            children: ['$label', '*']
          }
        } else {
          sectionsSchema.label = {
            children: ['$label', '*']
          }
        }
      }
      if (typeof schemaFn === 'function') {
        return schemaFn(sectionsSchema);
      }
      return schemaFn ?? [];
    }
  })
}
const formKitConfig = (options: DefaultConfigOptions) => {
  const plugins: FormKitPlugin[] = [
    DependencyManagerPlugin,
    addAsteriskPlugin,
    // FormDataGetterPlugin,
    OptionsGetterPlugin,
  ]
  const fileUploadPropKeys = [
    "bucketName",
    "baseUrl",
    "fallbackImageUrl",
    "isMultiple",
    "uppyOptions",
    "dashboardOptions",
    "filesHandler",
    "tusOptions",
    "galleryOptions",
    "imageEditorOptions",
  ];
  const commonDropdownProps = [
    "options",
    "cacheKey",
    "cacheTimeout",
    "createRoute",
    "useLazy",
    "convertToFlat",
    "dependsOn",
    "requestPropertyName",
    'responseOptionsKey',
    "requestMapper",
    "bypassCache",
    "optionsMapper",
    "debounceInMilliSeconds",

    // Keys from FormKitInputContext
    "node",

    // Common props shared between single and multi select
    "modelValue",
    "defaultValue",
    "name",
    "options",
    "optionLabel",
    "optionValue",
    "optionDisabled",
    "optionGroupLabel",
    "optionGroupChildren",
    "scrollHeight",
    "filter",
    "filterPlaceholder",
    "filterLocale",
    "filterMatchMode",
    "filterFields",
    "placeholder",
    "size",
    "invalid",
    "disabled",
    "variant",
    "dataKey",
    "showClear",
    "fluid",
    "inputId",
    "panelStyle",
    "panelClass",
    "overlayStyle",
    "overlayClass",
    "appendTo",
    "loading",
    "clearIcon",
    "dropdownIcon",
    "filterIcon",
    "loadingIcon",
    "resetFilterOnHide",
    "resetFilterOnClear",
    "virtualScrollerOptions",
    "autoOptionFocus",
    "autoFilterFocus",
    "focusOnHover",
    "highlightOnSelect",
    "filterMessage",
    "selectionMessage",
    "emptySelectionMessage",
    "emptyFilterMessage",
    "emptyMessage",
    "tabindex",
    "ariaLabel",
    "ariaLabelledby",
    "formControl",
    "dt",
    "pt",
    "ptOptions",
    "unstyled"
  ]
  const singleDropdownProps = [
    ...commonDropdownProps,
    "editable",
    "inputStyle",
    "inputClass",
    "labelId",
    "labelStyle",
    "labelClass",
    "useButtons",
    'multiple',
    "selectOnFocus",
    "checkmark",
  ]
  const multiDropdownProps = [
    ...commonDropdownProps,
    "display",
    "selectedItemsLabel",
    "maxSelectedLabels",

    "selectionLimit",
    "showToggleAll",
    "checkboxIcon",
    "removeTokenIcon",
    "chipIcon",
    "selectAll",
  ]
  const datepickerContextKeys = [
    "disabledDates", // from DatepickerContext
    "disabledDatesRequestPropertyName", // from DatepickerContext
    "disabledDatesResponsePropertyName", // from DatepickerContext
    "dsiabledDatesRequestMapper", // from DatepickerContext
    "dsiabledDatesResponseMapper", // from DatepickerContext
    "convertToNumber", // from DatepickerContext

    "defaultValue",
    "name",
    "selectionMode",
    "dateFormat",
    "inline",
    "showOtherMonths",
    "selectOtherMonths",
    "showIcon",
    "iconDisplay",
    "icon",
    "prevIcon",
    "nextIcon",
    "incrementIcon",
    "decrementIcon",
    "numberOfMonths",
    "responsiveOptions",
    "breakpoint",
    "view",
    "minDate",
    "maxDate",
    "disabledDates",
    "disabledDays",
    "maxDateCount",
    "showOnFocus",
    "autoZIndex",
    "baseZIndex",
    "showButtonBar",
    "shortYearCutoff",
    "showTime",
    "timeOnly",
    "hourFormat",
    "stepHour",
    "stepMinute",
    "stepSecond",
    "showSeconds",
    "hideOnDateTimeSelect",
    "hideOnRangeSelection",
    "timeSeparator",
    "showWeek",
    "manualInput",
    "size",
    "invalid",
    "disabled",
    "variant",
    "readonly",
    "placeholder",

    "appendTo",
    "id",
    "inputId",
    "inputStyle",
    "inputClass",
    "panelStyle",
    "panelClass",
    "todayButtonProps",
    "clearButtonProps",
    "navigatorButtonProps",
    "timepickerButtonProps",
    "fluid",
    "ariaLabelledby",
    "ariaLabel",
    "formControl",
    "dt",
    "pt",
    "ptOptions",
    "unstyled",
  ];
  const dropdownInput = createInput(Dropdown, {
    props: singleDropdownProps,
  })


  const datePickerInput = createInput(Datepicker, {
    props: datepickerContextKeys,
  })

  const uploadInput = createInput(Upload, {
    props: ['bucketName', 'filesHandler', ...fileUploadPropKeys],
  })

  const inputs = {
    'devkitDropdown': dropdownInput,
    'devkitDatepicker': datePickerInput,
    'devkitUpload': uploadInput,
  }
  return defaultConfig({
    ...options,
    inputs: { ...inputs, ...options.inputs },
    plugins: !options.plugins ? plugins : { ...plugins, ...options.plugins },
   
  })
}
export default formKitConfig
