export default function urlCombine(...urlParts: string[]) {
	let resultURL = '';
	for (let i = 0; i < urlParts.length; i++) {
		const part = urlParts[i];
		if (resultURL.endsWith('/')) {
			resultURL += part;
		} else if (i !== 0) {
			resultURL += `/${part}`;
		} else {
			resultURL += part;
		}
	}
	resultURL = resultURL.trim();
	if (resultURL.endsWith('/')) {
		return resultURL.substring(0, resultURL.length - 1);
	} else {
		return resultURL;
	}
}
