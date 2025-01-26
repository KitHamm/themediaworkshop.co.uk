"use client";

import { updateEmailHost } from "@/server/userActions/updateEmailHost";
import { Button } from "@heroui/react";
import { useState } from "react";

export default function EmailHost(props: { emailHost: string }) {
	const { emailHost } = props;

	const [newEmail, setNewEmail] = useState(emailHost);

	return (
		<>
			<div className="mt-5 font-bold text-xl">Notification Email:</div>
			<div className="grid gap-2 xl:flex xl:gap-4">
				<div className="flex gap-4">
					<input
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						className="text-black xl:min-w-80"
						type="email"
					/>
					<Button
						onPress={() => {
							if (newEmail !== props.emailHost) {
								updateEmailHost(emailHost, newEmail).catch(
									(err) => console.log(err)
								);
							}
						}}
						disabled={newEmail === props.emailHost}
						className={
							"disabled:bg-neutral-600 xl:my-auto my-5 bg-orange-600 rounded-md text-white text-md"
						}
					>
						Set
					</Button>
				</div>
				<em className="text-neutral-500 my-auto xl:ms-10">
					This is the email address that you will receive
					notifications of new messages on. It will also appear as the
					sender email on outgoing messages.
				</em>
			</div>
		</>
	);
}
