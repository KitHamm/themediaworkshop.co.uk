export default function addAnchorLinks(textEl: HTMLDivElement | null) {
	if (!textEl) return;
	const anchors = textEl.querySelectorAll<HTMLAnchorElement>("a");
	anchors.forEach((anchor) => {
		const url = anchor.href;

		if (!url.includes(window.location.hostname)) {
			anchor.setAttribute("target", "_blank");
			anchor.setAttribute("rel", "noreferrer");
		}
	});
}
