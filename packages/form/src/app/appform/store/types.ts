//import type { AppFormOptions, StringUnknownRecord } from "@/pkg/types/types"
//
//import type { ComputedRef, Ref } from "vue"
//import type { Store } from "pinia"
//export type AppFormState<TReq extends StringUnknownRecord> = {
//  formValueRef: Ref<StringUnknownRecord>
//  formElementRef: Ref<any>
//  initialFormValue: StringUnknownRecord
//  formOptions: AppFormOptions
//}
//export type AppFormGetters = {
//  formValueString: ComputedRef<string>
//}
//export type AppFormActions<TKey extends string,
//  TFormRequest extends StringUnknownRecord = StringUnknownRecord,
//  TApiRequest extends StringUnknownRecord = StringUnknownRecord,
//  TApiResponse extends StringUnknownRecord = StringUnknownRecord,
//  TFindRequestPropName extends string | undefined = 'recordId',
//  TFindResponsePropName extends string | undefined = 'request',
//  TFindCallbakResponse = unknown,
//  TCallbakResponse = unknown> = {
//    validate: () => void
//  }
//
//export type AppFormStore<
//  TKey extends string,
//  TFormRequest extends StringUnknownRecord = StringUnknownRecord,
//  TApiRequest extends StringUnknownRecord = StringUnknownRecord,
//  TApiResponse extends StringUnknownRecord = StringUnknownRecord,
//  TFindRequestPropName extends string | undefined = 'recordId',
//  TFindResponsePropName extends string | undefined = 'request',
//  TFindCallbakResponse = unknown,
//  TCallbakResponse = unknown
//> = Store<
//  string,
//  Pick<AppFormState<TApiRequest>, keyof AppFormState<TApiRequest>>,
//  Pick<AppFormGetters, keyof AppFormGetters>,
//  Pick<AppFormActions<TKey, TFormRequest, TApiRequest, TApiResponse, TFindRequestPropName, TFindResponsePropName, TFindCallbakResponse, TCallbakResponse>, keyof AppFormActions<TKey, TFormRequest, TApiRequest, TApiResponse, TFindRequestPropName, TFindResponsePropName, TFindCallbakResponse, TCallbakResponse>>
//>

