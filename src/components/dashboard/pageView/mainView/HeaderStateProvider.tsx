"use client";
// packages
import {
	useForm,
	UseFormGetValues,
	UseFormHandleSubmit,
	UseFormRegister,
	UseFormSetValue,
	UseFormWatch,
} from "react-hook-form";
import { createContext, useCallback, useContext, useEffect } from "react";
// functions
import { updatePage } from "@/server/pageActions/updatePage";
import { revalidateDashboard } from "@/server/revalidateDashboard";
// types
import { ExtendedPage, PageFormType } from "@/lib/types";

type HeaderStateContextType = {
	register: UseFormRegister<PageFormType>;
	handleSubmit: UseFormHandleSubmit<PageFormType>;
	isDirty: boolean;
	getValues: UseFormGetValues<PageFormType>;
	setValue: UseFormSetValue<PageFormType>;
	watch: UseFormWatch<PageFormType>;
	handleReset: () => void;
};

const HeaderStateContext = createContext<HeaderStateContextType>(
	{} as HeaderStateContextType
);

const HeaderStateProvider = ({
	children,
	data,
}: Readonly<{
	children: React.ReactNode;
	data: ExtendedPage;
}>) => {
	const {
		register,
		handleSubmit,
		formState: { isDirty },
		getValues,
		setValue,
		reset,
		watch,
	} = useForm<PageFormType>({
		defaultValues: {
			page: data.title,
			subTitle: data.subTitle ?? "",
			description: data.description ?? "",
			header: data.header ?? "",
			video1: data.video1 ?? "",
			video2: data.video2 ?? "",
			backgroundVideo: data.backgroundVideo ?? "",
			videoOneButtonText: data.videoOneButtonText ?? "",
			videoTwoButtonText: data.videoTwoButtonText ?? "",
		},
	});

	useEffect(() => {
		handleReset();
	}, [data]);

	const onSubmit = async (data: PageFormType) => {
		try {
			const res = await updatePage(data);
			if (res.success) {
				revalidateDashboard();
			} else {
				console.log("Error:", res.error);
			}
		} catch (error) {
			console.log("Unexpected error:", error);
		}
	};

	const handleReset = useCallback(() => {
		reset({
			page: data.title,
			subTitle: data.subTitle ? data.subTitle : "",
			description: data.description ? data.description : "",
			header: data.header ? data.header : "",
			video1: data.video1 ? data.video1 : "",
			video2: data.video2 ? data.video2 : "",
			backgroundVideo: data.backgroundVideo ? data.backgroundVideo : "",
			videoOneButtonText: data.videoOneButtonText
				? data.videoOneButtonText
				: "",
			videoTwoButtonText: data.videoTwoButtonText
				? data.videoTwoButtonText
				: "",
		});
	}, [data, reset]);

	const headerStateValue = useCallback(
		() => ({
			register,
			handleSubmit,
			isDirty,
			getValues,
			setValue,
			watch,
			handleReset,
		}),
		[
			register,
			handleSubmit,
			isDirty,
			getValues,
			setValue,
			watch,
			handleReset,
		]
	);

	return (
		<HeaderStateContext.Provider value={headerStateValue()}>
			<form onSubmit={handleSubmit(onSubmit)}>{children}</form>
		</HeaderStateContext.Provider>
	);
};

export const usePageHeaderState = () => useContext(HeaderStateContext);
export default HeaderStateProvider;
