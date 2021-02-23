export function capitalize(string: string) {
	const firstLetter = string.slice(0, 1);
	const rest = string.slice(1);
	return firstLetter.toLocaleUpperCase() + rest.toLocaleLowerCase();
}
