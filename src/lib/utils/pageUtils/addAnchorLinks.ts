export default function addAnchorLinks(textEl: HTMLDivElement | null) {
	if (!textEl) return; // Early exit if textEl is not provided

	// Find all anchor elements within textEl (including all its descendants)
	const anchors = textEl.querySelectorAll<HTMLAnchorElement>("a");

	anchors.forEach((anchor) => {
		anchor.setAttribute("target", "_blank");
		anchor.setAttribute("rel", "noreferrer");
	});
}
