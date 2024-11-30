"use server";

import { NextResponse } from "next/server";
import {
    PutObjectCommand,
    S3Client,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const date = new Date();
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name.split(".")[0].replace(" ", "-");
        const extension = file.name.split(".")[1];
        const formattedDate = date.toISOString().replace(/:|\./g, "-");
        const formattedName =
            fileName.replace(" ", "_") + "-" + formattedDate + "." + extension;

        const fileKey = formattedName;

        const uploadParams = {
            Bucket: bucketName,
            Key: "videos/" + fileKey,
            Body: buffer,
            ACL: ObjectCannedACL.public_read,
            ContentType: file.type,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        try {
            await prisma.videos.create({
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
    }
}
