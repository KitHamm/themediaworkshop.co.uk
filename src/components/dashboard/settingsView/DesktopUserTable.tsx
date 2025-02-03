"use client";

import { UserWithoutPassword } from "@/lib/types";
import { Avatar } from "@heroui/react";
import EditUser from "./EditUserModal";
import DeleteUser from "./DeleteUserWarningModal";

const DesktopUserTable = ({
	users,
	currentUser,
}: {
	users: UserWithoutPassword[];
	currentUser: UserWithoutPassword;
}) => {
	return (
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
					{currentUser.role === "ADMIN" && (
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
				{users.map((user: UserWithoutPassword) => (
					<tr
						className={`${
							user.id === currentUser.id && "bg-neutral-700"
						}`}
						key={user.id}
					>
						<td
							scope="col"
							className={`${
								user.activated
									? "text-green-600"
									: "text-neutral-600"
							} px-6 py-4`}
						>
							{user.activated ? "Activated" : "Not Activated"}
						</td>
						<td scope="col" className="px-6 py-4 flex gap-2">
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
							{currentUser.role === "ADMIN" && (
								<EditUser
									userToEdit={user}
									currentUser={currentUser}
									light
								/>
							)}
						</td>
						<td scope="col">
							{currentUser.role === "ADMIN" &&
							user.id !== currentUser.id ? (
								<DeleteUser userID={user.id} light />
							) : (
								""
							)}
						</td>
						<td>
							{user.id === currentUser.id && (
								<div className="text-green-600 mx-6">You</div>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default DesktopUserTable;
