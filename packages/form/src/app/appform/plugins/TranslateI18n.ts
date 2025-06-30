// import { FormKitPlugin, FormKitNode } from "@formkit/core";
// import { useI18n } from "vue-i18n";
//
// /**
//  * Auto-translates `label`, `placeholder`, and `legend` keys
//  * using vue-i18n.  Works once on creation, on prop changes,
//  * and whenever the active locale switches.
//  */
// const translateI18nPlugin: FormKitPlugin = (node: FormKitNode) => {
//   const { t } = useI18n();
//   console.log("admin here", t("navigationBarId"), node.props.label);
//   if (node.props.label && typeof node.props.label === "string")
//     t(node.props.label);
//   if (node.props.placeholder && typeof node.props.label === "string")
//     t(node.props.placeholder);
// };
//
// export default translateI18nPlugin;
