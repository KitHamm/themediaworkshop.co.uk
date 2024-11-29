"use server";

import checkDiskSpace from "check-disk-space";
import os from "os";

export async function getStorageStats() {
    var _diskSpace = {};
    var _path = "";
    if (os.platform() === "win32") {
        _path = "C:/";
    } else {
        _path = "/";
    }

    await checkDiskSpace(_path).then((diskSpace) => {
        _diskSpace = diskSpace;
    });
    return Promise.resolve({ response: _diskSpace });
}
