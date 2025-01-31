export function inPaginationRange(
	index: number,
	page: number,
	itemsPerPage: number
): boolean {
	return (
		index > page * itemsPerPage - (itemsPerPage + 1) &&
		index < page * itemsPerPage
	);
}
