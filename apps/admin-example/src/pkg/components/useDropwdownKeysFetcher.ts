export function useDropdownKeysFetcher<
  TOption extends Record<string, unknown>,
  TGroupOption extends Record<string, unknown> | undefined,
  TValue = unknown,
>(context: {
  labelKey?: keyof TOption;
  valueKey?: keyof TOption;
  noteKey?: keyof TOption;
  iconKey?: keyof TOption;
  groupItemsKey?: keyof TGroupOption;
  groupNoteKey?: keyof TGroupOption;
  groupNameKey?: keyof TGroupOption;
}) {
  const {
    labelKey = "label",
    valueKey = "value",
    noteKey = "note",
    iconKey = "icon",
    groupItemsKey = "items" as keyof TGroupOption,
    groupNoteKey = "groupNote" as keyof TGroupOption,
    groupNameKey = "groupName" as keyof TGroupOption,
  } = context;

  const getLabel = (option: TOption): string =>
    (option[labelKey] as string) || "";

  const getValue = (option: TOption): TValue => option[valueKey] as TValue;

  const getNote = (option: TOption): string =>
    (option[noteKey] as string) || "";

  const getIcon = (option: TOption): string =>
    (option[iconKey] as string) || "";

  const getGroupItems = (group: TGroupOption): TOption[] =>
    (group![groupItemsKey] as TOption[]) || [];

  const getGroupNote = (group: TGroupOption): string =>
    (group![groupNoteKey] as string) || "";

  const getGroupName = (group: TGroupOption): string =>
    (group![groupNameKey] as string) || "";

  return {
    getLabel,
    getValue,
    getNote,
    getIcon,
    getGroupItems,
    getGroupNote,
    getGroupName,
  };
}
