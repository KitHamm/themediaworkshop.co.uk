"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@nextui-org/react";
import { getStorageStats } from "@/components/server/storageStats";
import { DiskSpaceType } from "@/lib/types";

export default function StorageStats() {
    const [diskSpace, setDiskSpace] = useState<DiskSpaceType>({
        diskPath: "",
        free: 0,
        size: 0,
    });
    const [usage, setUsage] = useState<number>(0.0);
    useEffect(() => {
        getStorageStats()
            .then((res) => {
                const data: DiskSpaceType = res.response as DiskSpaceType;
                setDiskSpace(data);
                const _usage = 100.0 - (data.free / data.size) * 100.0;
                setUsage(Math.round((_usage + Number.EPSILON) * 100) / 100);
            })
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="w-full grid grid-cols-1 gap-2 p-4">
            <div className="text-orange-600 font-bold text-center text-xl">
                Server Storage Usage
            </div>
            <div className="grid grid-cols-2">
                <div className="text-center">
                    <div className="font-bold">Disk Size: </div>
                    <div>{(diskSpace.size / 1e9).toFixed(2) + " GB"}</div>
                </div>
                <div className="text-center">
                    <div className="font-bold">Free Space: </div>
                    <div>{(diskSpace.free / 1e9).toFixed(2) + " GB"}</div>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="my-auto">
                    <CircularProgress
                        aria-label="storage"
                        classNames={{
                            svg: "w-36 h-36 drop-shadow-md",
                            indicator: "text-orange-600",
                            track: "stroke-white/20",
                            value: "text-2xl font-semibold text-white",
                        }}
                        formatOptions={{ style: "unit", unit: "percent" }}
                        value={usage}
                        strokeWidth={4}
                        showValueLabel={true}
                    />
                </div>
            </div>
        </div>
    );
}
