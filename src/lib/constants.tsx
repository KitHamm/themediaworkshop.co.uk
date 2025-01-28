export const FilePrefixList = [
	"HEADER",
	"VIDEO",
	"SEGHEAD",
	"SEGMENT",
	"STUDY",
	"LOGO",
	"THUMBNAIL",
];

export enum MediaType {
	SEGHEAD = "SEGHEAD",
	SEGMENT = "SEGMENT",
	STUDY = "STUDY",
	LOGO = "LOGO",
	THUMBNAIL = "THUMBNAIL",
	AVATAR = "AVATAR",
	VIDEO = "VIDEO",
	HEADER = "HEADER",
}

export const navLinks: {
	link: string;
	page: string;
	text: string;
	icon: string;
}[] = [
	{ link: "", page: "dashboard", text: "Dash", icon: "fa-solid fa-house" },
	{
		link: "/pages",
		page: "pages",
		text: "Pages",
		icon: "fa-regular fa-window-restore",
	},
	{
		link: "/media",
		page: "media",
		text: "Media",
		icon: "fa-regular fa-images",
	},
	{
		link: "/messages",
		page: "messages",
		text: "Msg",
		icon: "fa-regular fa-message",
	},
	{
		link: "/settings",
		page: "settings",
		text: "Settings",
		icon: "fa-solid fa-gear",
	},
];
