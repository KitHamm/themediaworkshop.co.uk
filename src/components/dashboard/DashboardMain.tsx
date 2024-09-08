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
import { Message, Page, Segment, CaseStudy, emailHost } from "@prisma/client";
import axios from "axios";
import NotificationCard from "./NotificationCard";
import {
    CheckUserActivation,
    UpdateUserActivation,
} from "../server/userActions/userActivation";
interface ExtendedPage extends Page {
    segment: ExtendedSegment[];
}
interface ExtendedSegment extends Segment {
    casestudy: CaseStudy[];
}

type notification = {
    component: string;
    title: string;
};

export const NotificationsContext = createContext<any>([]);

export default function DashboardMain(props: {
    data: ExtendedPage[];
    revalidateDashboard: any;
    session: any;
    messages: Message[];
    emailHost: emailHost;
}) {
    // Use search params to display correct view (requires use client)
    // Set hidden state of component base on search params
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "dashboard";
    const { isOpen, onOpenChange } = useDisclosure();
    const [notifications, setNotifications] = useState<notification[]>([]);

    const notificationContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        notificationContainer.current!.scrollTop =
            notificationContainer.current!.scrollHeight -
            notificationContainer.current!.clientHeight;
    }, [notifications]);

    // Initial pop up if this is the first log in
    useEffect(() => {
        CheckUserActivation(props.session.user.id)
            .then((res) => {
                if (res.status === 200) {
                    if (res.message === false) {
                        onOpenChange();
                    }
                } else {
                    console.log(res.message);
                }
            })
            .catch((err) => console.log(err));
    }, []);

    // Set user as active on dismissing the initial pop up
    async function updateUser() {
        UpdateUserActivation(props.session.user.id);
    }

    return (
        <NextUIProvider>
            <NotificationsContext.Provider
                value={[notifications, setNotifications]}>
                {/* Notification card for unsaved changes */}
                <div className="w-1/6 xl:block no-scrollbar border-r border-orange-600 border-opacity-10 h-[22rem] overflow-y-scroll hidden fixed bottom-10 left-0 ">
                    <div
                        ref={notificationContainer}
                        className="w-full max-h-[22rem] px-6 no-scrollbar overflow-y-scroll pe-10 absolute bottom-0">
                        <NotificationCard />
                    </div>
                    <div className="absolute fade w-full h-14 left-0 top-0" />
                </div>
                <DashboardView hidden={view === "dashboard" ? false : true} />
                {/* Main CMS pages view */}
                <Pages
                    hidden={view === "pages" ? false : true}
                    data={props.data}
                    revalidateDashboard={props.revalidateDashboard}
                />
                {/* Media pool view */}
                <Media
                    session={props.session}
                    revalidateDashboard={props.revalidateDashboard}
                    hidden={view === "media" ? false : true}
                />
                {/* Messages view */}
                <Messages
                    messages={props.messages}
                    revalidateDashboard={props.revalidateDashboard}
                    hidden={view === "messages" ? false : true}
                />
                {/* Settings view */}
                <Settings
                    revalidateDashboard={props.revalidateDashboard}
                    emailHost={props.emailHost.emailHost}
                    session={props.session}
                    hidden={view === "settings" ? false : true}
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
