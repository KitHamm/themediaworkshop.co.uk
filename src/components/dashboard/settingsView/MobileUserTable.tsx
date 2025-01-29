"use client";
// packages
import { Accordion, AccordionItem, Avatar } from "@heroui/react";
// components
import EditUser from "./EditUserModal";
import DeleteUser from "./DeleteUserWarningModal";
// types
import { UserWithoutPassword } from "@/lib/types";

const MobileUserTable = ({
	users,
	currentUser,
}: Readonly<{
	users: UserWithoutPassword[];
	currentUser: UserWithoutPassword;
}>) => {
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
									}`}
								>
									{user.activated
										? "Activated"
										: "Not Activated"}
								</div>
							}
							title={user.firstname + " " + user.lastname}
						>
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
							<div className="flex justify-between my-2">
								{currentUser.role === "ADMIN" && (
									<EditUser
										userToEdit={user}
										currentUser={currentUser}
										light
									/>
								)}
								{currentUser.role === "ADMIN" &&
									user.id !== currentUser.id && (
										<DeleteUser userID={user.id} light />
									)}
							</div>
						</AccordionItem>
					);
				})}
			</Accordion>
		</div>
	);
};

export default MobileUserTable;
