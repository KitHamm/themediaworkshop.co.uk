type Items = {
	name: string;
	createdAt: Date;
};
export function itemOrder(items: Items[], sortBy: string, orderBy: string) {
	const temp: Items[] = [...items];
	switch (sortBy) {
		case "date":
			if (orderBy === "desc") {
				temp.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() -
						new Date(a.createdAt).getTime()
				);
				return temp;
			} else {
				temp.sort(
					(a, b) =>
						new Date(a.createdAt).getTime() -
						new Date(b.createdAt).getTime()
				);
				return temp;
			}
		case "name":
			if (orderBy === "desc") {
				temp.sort((a, b) => b.name.localeCompare(a.name));
				return temp;
			} else {
				temp.sort((a, b) => a.name.localeCompare(b.name));
				return temp;
			}
		default:
			return temp;
	}
}
