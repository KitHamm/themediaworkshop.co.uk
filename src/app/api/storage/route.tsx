import checkDiskSpace from "check-disk-space";
import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
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
    return new NextResponse(JSON.stringify({ response: _diskSpace }), {
        status: 201,
    });
}
