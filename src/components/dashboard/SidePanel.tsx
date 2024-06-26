"use client";

// Library Components
import {
    Avatar,
    Accordion,
    AccordionItem,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    CircularProgress,
    Badge,
    User,
    Switch,
} from "@nextui-org/react";

//  React Components
import { useEffect, useState } from "react";

// Next Auth
import { signOut } from "next-auth/react";

// Next Components
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

//  Functions
import { Message, Tickets } from "@prisma/client";
import axios from "axios";

export default function SidePanel(props: {
    session: any;
    messages: Message[];
}) {
    // Search params for which view is active
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "dashboard";
    // Current avatar and possible new avatar for user
    const [avatar, setAvatar] = useState("");
    const [newAvatar, setNewAvatar] = useState("");
    // The count of unread messages
    const [unreadMessages, setUnreadMessages] = useState(0);
    // Change avatar success state
    const [changeSuccess, setChangeSuccess] = useState(false);
    // Uploading avatar state
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    // Not Image Error
    const [notImageError, setNotImageError] = useState(false);
    // Problem Ticket Info
    const [isDashboardTicket, setIsDashboardTicket] = useState(false);
    const [reproducible, setReproducible] = useState(false);
    const [ticketDescription, setTicketDescription] = useState("");
    const [ticketSuccess, setTicketSuccess] = useState(false);

    // Tickets State
    const [tickets, setTickets] = useState<Tickets[]>([]);

    // Modal states
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isOpenReport,
        onOpen: onOpenReport,
        onOpenChange: onOpenChangeReport,
    } = useDisclosure();
    const {
        isOpen: isOpenTickets,
        onOpen: onOpenTickets,
        onOpenChange: onOpenChangeTickets,
    } = useDisclosure();

    // First render get current avatar from DB
    useEffect(() => {
        getAvatar();
        if (props.session.user.name === "Kit Hamm") {
            getTickets();
        }
    }, []);

    async function getTickets() {
        axios
            .get("/api/tickets")
            .then((res) => {
                if (res.status === 201) {
                    setTickets(res.data);
                }
            })
            .catch((err) => console.log(err));
    }

    async function updateTicket(id: string, value: boolean) {
        axios
            .post("/api/tickets", { action: "update", id: id, value: value })
            .then((res) => {
                if (res.status === 201) {
                    getTickets();
                }
            })
            .catch((err) => console.log(err));
    }

    async function deleteTicket(id: string) {
        axios
            .post("/api/tickets", { action: "delete", id: id })
            .then((res) => {
                if (res.status === 201) {
                    getTickets();
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        handleMessageCount(props.messages);
    }, [props.messages]);

    async function getAvatar() {
        axios
            .post("/api/users", {
                action: "getAvatar",
                id: props.session.user.id,
            })
            .then((res) => setAvatar(res.data.avatar))
            .catch((err) => console.log(err));
    }

    function handleMessageCount(messages: Message[]) {
        var count = 0;
        messages.forEach((message: any) => {
            if (!message.read) {
                count++;
            }
            setUnreadMessages(count);
        });
    }

    // Handler for uploading avatar
    // Uses the upload handler returning a promise
    async function uploadAvatar(file: File) {
        setUploadProgress(0);
        const formData = new FormData();
        formData.append("file", file);
        axios
            .post("/api/image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (ProgressEvent) => {
                    if (ProgressEvent.bytes) {
                        let percent = Math.round(
                            (ProgressEvent.loaded / ProgressEvent.total!) * 100
                        );
                        setUploadProgress(percent);
                    }
                },
            })
            .then((res) => {
                if (res.data.message) {
                    setUploading(false);
                    setNewAvatar(res.data.message);
                    clearFileInput();
                }
            })
            .catch((err) => console.log(err));
    }

    // After the avatar has been uploaded the success message is displayed
    // The user can then save the avatar to their profile with this function
    async function updateAvatar() {
        axios
            .post("/api/users", {
                action: "update",
                id: props.session.user.id,
                data: { image: newAvatar },
            })
            .then((res) => {
                if (res.status === 201) {
                    getAvatar();
                    setNewAvatar("");
                    onOpenChange();
                }
            })
            .catch((err) => console.log(err));
    }

    function clearFileInput() {
        const inputElm = document.getElementById(
            "new-avatar"
        ) as HTMLInputElement;
        if (inputElm) {
            inputElm.value = "";
        }
    }

    function submitTicket() {
        const dashboard = isDashboardTicket ? "true" : "false";
        const isReproducible = reproducible ? "true" : "false";
        axios
            .post("/api/users", {
                action: "submitTicket",
                from: props.session.user.name,
                dashboard: dashboard,
                reproducible: isReproducible,
                description: ticketDescription,
            })
            .then((res) => {
                if (res.data.message === "Ticket Submitted") {
                    console.log(res.data);
                    setIsDashboardTicket(false);
                    setReproducible(false);
                    setTicketDescription("");
                    setTicketSuccess(true);
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <>
            {/* Mobile Navigation Bar */}
            <div className="z-40 fixed w-screen bottom-0 left-0 xl:hidden bg-neutral-800 border-t border-orange-600">
                <div className="flex justify-evenly pb-2 pt-2">
                    <Dropdown placement="top-start" className="dark z-0">
                        <DropdownTrigger>
                            <Avatar
                                showFallback
                                name={
                                    Array.from(
                                        props.session.user.name
                                    )[0] as string
                                }
                                src={
                                    avatar
                                        ? process.env
                                              .NEXT_PUBLIC_BASE_AVATAR_URL +
                                          avatar
                                        : undefined
                                }
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownSection showDivider>
                                <DropdownItem
                                    textValue="Edit Profile"
                                    key="edit-profile">
                                    <a
                                        href={
                                            "dashboard?view=settings&open=true"
                                        }>
                                        Edit Profile
                                    </a>
                                </DropdownItem>
                                <DropdownItem
                                    onClick={() => onOpen()}
                                    key="new-avatar">
                                    Change Avatar
                                </DropdownItem>
                            </DropdownSection>
                            {props.session.user.name === "Kit Hamm" ? (
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        onClick={() => onOpenTickets()}
                                        key="view-tickets">
                                        View Tickets
                                    </DropdownItem>
                                </DropdownSection>
                            ) : (
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        onClick={() => onOpenReport()}
                                        key="report-problem">
                                        Report Problem
                                    </DropdownItem>
                                </DropdownSection>
                            )}
                            <DropdownSection>
                                <DropdownItem
                                    onClick={() =>
                                        signOut({ callbackUrl: "/" })
                                    }
                                    key="logout"
                                    className="text-red-400">
                                    Log Out
                                </DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>

                    <Link
                        href={"?view=dashboard"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "dashboard"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-solid fa-house fa-xl`}
                        />
                        <div className="mt-1">Dash</div>
                    </Link>
                    <Link
                        href={"?view=pages"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "pages"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-regular fa-window-restore fa-xl`}
                        />
                        <div className="mt-1">Pages</div>
                    </Link>
                    <Link
                        href={"?view=media"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "media"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-regular fa-images fa-xl`}
                        />
                        <div className="mt-1">Media</div>
                    </Link>
                    <Link
                        href={"?view=messages"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "messages"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-regular fa-message fa-xl`}
                        />
                        <Badge
                            placement="top-right"
                            color="danger"
                            isInvisible={unreadMessages === 0 ? true : false}
                            content={unreadMessages}>
                            {""}
                        </Badge>
                        <div className="mt-1">Msg</div>
                    </Link>
                    <Link
                        href={"?view=settings"}
                        className={`mt-auto transition-all text-center text-xs`}>
                        <i
                            aria-hidden
                            className={`${
                                view === "settings"
                                    ? "text-orange-600"
                                    : "text-white"
                            } fa-solid fa-gear fa-xl`}
                        />
                        <div className="mt-1">Settings</div>
                    </Link>
                </div>
            </div>
            {/* Desktop Side Panel */}
            {/* Side panel set to 1/6 width of the screen in a fixed position on the left */}
            <div className="hidden xl:block min-h-screen h-full fixed top-0 w-1/6 bg-neutral-800 border-r border-orange-600">
                <div className="xl:flex xl:p-10 border-b border-neutral-400 mb-4">
                    <Image
                        onClick={() => (window.location.href = "/")}
                        src={"/images/tmw-logo.png"}
                        alt="TMW Logo"
                        priority
                        id="title-logo"
                        height={75}
                        width={720}
                        className="cursor-pointer max-w-full"
                    />
                </div>
                {/* User information and avatar */}
                <div className="xl:flex pb-5 border-b border-neutral-400 mb-20">
                    <div className="px-5 w-full flex justify-between">
                        <User
                            name={
                                <div className="font-bold text-xl">
                                    {props.session.user.name}
                                </div>
                            }
                            description={
                                <div className="text-md">
                                    {props.session.user.position}
                                </div>
                            }
                            avatarProps={{
                                src: avatar
                                    ? process.env.NEXT_PUBLIC_BASE_AVATAR_URL +
                                      avatar
                                    : undefined,
                                name: Array.from(
                                    props.session.user.name
                                )[0] as string,
                                size: "lg",
                                className: "text-large ms-auto",
                            }}
                        />
                        {/* User dropdown containing upload new avatar and logout */}
                        <Dropdown className="dark z-0">
                            <DropdownTrigger>
                                <div className="xl:basis-1/5 xl:flex xl:cursor-pointer">
                                    <i
                                        aria-hidden
                                        className="xl:m-auto fa-solid fa-ellipsis-vertical"></i>
                                </div>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownSection showDivider>
                                    <DropdownItem
                                        textValue="Edit Profile"
                                        key="edit-profile">
                                        <a
                                            href={
                                                "dashboard?view=settings&open=true"
                                            }>
                                            Edit Profile
                                        </a>
                                    </DropdownItem>
                                    <DropdownItem
                                        onClick={() => onOpen()}
                                        key="new-avatar">
                                        Change Avatar
                                    </DropdownItem>
                                </DropdownSection>
                                {props.session.user.name === "Kit Hamm" ? (
                                    <DropdownSection showDivider>
                                        <DropdownItem
                                            onClick={() => onOpenTickets()}
                                            key="view-tickets">
                                            View Tickets
                                        </DropdownItem>
                                    </DropdownSection>
                                ) : (
                                    <DropdownSection showDivider>
                                        <DropdownItem
                                            onClick={() => onOpenReport()}
                                            key="report-problem">
                                            Report Problem
                                        </DropdownItem>
                                    </DropdownSection>
                                )}
                                <DropdownSection>
                                    <DropdownItem
                                        onClick={() =>
                                            signOut({ callbackUrl: "/" })
                                        }
                                        key="logout"
                                        className="text-red-400">
                                        Log Out
                                    </DropdownItem>
                                </DropdownSection>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                {/* Navigation Links using state props */}
                <Link
                    href={"?view=dashboard"}
                    className={`${
                        view === "dashboard"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <i
                        aria-hidden
                        className="fa-solid fa-house fa-xl my-auto"
                    />
                    <div className="my-auto">Dashboard</div>
                </Link>
                <Link
                    href={"?view=pages"}
                    className={`${
                        view === "pages"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <i
                        aria-hidden
                        className="fa-regular fa-window-restore fa-xl my-auto"
                    />
                    <div className="my-auto">Pages</div>
                </Link>
                <Link
                    href={"?view=media"}
                    className={`${
                        view === "media"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <i
                        aria-hidden
                        className="fa-regular fa-images fa-xl my-auto"
                    />
                    <div className="my-auto">Media</div>
                </Link>
                <Link
                    href={"?view=messages"}
                    className={`${
                        view === "messages"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <Badge
                        color="danger"
                        isInvisible={unreadMessages === 0 ? true : false}
                        content={unreadMessages}>
                        <i
                            aria-hidden
                            className="fa-regular fa-message fa-xl my-auto"
                        />
                    </Badge>
                    <div className="my-auto">Messages</div>
                </Link>
                <Link
                    href={"?view=settings"}
                    className={`${
                        view === "settings"
                            ? "bg-orange-600 border-l-5 border-white"
                            : ""
                    } w-4/5 rounded-tr-full rounded-br-full transition-all flex gap-6 hover:bg-gray-600 cursor-pointer font-bold text-xl pe-5 py-3 ps-10`}>
                    <i aria-hidden className="fa-solid fa-gear fa-xl my-auto" />
                    <div className="my-auto">Settings</div>
                </Link>
            </div>
            {/* Report a Problem Modal */}
            <Modal
                backdrop="blur"
                isDismissable={false}
                isOpen={isOpenReport}
                className="dark"
                onOpenChange={onOpenChangeReport}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Ticket Submission</ModalHeader>
                            <ModalBody>
                                {ticketSuccess ? (
                                    <div className="w-full text-xl text-green-400 text-center">
                                        Ticket Successfully Submitted!
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-lg">
                                            Where is the problem?
                                        </div>
                                        <div className="flex gap-2">
                                            <div
                                                className={`
                                            ${
                                                isDashboardTicket
                                                    ? ""
                                                    : "text-orange-600"
                                            }
                                        transition-all`}>
                                                Main Site
                                            </div>
                                            <Switch
                                                color="default"
                                                isSelected={isDashboardTicket}
                                                onValueChange={
                                                    setIsDashboardTicket
                                                }>
                                                <div
                                                    className={`
                                            ${
                                                isDashboardTicket
                                                    ? "text-orange-600"
                                                    : ""
                                            }
                                        transition-all`}>
                                                    Dashboard
                                                </div>
                                            </Switch>
                                        </div>
                                        <div className="text-lg">
                                            Is it easily reproducible?
                                        </div>
                                        <Switch
                                            color="success"
                                            isSelected={reproducible}
                                            onValueChange={setReproducible}>
                                            <div>
                                                {reproducible ? "Yes" : "No"}
                                            </div>
                                        </Switch>
                                        <div className="text-lg">
                                            Describe the problem...
                                        </div>
                                        <textarea
                                            value={ticketDescription}
                                            onChange={(e) =>
                                                setTicketDescription(
                                                    e.target.value
                                                )
                                            }
                                            className="min-h-52"></textarea>
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onPress={() => {
                                        onClose();
                                        setTicketSuccess(false);
                                        setIsDashboardTicket(false);
                                        setReproducible(false);
                                        setTicketDescription("");
                                    }}
                                    color="danger"
                                    variant="light">
                                    Close
                                </Button>
                                {!ticketSuccess && (
                                    <Button
                                        onPress={submitTicket}
                                        className="bg-orange-600">
                                        Submit Ticket
                                    </Button>
                                )}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Tickets Modal */}
            <Modal
                size="5xl"
                backdrop="blur"
                isDismissable={false}
                isOpen={isOpenTickets}
                className="dark"
                onOpenChange={onOpenChangeTickets}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="flex w-full gap-4">
                                    <div>Tickets</div>
                                    <div>
                                        <i
                                            onClick={() => getTickets()}
                                            aria-hidden
                                            className="cursor-pointer fa-solid my-auto fa-xl fa-arrows-rotate"
                                        />
                                    </div>
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                {tickets.length > 0 ? (
                                    <Accordion variant="splitted">
                                        {tickets.map(
                                            (
                                                ticket: Tickets,
                                                index: number
                                            ) => {
                                                return (
                                                    <AccordionItem
                                                        key={"ticket-" + index}
                                                        aria-label="Accordion 1"
                                                        title={
                                                            <div className="flex gap-4">
                                                                <div>
                                                                    {
                                                                        ticket.from
                                                                    }
                                                                </div>
                                                                <div>
                                                                    {" | "}
                                                                </div>
                                                                <div>
                                                                    {ticket.dashboard
                                                                        ? "Dashboard"
                                                                        : "Main Page"}
                                                                </div>
                                                                <div>
                                                                    {" | "}
                                                                </div>
                                                                <div>
                                                                    {ticket.reproducible
                                                                        ? "Reproducible"
                                                                        : "Not Reproducible"}
                                                                </div>
                                                                <div>
                                                                    {" | "}
                                                                </div>
                                                                <div
                                                                    className={
                                                                        ticket.resolved
                                                                            ? "text-green-400"
                                                                            : "text-red-400"
                                                                    }>
                                                                    {ticket.resolved
                                                                        ? "Closed"
                                                                        : "Open"}
                                                                </div>
                                                            </div>
                                                        }>
                                                        <div>
                                                            <div className="font-bold text-xl mb-4">
                                                                The Problem:
                                                            </div>
                                                            <div>
                                                                {
                                                                    ticket.description
                                                                }
                                                            </div>
                                                            <div className="flex justify-end gap-4">
                                                                <Button
                                                                    onPress={() =>
                                                                        deleteTicket(
                                                                            ticket.id
                                                                        )
                                                                    }
                                                                    color="danger"
                                                                    variant="light">
                                                                    Delete
                                                                </Button>
                                                                <Button
                                                                    onPress={() =>
                                                                        updateTicket(
                                                                            ticket.id,
                                                                            !ticket.resolved
                                                                        )
                                                                    }
                                                                    color={
                                                                        ticket.resolved
                                                                            ? "danger"
                                                                            : "success"
                                                                    }>
                                                                    {ticket.resolved
                                                                        ? "Open Ticket"
                                                                        : "Close Ticket"}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </AccordionItem>
                                                );
                                            }
                                        )}
                                    </Accordion>
                                ) : (
                                    <div className="text-2xl font-bold w-full text-center">
                                        No Tickets!
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    onPress={() => {
                                        onClose();
                                    }}
                                    color="danger"
                                    variant="light">
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            {/* Modal for uploading new avatar */}
            <Modal
                backdrop="blur"
                isOpen={isOpen}
                className="dark"
                onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Update Avatar</ModalHeader>
                            <ModalBody>
                                {/* Show success message on successful upload of avatar */}
                                {changeSuccess ? (
                                    <>
                                        <div className="text-center text-2xl font-bold">
                                            Success!
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                color="danger"
                                                onPress={() => {
                                                    onClose();
                                                    setNewAvatar("");
                                                    setChangeSuccess(false);
                                                }}>
                                                Close
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {notImageError && (
                                            <div className="w-full flex justify-center text-red-400">
                                                File is not an image
                                            </div>
                                        )}
                                        <div className="flex">
                                            {newAvatar === "" ? (
                                                uploading ? (
                                                    <div className="w-full flex justify-center">
                                                        <CircularProgress
                                                            classNames={{
                                                                svg: "w-20 h-20 text-orange-600 drop-shadow-md",
                                                                value: "text-xl",
                                                            }}
                                                            className="m-auto"
                                                            showValueLabel={
                                                                true
                                                            }
                                                            value={
                                                                uploadProgress
                                                            }
                                                            color="warning"
                                                            aria-label="Loading..."
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="file-input flex w-full justify-center">
                                                        <input
                                                            id="new-avatar"
                                                            className="inputFile mx-auto"
                                                            onChange={(e) => {
                                                                if (
                                                                    e.target
                                                                        .files
                                                                ) {
                                                                    if (
                                                                        e.target.files[0].type.split(
                                                                            "/"
                                                                        )[0] ===
                                                                        "image"
                                                                    ) {
                                                                        setNotImageError(
                                                                            false
                                                                        );
                                                                        setUploading(
                                                                            true
                                                                        );
                                                                        uploadAvatar(
                                                                            e
                                                                                .target
                                                                                .files[0]
                                                                        );
                                                                    } else {
                                                                        setNotImageError(
                                                                            true
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                            type="file"
                                                        />
                                                        <label htmlFor="new-avatar">
                                                            {newAvatar !== ""
                                                                ? newAvatar
                                                                : "Select file"}
                                                        </label>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="w-full flex justify-center">
                                                    <Avatar
                                                        className="w-20 h-20 text-large"
                                                        showFallback
                                                        name={
                                                            Array.from(
                                                                props.session
                                                                    .user.name
                                                            )[0] as string
                                                        }
                                                        src={
                                                            newAvatar
                                                                ? process.env
                                                                      .NEXT_PUBLIC_BASE_AVATAR_URL +
                                                                  newAvatar
                                                                : undefined
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <div>
                                                <Button
                                                    color="danger"
                                                    onPress={() => {
                                                        setNotImageError(false);
                                                        onClose();
                                                        setNewAvatar("");
                                                    }}>
                                                    Close
                                                </Button>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        updateAvatar();
                                                    }}
                                                    disabled={
                                                        newAvatar === ""
                                                            ? true
                                                            : false
                                                    }
                                                    className="disabled:bg-neutral-600 disabled:cursor-not-allowed bg-orange-600 px-4 py-2 rounded-lg">
                                                    Save
                                                </button>
                                            </div>
                                        </div>{" "}
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
