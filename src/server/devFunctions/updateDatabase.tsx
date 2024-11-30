"use server";

import prisma from "@/lib/prisma";
import { File } from "buffer";
import fs from "fs";

export async function updateDatabase() {
    await fs.readdir("D:/TMW/DO_SPACE/logos", (err, files) => {
        logFiles(files);
    });
}

async function logFiles(files: string[]) {
    files.forEach((file) => {
        const fileName = file;
        const splitName = fileName.split("-");
        const date =
            splitName[splitName.length - 6] +
            "-" +
            splitName[splitName.length - 5] +
            "-" +
            splitName[splitName.length - 4] +
            ":" +
            splitName[splitName.length - 3] +
            ":" +
            splitName[splitName.length - 2] +
            "." +
            splitName[splitName.length - 1].split(".")[0];
        const dateObj = new Date(date);
        addToDb(fileName, dateObj);
    });
}

async function addToDb(fileName: string, dateObj: Date) {
    try {
        await prisma.logos.create({
            data: {
                name: fileName,
                createdAt: dateObj,
            },
        });
        console.log("added");
    } catch (error) {
        console.log("error");
    }
}

// prisma.images.create({
//     data: {
//         name: fileName,
//         createdAt: dateObj,
//     },
// });
