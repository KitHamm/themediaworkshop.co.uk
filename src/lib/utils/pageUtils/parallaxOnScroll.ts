export default function parallaxOnScroll(
	headerImageContainerEl: HTMLDivElement,
	headerImageEl: HTMLImageElement,
	setParallaxValue: React.Dispatch<React.SetStateAction<number>>,
	setContainerHeight: React.Dispatch<React.SetStateAction<number>>
) {
	if (headerImageContainerEl && headerImageEl) {
		const containerHeight = headerImageContainerEl.offsetHeight;
		const imageHeight = headerImageEl.offsetHeight;
		setContainerHeight((imageHeight / 8) * 6);
		if (
			headerImageContainerEl.getBoundingClientRect().top <
				window.innerHeight &&
			headerImageContainerEl.getBoundingClientRect().top >
				0 - containerHeight
		) {
			setParallaxValue(
				0 -
					mapNumRange(
						headerImageContainerEl.getBoundingClientRect().top,
						window.innerHeight,
						0,
						imageHeight - containerHeight,
						0
					)
			);
		}
	}
}

export const mapNumRange = (
	num: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number
) => ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
