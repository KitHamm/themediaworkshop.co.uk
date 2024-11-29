"use client";

import { Notification, NotificationProviderType } from "@/lib/types";
import { createContext, useEffect, useRef, useState } from "react";
import NotificationCard from "../NotificationCard";

export const NotificationsContext = createContext<NotificationProviderType>(
    {} as any
);

export default function NotificationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notificationContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        notificationContainer.current!.scrollTop =
            notificationContainer.current!.scrollHeight -
            notificationContainer.current!.clientHeight;
    }, [notifications]);

    return (
        <NotificationsContext.Provider
            value={{ notifications, setNotifications }}>
            <div className="w-1/6 xl:block no-scrollbar border-r border-orange-600 border-opacity-10 h-[22rem] overflow-y-scroll hidden fixed bottom-10 left-0 ">
                <div
                    ref={notificationContainer}
                    className="w-full max-h-[22rem] px-6 no-scrollbar overflow-y-scroll pe-10 absolute bottom-0">
                    <NotificationCard />
                </div>
                <div className="absolute fade w-full h-14 left-0 top-0" />
            </div>
            {children}
        </NotificationsContext.Provider>
    );
}
