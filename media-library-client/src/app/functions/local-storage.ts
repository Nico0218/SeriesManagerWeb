export function getLocalStorageItem<T>(key: string): T | undefined {
	const localStoreData = window.localStorage.getItem(key) ?? undefined;
	if (localStoreData === undefined) return localStoreData;
	return JSON.parse(localStoreData) as T;
}

export const setLocalStorageItem = (key: string, value: unknown) => {
	if (value === undefined) {
		window.localStorage.removeItem(key);
	} else {
		window.localStorage.setItem(key, JSON.stringify(value));
	}
	window.dispatchEvent(new Event(`${key}-event`));
};

export const addLocalStorageEventListener = (key: string, callback: () => void) => {
	return window.addEventListener(`${key}-event`, callback);
};
