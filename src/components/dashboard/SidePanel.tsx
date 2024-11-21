"use client";

// Library Components
import {
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    useDisclosure,
    Badge,
    User,
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
import CreateTicketModal from "./modals/CreateTicketModal";
import ViewTicketsModal from "./modals/ViewTicketsModal";
import UploadAvatarModal from "./modals/uploadAvatarModal";

export default function SidePanel(props: {
    session: any;
    messages: Message[];
    tickets: Tickets[];
    avatar: string | undefined;
}) {
    // Search params for which view is active
    const searchParams = useSearchParams();
    const view: string = searchParams.get("view")
        ? searchParams.get("view")!
        : "dashboard";

    // The count of unread messages
    const [unreadMessages, setUnreadMessages] = useState(0);
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

    useEffect(() => {
        var count = 0;
        props.messages.forEach((message: any) => {
            if (!message.read) {
                count++;
            }
            setUnreadMessages(count);
        });
    }, [props.messages]);

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
                                    props.avatar !== undefined
                                        ? process.env
                                              .NEXT_PUBLIC_BASE_AVATAR_URL +
                                          props.avatar
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
                    <Link target="_blank" href="/">
                        <Image
                            src={"/images/tmw-logo.png"}
                            alt="TMW Logo"
                            priority
                            id="title-logo"
                            height={75}
                            width={720}
                            className="cursor-pointer max-w-full"
                        />
                    </Link>
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
                                src:
                                    props.avatar !== undefined
                                        ? process.env
                                              .NEXT_PUBLIC_BASE_AVATAR_URL +
                                          props.avatar
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
            <CreateTicketModal
                onOpenChangeReport={onOpenChangeReport}
                isOpenReport={isOpenReport}
                name={props.session.user.name}
            />

            {/* Tickets Modal */}
            <ViewTicketsModal
                tickets={props.tickets}
                onOpenChangeTickets={onOpenChangeTickets}
                isOpenTickets={isOpenTickets}
            />

            {/* Modal for uploading new avatar */}
            <UploadAvatarModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                userId={props.session.user.id}
                userName={Array.from(props.session.user.name)[0] as string}
            />
        </>
    );
}
