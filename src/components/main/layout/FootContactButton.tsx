"use client";
// context
import { useContactModal } from "../shared/ContactModal";
const FooterContactButton = () => {
	const { onOpenChange } = useContactModal();
	return (
		<div className="cursor-pointer hover:text-orange-600 transition-all">
			<div onClick={onOpenChange}>
				<i aria-hidden className="fa-solid fa-envelope fa-2xl" />
			</div>
		</div>
	);
};

export default FooterContactButton;
