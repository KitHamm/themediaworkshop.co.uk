export default function handleChevronOnScroll(chevron: HTMLDivElement) {
	if (chevron) {
		chevron.classList.replace("opacity-100", "opacity-0");
	}
}
