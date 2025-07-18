import { createInput, defaultConfig, DefaultConfigOptions } from "@formkit/vue";
import type {
  FormKitNode,
  FormKitPlugin,
  FormKitSectionsSchema,
} from "@formkit/core";
import { DependencyManagerPlugin, OptionsGetterPlugin } from "./OptionsGetter";
import {
  DatePicker,
  Upload,
  DropDown,
  InputIcon,
  ToggleCollection,
} from "../inputs";
import { genesisIcons } from "@formkit/icons";
// import InputIcon from "../inputs/InputIcon.vue";
const isCheckboxAndRadioMultiple: FormKitPlugin = (node: FormKitNode) =>
  (node.props.type === "checkbox" || node.props.type === "radio") &&
  node.props.options;
const addAsteriskPlugin: FormKitPlugin = (node) => {
  node.on("created", () => {
    const isRequired = node.props.parsedRules.some(
      (rule: { name: string }) => rule.name === "required",
    );
    if (!isRequired || !node.props) return;
    if (!node.props.definition) return;
    const isMultiOption = isCheckboxAndRadioMultiple(node);
    node.props.definition.schemaMemoKey = `required_${isMultiOption ? "multi_" : ""}${node.props.definition.schemaMemoKey}`;
    const schemaFn = node.props.definition.schema;
    node.props.definition.schema = (
      sectionsSchema: FormKitSectionsSchema = {},
    ) => {
      if (isRequired) {
        if (isMultiOption) {
          sectionsSchema.legend = {
            children: ["$label", "*"],
          };
        } else {
          sectionsSchema.label = {
            children: ["$label", "*"],
          };
        }
      }
      if (typeof schemaFn === "function") {
        return schemaFn(sectionsSchema);
      }
      return schemaFn ?? [];
    };
  });
};
const scrollToErrors = (node: FormKitNode) => {
  if (node.props.type === "form") {
    function scrollTo(node: FormKitNode) {
      if (!node.props.id) return;
      const el = document.getElementById(node.props.id);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }

    function scrollToErrors() {
      node.walk((child) => {
        // Check if this child has errors
        if (child.ledger.value("blocking") || child.ledger.value("errors")) {
          // We found an input with validation errors
          scrollTo(child);
          // Stop searching
          return false;
        }
      }, true);
    }

    const onSubmitInvalid = node.props.onSubmitInvalid;
    node.props.onSubmitInvalid = () => {
      onSubmitInvalid(node);
      scrollToErrors();
    };
    node.on("unsettled:errors", scrollToErrors);
  }
  return false;
};
const formKitConfig = (options: DefaultConfigOptions) => {
  const plugins: FormKitPlugin[] = [
    DependencyManagerPlugin,
    scrollToErrors,
    addAsteriskPlugin,
    // FormDataGetterPlugin,
    OptionsGetterPlugin,
  ];
  const fileUploadPropKeys = [
    "bucketName",
    "hideSelectFromGallery",
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
    "useGroup",
    "options",
    "cacheKey",
    "cacheTimeout",
    "createRoute",
    "useLazy",
    "convertToFlat",
    "dependsOn",
    "requestPropertyName",
    "responseOptionsKey",
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
    "unstyled",
  ];
  const singleDropdownProps = [
    ...commonDropdownProps,
    "editable",
    "inputStyle",
    "iconKey",
    "pt",
    "inputClass",
    "labelId",
    "labelStyle",
    "labelClass",
    "useButtons",
    "multiple",
    "selectOnFocus",
    "checkmark",
  ];

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
  const dropdownInput = createInput(DropDown, {
    props: singleDropdownProps,
  });

  const iconInput = createInput(InputIcon, {
    props: singleDropdownProps,
  });

  const toggleCollectionInput = createInput(ToggleCollection, {
    props: [
      ...singleDropdownProps,
      "dataTableProps",
      "useCheckBox",
      "useGroup",
      "groupByKey",
    ],
  });

  const datePickerInput = createInput(DatePicker, {
    props: datepickerContextKeys,
  });

  const uploadInput = createInput(Upload, {
    props: ["bucketName", "filesHandler", ...fileUploadPropKeys],
  });

  const inputs = {
    devkitDropdown: dropdownInput,
    devkitDatepicker: datePickerInput,
    devkitUpload: uploadInput,
    devkitIcon: iconInput,
    devkitToggleCollection: toggleCollectionInput,
  };
  return defaultConfig({
    ...options,
    inputs: { ...inputs, ...options.inputs },
    icons: {
      ...genesisIcons,
    },
    rules: {
      email_or_phone: (node) => {
        if (!node.value) return false;
        if (typeof node.value != "string") return false;

        const value = String(node.value ?? "").trim();
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        const egyptMobileRegex =
          /^(?:0|(?:\+?20|0020))[ -]?1[0125](?:[ -]?\d){8}$/;

        /* Optional Saudi example branch (+966 11 123 4567).
       Remove if you only want Egyptian numbers.                */
        const saudiMobileRegex = /^\+?966[ -]?\d{1,2}[ -]?\d{3}[ -]?\d{4}$/;
        return (
          emailRegex.test(value) ||
          egyptMobileRegex.test(value) ||
          saudiMobileRegex.test(value)
        );
      },
    },
    plugins: !options.plugins ? plugins : [...plugins, ...options.plugins],
  });
};
export default formKitConfig;
