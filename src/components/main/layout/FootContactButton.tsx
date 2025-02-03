"use client";
// context
import { useContactModal } from "../shared/ContactModal";
const FooterContactButton = () => {
	const { onOpenChange } = useContactModal();
	return (
		<button
			className="cursor-pointer hover:text-orange-600 transition-all"
			onClick={onOpenChange}
		>
			<i aria-hidden className="fa-solid fa-envelope fa-2xl" />
		</button>
	);
};

export default FooterContactButton;
