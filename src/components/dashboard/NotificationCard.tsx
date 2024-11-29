"use client";

import { useContext } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { NotificationsContext } from "./providers/NotificationProvider";
import { Notification } from "@/lib/types";

export default function NotificationCard() {
    const { notifications, setNotifications } =
        useContext(NotificationsContext);

    return notifications.map((notification: Notification, index: number) => {
        return (
            <Card
                key={index}
                className={`${
                    notification.component !== "" && notification.title !== ""
                        ? ""
                        : "hidden"
                } dark w-full mt-2 notification-in`}>
                <CardBody>
                    <div className="w-full flex justify-between">
                        <div>
                            <p className="font-bold text-xl text-md text-red-400">
                                Unsaved Changes!
                            </p>
                            <p className="">
                                {notification.component +
                                    " - " +
                                    notification.title}
                            </p>
                        </div>
                        <div className="flex">
                            <div
                                onClick={() => {
                                    setNotifications(
                                        notifications.filter(
                                            (
                                                _notification: Notification,
                                                _index: number
                                            ) => _index !== index
                                        )
                                    );
                                }}
                                className="transition-all m-auto hover:bg-neutral-800 rounded-full p-1">
                                <i
                                    aria-hidden
                                    className="fa-regular text-neutral-400 hover:text-neutral-500 m-auto cursor-pointer text-3xl fa-circle-xmark"
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    });
}
