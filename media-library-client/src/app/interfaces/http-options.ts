export default interface HttpOptions {
	success?: (response?: any) => void;
	error?: (data: any) => void;
}
