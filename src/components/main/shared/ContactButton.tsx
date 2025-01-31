"use client";
// context
import { useContactModal } from "./ContactModal";

const ContactButton = () => {
	const { onOpenChange } = useContactModal();
	return (
		<div id="homeButton">
			<button
				onClick={onOpenChange}
				className="transition-all hover:bg-opacity-0 hover:text-white border border-white bg-opacity-90 font-bold bg-white max-w-52 w-full xl:w-auto text-sm py-2 xl:px-8 xl:py-3 text-black"
			>
				CONTACT
			</button>
		</div>
	);
};

export default ContactButton;
