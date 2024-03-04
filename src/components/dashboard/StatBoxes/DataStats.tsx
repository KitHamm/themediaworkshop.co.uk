"use client";

import { Message } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DataStats() {
    const [unreadMessage, setUnreadMessages] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [videoCount, setVideoCount] = useState(0);
    const [imageCount, setImageCount] = useState(0);

    useEffect(() => {
        axios
            .get("/api/message")
            .then((res) => {
                setMessages(res.data);
                let count = 0;
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].read === false) {
                        count = count + 1;
                    }
                }
                setUnreadMessages(count);
            })
            .catch((err) => console.log(err));

        axios
            .get("/api/image")
            .then((res) => setImageCount(res.data.length))
            .catch((err) => console.log(err));

        axios
            .get("/api/video")
            .then((res) => setVideoCount(res.data.length))
            .catch((err) => console.log(err));
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
                            <div className="font-bold">{messages.length}</div>
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
                            <div className="font-bold">{videoCount}</div>
                            <div className="font-bold">{imageCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
