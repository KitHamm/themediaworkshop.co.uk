"use client";

import { Images, Logos, Message, Videos } from "@prisma/client";
import { useEffect, useState } from "react";

export default function DataStats(props: {
    images: Images[];
    videos: Videos[];
    logos: Logos[];
    messages: Message[];
}) {
    const [unreadMessage, setUnreadMessages] = useState(0);

    useEffect(() => {
        let count = 0;
        for (let i = 0; i < props.messages.length; i++) {
            if (props.messages[i].read === false) {
                count = count + 1;
            }
        }
        setUnreadMessages(count);
    }, []);

    return (
        <div className="p-4 grid grid-cols-1 h-full">
            <div id="messages">
                <div className="text-orange-600 w-full border-b pb-2 mb-2 font-bold text-xl">
                    Messages
                </div>
                <div className="flex gap-5 my-auto">
                    <div id="left" className="grid grid-cols-1 gap-8">
                        <div className="text-xl my-auto">
                            <div>Unread Messages:</div>
                            <div>Total Messages:</div>
                        </div>
                    </div>
                    <div
                        id="right"
                        className="grid grid-cols-1 text-center gap-8">
                        <div className="text-xl my-auto ">
                            <div
                                className={`${
                                    unreadMessage > 0 ? "text-orange-600" : ""
                                } font-bold`}>
                                {unreadMessage}
                            </div>
                            <div className="font-bold">
                                {props.messages.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="messages" className="">
                <div className="text-orange-600 w-full border-b pb-2 mb-2 font-bold text-xl">
                    Media
                </div>
                <div className="flex gap-5 my-auto">
                    <div id="left" className="grid grid-cols-1 gap-8">
                        <div className="text-xl my-auto">
                            <div>Total Videos:</div>
                            <div>Total Images:</div>
                        </div>
                    </div>
                    <div
                        id="right"
                        className="grid grid-cols-1 text-center gap-8">
                        <div className="text-xl my-auto ">
                            <div className="font-bold">
                                {props.videos.length}
                            </div>
                            <div className="font-bold">
                                {props.images.length + props.logos.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
