export const ObjectKeys = <T extends {}>(obj: T): (keyof T)[] => {
	return Object.keys(obj) as (keyof T)[];
}
export const ObjectEntries = <T extends Record<string, any>>(obj: T): [keyof T, T[keyof T]][] => {
	return Object.entries(obj) as [keyof T, T[keyof T]][]
}
export const AssertIsDefined: <T>(
	value: T | undefined,
	message?: string
) => asserts value is T = (value, message = "Value is undefined") => {
	if (value === undefined) {
		throw new Error(message);
	}
};

export const subtractRecords = <TRecord>(dataRef: TRecord[], modelSelectionRef: TRecord[], dataKey: keyof TRecord): TRecord[] => {
	const dataCopy = [...dataRef];
	const selectionIds = new Set(modelSelectionRef.map(item => item[dataKey]));
	return dataCopy.filter(item => !selectionIds.has(item[dataKey]));
};

export const deepMerge = <T extends Record<string, any>>(target: T, source?: Partial<T>): T => {
	if (!source) return target
	const result = { ...target }; // Start with a shallow copy of the target

	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			const targetValue = target[key];
			const sourceValue = source[key];

			if (
				typeof targetValue === 'object' &&
				targetValue !== null &&
				typeof sourceValue === 'object' &&
				sourceValue !== null &&
				!Array.isArray(targetValue) &&
				!Array.isArray(sourceValue)
			) {
				// Recursively merge nested objects
				result[key] = deepMerge(targetValue, sourceValue);
			} else {
				// Override with source value
				result[key] = sourceValue as T[Extract<keyof T, string>];
			}
		}
	}

	return result;
}