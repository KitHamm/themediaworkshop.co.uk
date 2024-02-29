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

// Types
import { Message, Page, emailHost } from "@prisma/client";
import { useEffect } from "react";
import axios from "axios";

export default function DashboardMain(props: {
    data: Page;
    revalidateDashboard: any;
    session: any;
    messages: Message;
    emailHost: emailHost;
}) {
    // Use search params to display correct view (requires use client)
    // Set hidden state of component base on search params
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "dashboard";
    const { isOpen, onOpenChange } = useDisclosure();
    // Initial pop up if this is the first log in
    useEffect(() => {
        axios
            .post("/api/activated", {
                id: props.session.user.id,
            })

            .then((res) => {
                if (!res.data.activated) {
                    onOpenChange();
                }
            })
            .catch((err) => console.log(err));
    }, []);

    // Set user as active on dismissing the initial pop up
    async function updateUser() {
        axios
            .post("/api/updateuser", {
                id: props.session.user.id,
                data: { activated: true },
            })
            .then((res) => {
                if (res.status === 201) {
                    props.revalidateDashboard("/api/users");
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <NextUIProvider>
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
                emailHost={props.emailHost}
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
                                    information on how best to use this service.
                                    You have the ability to edit, draft and
                                    publish page content and case study content,
                                    upload images and videos, and check messages
                                    received through the contact from on the
                                    main website.
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
        </NextUIProvider>
    );
}
