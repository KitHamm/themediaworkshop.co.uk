export default function getSevenDays() {
	const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	const today = new Date();
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const day = new Date(today);
		day.setDate(today.getDate() - i);
		return daysOfWeek[day.getDay()];
	}).reverse();
	return last7Days;
}
