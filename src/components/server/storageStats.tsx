"use server";

import checkDiskSpace from "check-disk-space";
import os from "os";

export async function GetStorageStats() {
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
    return Promise.resolve({ status: 200, response: _diskSpace });
}
