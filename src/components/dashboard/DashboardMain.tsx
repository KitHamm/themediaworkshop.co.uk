"use client";

// Library Components
import { NextUIProvider } from "@nextui-org/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";

// Components
import DashboardView from "./Dashboard";
import Messages from "./Message";
import Settings from "./Settings";
import Media from "./Media";
import Pages from "./Pages/Pages";

// Next Components
import { useSearchParams } from "next/navigation";

// React Components
import { useState, useEffect, createContext, useRef } from "react";

// Types
import {
    Message,
    Page,
    Segment,
    CaseStudy,
    emailHost,
    Videos,
    Images,
    Logos,
    serviceRequest,
} from "@prisma/client";
import { Notification, NotificationProviderType } from "@/lib/types";

import NotificationCard from "./NotificationCard";
import { updateUserActivation } from "@/server/userActions/userActivation";
import { UserWithoutPassword } from "@/lib/types";
import { Session } from "next-auth";
import DashboardStateProvider from "./DashboardStateProvider";

export const NotificationsContext = createContext<NotificationProviderType>(
    {} as any
);

export default function DashboardMain(props: {
    data: Page[];
    session: Session;
    messages: Message[];
    emailHost: emailHost;
    videos: Videos[];
    images: Images[];
    logos: Logos[];
    requests: serviceRequest[];
    segments: Segment[];
    caseStudies: CaseStudy[];
    users: UserWithoutPassword[];
    activated: boolean;
}) {
    // Use search params to display correct view (requires use client)
    // Set hidden state of component base on search params
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "dashboard";
    const { isOpen, onOpenChange } = useDisclosure();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notificationContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        notificationContainer.current!.scrollTop =
            notificationContainer.current!.scrollHeight -
            notificationContainer.current!.clientHeight;
    }, [notifications]);

    // Initial pop up if this is the first log in
    useEffect(() => {
        if (!props.activated) {
            onOpenChange();
        }
    }, []);

    // Set user as active on dismissing the initial pop up
    async function updateUser() {
        updateUserActivation(props.session.user.id!).catch((err) => {
            console.log(err);
        });
    }

    return (
        <NextUIProvider>
            <NotificationsContext.Provider
                value={{ notifications, setNotifications }}>
                {/* Notification card for unsaved changes */}
                <div className="w-1/6 xl:block no-scrollbar border-r border-orange-600 border-opacity-10 h-[22rem] overflow-y-scroll hidden fixed bottom-10 left-0 ">
                    <div
                        ref={notificationContainer}
                        className="w-full max-h-[22rem] px-6 no-scrollbar overflow-y-scroll pe-10 absolute bottom-0">
                        <NotificationCard />
                    </div>
                    <div className="absolute fade w-full h-14 left-0 top-0" />
                </div>
                <DashboardSwitchView
                    view={view}
                    data={props.data}
                    session={props.session}
                    messages={props.messages}
                    emailHost={props.emailHost}
                    videos={props.videos}
                    images={props.images}
                    logos={props.logos}
                    requests={props.requests}
                    segments={props.segments}
                    caseStudies={props.caseStudies}
                    users={props.users}
                />
                <Modal
                    isDismissable={false}
                    isOpen={isOpen}
                    className="dark"
                    onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex text-center flex-col text-orange-600 text-2xl">
                                    Welcome!
                                </ModalHeader>
                                <ModalBody>
                                    <p>Welcome to the TMW Dashboard.</p>
                                    <p>Your account has now been activated.</p>
                                    <p>
                                        On the main dashboard you can find
                                        information on how best to use this
                                        service. You have the ability to edit,
                                        draft and publish page content and case
                                        study content, upload images and videos,
                                        and check messages received through the
                                        contact from on the main website.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        className="bg-orange-600"
                                        onPress={() => {
                                            onClose();
                                            updateUser();
                                        }}>
                                        Okay!
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </NotificationsContext.Provider>
        </NextUIProvider>
    );
}

function DashboardSwitchView(props: {
    data: Page[];
    session: any;
    messages: Message[];
    emailHost: emailHost;
    videos: Videos[];
    images: Images[];
    logos: Logos[];
    requests: serviceRequest[];
    segments: Segment[];
    caseStudies: CaseStudy[];
    users: UserWithoutPassword[];
    view: string;
}) {
    switch (props.view) {
        case "dashboard":
            return (
                <DashboardView
                    hidden={false}
                    images={props.images}
                    videos={props.videos}
                    logos={props.logos}
                    messages={props.messages}
                    requests={props.requests}
                />
            );
        case "pages":
            return (
                <DashboardStateProvider>
                    <Pages
                        hidden={false}
                        data={props.data}
                        videos={props.videos}
                        images={props.images}
                        segments={props.segments}
                        caseStudies={props.caseStudies}
                    />
                </DashboardStateProvider>
            );
        case "media":
            return (
                <Media
                    session={props.session}
                    images={props.images}
                    logos={props.logos}
                    videos={props.videos}
                />
            );
        case "messages":
            return <Messages messages={props.messages} hidden={false} />;
        case "settings":
            return (
                <Settings
                    emailHost={props.emailHost.emailHost}
                    session={props.session}
                    users={props.users}
                    hidden={false}
                />
            );
    }
}
