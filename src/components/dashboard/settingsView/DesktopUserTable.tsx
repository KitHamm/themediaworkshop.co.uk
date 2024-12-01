"use client";

import { UserWithoutPassword } from "@/lib/types";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import EditUserModal from "./EditUserModal";
import DeleteUserWarningModal from "./DeleteUserWarningModal";

export default function DesktopUserTable(props: {
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
        <>
            <table className="hidden xl:block table-auto text-left">
                <thead className="bg-neutral-600">
                    <tr>
                        <th scope="col" className="px-6 py-2">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Position
                        </th>
                        <th scope="col" className="px-6 py-2">
                            Role
                        </th>
                        {session.user.role === "ADMIN" && (
                            <>
                                <th scope="col" className="px-6 py-2">
                                    <span className="sr-only">Edit</span>
                                </th>

                                <th scope="col" className="px-6 py-2">
                                    <span className="sr-only">Delete</span>
                                </th>
                            </>
                        )}
                        <th scope="col" className="px-6 py-2">
                            <span className="sr-only">You</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="text-left bg-neutral-800">
                    {users.map((user: UserWithoutPassword, index: number) => {
                        return (
                            <tr
                                className={
                                    user.id === session.user.id
                                        ? "bg-neutral-700"
                                        : ""
                                }
                                key={index}>
                                <td
                                    scope="col"
                                    className={`${
                                        user.activated
                                            ? "text-green-600"
                                            : "text-neutral-600"
                                    } px-6 py-4`}>
                                    {user.activated
                                        ? "Activated"
                                        : "Not Activated"}
                                </td>
                                <td
                                    scope="col"
                                    className="px-6 py-4 flex gap-2">
                                    <Avatar
                                        src={
                                            user.image
                                                ? process.env.NEXT_PUBLIC_CDN +
                                                  "/avatars/" +
                                                  user.image
                                                : undefined
                                        }
                                        size="md"
                                    />
                                    <div className="my-auto">
                                        {user.firstname + " " + user.lastname}
                                    </div>
                                </td>
                                <td scope="col" className="px-6 py-4">
                                    {user.email}
                                </td>
                                <td scope="col" className="px-6 py-4">
                                    {user.position}
                                </td>
                                <td scope="col" className="px-6 py-4">
                                    {user.role}
                                </td>

                                <td scope="col">
                                    {props.session.user.role === "ADMIN" && (
                                        <Button
                                            onClick={() => {
                                                setUserToEdit(user);
                                                onOpenChangeEditUser();
                                            }}
                                            color="warning"
                                            variant="light"
                                            className="rounded-md text-orange-600 mx-2">
                                            Edit
                                        </Button>
                                    )}
                                </td>
                                <td scope="col">
                                    {session.user.role === "ADMIN" &&
                                    user.id !== session.user.id ? (
                                        <Button
                                            onClick={() => {
                                                setUserToDeleteID(user.id!);
                                                onOpenChangeDeleteWarning();
                                            }}
                                            color="danger"
                                            variant="light"
                                            className="rounded-md mx-2">
                                            Delete
                                        </Button>
                                    ) : (
                                        ""
                                    )}
                                </td>
                                <td>
                                    {user.id === session.user.id && (
                                        <div className="text-green-600 mx-6">
                                            You
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
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
        </>
    );
}
