"use server";

import { NextResponse } from "next/server";
import {
    PutObjectCommand,
    DeleteObjectCommand,
    S3Client,
    ObjectCannedACL,
    DeleteBucketCommandInput,
    DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import { writeFile } from "fs/promises";

interface ArrayFile extends File {
    arrayBuffer: () => Promise<ArrayBuffer>;
}

const bucketName = process.env.SPACES_BUCKET_NAME!;
const endpoint = process.env.SPACES_ENDPOINT!;
const region = process.env.SPACES_REGION!;
const accessKeyId = process.env.SPACES_ACCESS_KEY!;
const secretAccessKey = process.env.SPACES_SECRET_KEY!;

const s3 = new S3Client({
    region,
    endpoint,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get("file") as ArrayFile;

    if (!file) {
        return new NextResponse(JSON.stringify({ error: "No file received" }), {
            status: 400,
        });
    }

    const date = new Date();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.split(".")[0].replace(" ", "-");
    const type = file.name.split("_")[0];
    const extension = file.name.split(".")[1];
    const formattedDate = date.toISOString().replace(/:|\./g, "-");
    const formattedName =
        fileName.replace(" ", "_") + "-" + formattedDate + "." + extension;
    const fileKey = formattedName;

    switch (type) {
        case "THUMBNAIL":
        case "STUDY":
        case "SEGMENT":
        case "SEGHEAD":
            try {
                const uploadParams = {
                    Bucket: bucketName,
                    Key: "images/" + fileKey,
                    Body: buffer,
                    ACL: ObjectCannedACL.public_read,
                    ContentType: file.type,
                };
                await s3.send(new PutObjectCommand(uploadParams));
                try {
                    await prisma.images.create({
                        data: {
                            name: formattedName,
                        },
                    });
                    return new NextResponse(
                        JSON.stringify({ message: formattedName }),
                        { status: 201 }
                    );
                } catch (error: any) {
                    return new NextResponse(JSON.stringify({ error: error }), {
                        status: 500,
                    });
                }
            } catch (error) {
                return NextResponse.json(
                    { error: "File upload failed" },
                    { status: 500 }
                );
            } finally {
                revalidatePath("/", "layout");
                revalidatePath("/dashboard", "layout");
            }
        case "LOGO":
            try {
                const uploadParams = {
                    Bucket: bucketName,
                    Key: "logos/" + fileKey,
                    Body: buffer,
                    ACL: ObjectCannedACL.public_read,
                    ContentType: file.type,
                };
                await s3.send(new PutObjectCommand(uploadParams));
                try {
                    await prisma.logos.create({
                        data: {
                            name: formattedName,
                        },
                    });
                    return new NextResponse(
                        JSON.stringify({ message: formattedName }),
                        { status: 201 }
                    );
                } catch (error: any) {
                    return new NextResponse(JSON.stringify({ error: error }), {
                        status: 500,
                    });
                }
            } catch (error) {
                return NextResponse.json(
                    { error: "File upload failed" },
                    { status: 500 }
                );
            } finally {
                revalidatePath("/", "layout");
                revalidatePath("/dashboard", "layout");
            }
        default:
            try {
                const uploadParams = {
                    Bucket: bucketName,
                    Key: "avatars/" + fileKey,
                    Body: buffer,
                    ACL: ObjectCannedACL.public_read,
                    ContentType: file.type,
                };
                await s3.send(new PutObjectCommand(uploadParams));
                return new NextResponse(
                    JSON.stringify({ message: formattedName }),
                    { status: 201 }
                );
            } catch (error) {
                return NextResponse.json(
                    { error: "File upload failed" },
                    { status: 500 }
                );
            }
    }
}
