"use client";

import updatePageOrder from "@/server/pageActions/updatePageId";

const PageOrderButtons = ({
	pageId,
	hideFirst,
	hideLast,
}: Readonly<{ pageId: number; hideFirst: boolean; hideLast: boolean }>) => {
	const onMove = async (up: boolean) => {
		const newId = up ? pageId - 1 : pageId + 1;
		try {
			const res = await updatePageOrder(pageId, newId);
			if (!res.success) {
				console.log(res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center">
			<button
				disabled={hideFirst}
				onClick={() => onMove(true)}
				className="hover:text-orange-600 transition-all disabled:text-neutral-600 disabled:cursor-not-allowed"
			>
				<i className="fa-solid fa-caret-up fa-xl" />
			</button>
			<button
				disabled={hideLast}
				onClick={() => onMove(false)}
				className="hover:text-orange-600 transition-all disabled:text-neutral-600 disabled:cursor-not-allowed"
			>
				<i className="fa-solid fa-caret-down fa-xl" />
			</button>
		</div>
	);
};

export default PageOrderButtons;
