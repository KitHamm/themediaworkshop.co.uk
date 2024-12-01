"use client";

import { ExtendedPage, PageFormType } from "@/lib/types";
import { createContext, useEffect } from "react";
import {
    useForm,
    UseFormGetValues,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
    UseFormSetValue,
} from "react-hook-form";

type HeaderStateContextType = {
    register: UseFormRegister<PageFormType>;
    handleSubmit: UseFormHandleSubmit<PageFormType>;
    isDirty: boolean;
    getValues: UseFormGetValues<PageFormType>;
    setValue: UseFormSetValue<PageFormType>;
    reset: UseFormReset<PageFormType>;
    video1: string;
    video2: string;
    backgroundVideo: string;
    description: string;
    handleReset: () => void;
};

export const HeaderStateContext = createContext<HeaderStateContextType>(
    {} as HeaderStateContextType
);

export default function HeaderStateProvider({
    children,

    data,
}: {
    children: React.ReactNode;
    data: ExtendedPage;
}) {
    const pageForm = useForm<PageFormType>({
        defaultValues: {
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
        },
    });
    const {
        register,
        handleSubmit,
        formState: { isDirty },
        getValues,
        setValue,
        reset,
        watch,
    } = pageForm;

    useEffect(() => {
        handleReset();
    }, [data]);

    function handleReset() {
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
    }

    const video1 = watch("video1");
    const video2 = watch("video2");
    const backgroundVideo = watch("backgroundVideo");
    const description = watch("description");

    return (
        <HeaderStateContext.Provider
            value={{
                register,
                handleSubmit,
                isDirty,
                getValues,
                setValue,
                reset,
                video1,
                video2,
                backgroundVideo,
                description,
                handleReset,
            }}>
            {children}
        </HeaderStateContext.Provider>
    );
}
