import DropDownItem from '../custom-components/inputs/validated-dropdown/drop-down-item';

export default function enumToDropDownItems(
	enumValues: any,
	createSpacesForCapitals?: boolean,
	exclusions?: string[]
) {
	const dropDownItems: DropDownItem[] = [];
	const createSpaces = (key: string) => {
		const result = key.replace(/([A-Z])/g, ' $1');
		return (result.charAt(0).toUpperCase() + result.slice(1)).trim();
	};

	const addDropDownItem = (key: string) => {
		const value = enumValues[key];
		dropDownItems.push({
			label: createSpacesForCapitals ? createSpaces(key) : key,
			value: value,
		});
	};
	for (const key in enumValues) {
		if (isNaN(Number.parseInt(key))) {
			if (Object.hasOwn(enumValues, key)) {
				if ((exclusions && !exclusions.find(f => f === key)) || !exclusions) {
					addDropDownItem(key);
				}
			}
		}
	}
	return dropDownItems;
}
