"use client";

// Types
import { Session } from "next-auth";
import { UserWithoutPassword } from "@/lib/types";

// Components
import {
    Accordion,
    AccordionItem,
    Avatar,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import EditUserModal from "./EditUserModal";
import DeleteUserWarningModal from "./DeleteUserWarningModal";

export default function MobileUserTable(props: {
    users: UserWithoutPassword[];
    session: Session;
}) {
    const { users, session } = props;
    const [userToEdit, setUserToEdit] = useState<UserWithoutPassword | null>(
        null
    );
    const [userToDeleteID, setUserToDeleteID] = useState<string | null>(null);

    const { isOpen: isOpenEditUser, onOpenChange: onOpenChangeEditUser } =
        useDisclosure();
    const {
        isOpen: isOpenDeleteWarning,
        onOpenChange: onOpenChangeDeleteWarning,
    } = useDisclosure();

    useEffect(() => {
        if (!isOpenEditUser) {
            setTimeout(() => {
                setUserToEdit(null);
            }, 300);
        }
    }, [isOpenEditUser]);

    useEffect(() => {
        if (!isOpenDeleteWarning) {
            setTimeout(() => {
                setUserToDeleteID(null);
            }, 300);
        }
    }, [isOpenDeleteWarning]);

    return (
        <div className="xl:hidden">
            <Accordion className="dark" variant="splitted">
                {users.map((user: UserWithoutPassword, index: number) => {
                    return (
                        <AccordionItem
                            key={index}
                            aria-label={user.firstname + " " + user.lastname}
                            startContent={
                                <Avatar
                                    radius="lg"
                                    src={
                                        user.image
                                            ? process.env.NEXT_PUBLIC_CDN +
                                              "/avatars/" +
                                              user.image
                                            : undefined
                                    }
                                />
                            }
                            subtitle={
                                <div
                                    className={`${
                                        user.activated
                                            ? "text-green-600"
                                            : "text-neutral-600"
                                    }`}>
                                    {user.activated
                                        ? "Activated"
                                        : "Not Activated"}
                                </div>
                            }
                            title={user.firstname + " " + user.lastname}>
                            <div className="px-6 py-2">
                                <div className="font-bold text-lg">Email:</div>
                                {user.email}
                            </div>
                            <div className="px-6 py-2">
                                <div className="font-bold text-lg">
                                    Position:
                                </div>
                                {user.position}
                            </div>
                            <div className="px-6 py-2">
                                <div className="font-bold text-lg">Role:</div>
                                {user.role}
                            </div>
                            {session.user.role === "ADMIN" && (
                                <div className="flex justify-end gap-2 my-2">
                                    {user.id !== props.session.user.id && (
                                        <Button
                                            onPress={() => {
                                                setUserToDeleteID(user.id!);
                                                onOpenChangeDeleteWarning();
                                            }}
                                            color="danger"
                                            variant="light"
                                            className="rounded-md">
                                            Delete User
                                        </Button>
                                    )}
                                    <Button
                                        onPress={() => {
                                            setUserToEdit(user);
                                            onOpenChangeEditUser();
                                        }}
                                        className="bg-orange-600 rounded-md">
                                        Edit User
                                    </Button>
                                </div>
                            )}
                        </AccordionItem>
                    );
                })}
            </Accordion>
            {userToEdit && (
                <EditUserModal
                    isOpen={isOpenEditUser}
                    onOpenChange={onOpenChangeEditUser}
                    session={session}
                    user={userToEdit}
                />
            )}
            {userToDeleteID && (
                <DeleteUserWarningModal
                    isOpen={isOpenDeleteWarning}
                    onOpenChange={onOpenChangeDeleteWarning}
                    userID={userToDeleteID}
                />
            )}
        </div>
    );
}
