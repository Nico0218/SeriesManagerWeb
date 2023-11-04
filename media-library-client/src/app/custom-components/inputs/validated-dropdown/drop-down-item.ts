export default interface DropDownItem {
	label: string;
	value: string | number | readonly string[] | undefined;
	isSubheader?: boolean;
}
