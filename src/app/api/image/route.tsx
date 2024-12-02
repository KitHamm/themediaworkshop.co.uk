"use server";

import { NextResponse } from "next/server";
import {
    PutObjectCommand,
    S3Client,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

// S3 Configuration
const bucketName = process.env.SPACES_BUCKET_NAME!;
const endpoint = process.env.SPACES_ENDPOINT!;
const region = process.env.SPACES_REGION!;
const accessKeyId = process.env.SPACES_ACCESS_KEY!;
const secretAccessKey = process.env.SPACES_SECRET_KEY!;

const s3 = new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
});

// Helper Functions
const uploadFileToS3 = async (
    key: string,
    buffer: Buffer,
    contentType: string
) => {
    const uploadParams = {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ACL: ObjectCannedACL.public_read,
        ContentType: contentType,
    };
    await s3.send(new PutObjectCommand(uploadParams));
};

const saveToDatabase = async (type: string, fileName: string) => {
    switch (type) {
        case "THUMBNAIL":
        case "STUDY":
        case "SEGMENT":
        case "SEGHEAD":
            await prisma.images.create({ data: { name: fileName } });
            break;
        case "LOGO":
            await prisma.logos.create({ data: { name: fileName } });
            break;
    }
};

const revalidatePaths = () => {
    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");
};

// Main Handler
export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file received" },
                { status: 400 }
            );
        }

        // Convert file to Buffer and process with Sharp
        const buffer = Buffer.from(await file.arrayBuffer());
        const webpBuffer = await sharp(buffer).webp().toBuffer();

        // Extract file metadata
        const date = new Date();
        const baseName = file.name.split(".")[0].replace(" ", "-");
        const type = file.name.split("_")[0];
        const formattedDate = date.toISOString().replace(/:|\./g, "-");
        const formattedName = `${baseName
            .split("-")[0]
            .replace(" ", "_")}-${formattedDate}.webp`;
        const folderMap: Record<string, string> = {
            THUMBNAIL: "images/",
            STUDY: "images/",
            SEGMENT: "images/",
            SEGHEAD: "images/",
            LOGO: "logos/",
        };
        const folder = folderMap[type] || "avatars/";
        const fileKey = `${folder}${formattedName}`;

        // Upload file to S3
        await uploadFileToS3(fileKey, webpBuffer, file.type);

        // Save metadata to the database if applicable
        if (folder !== "avatars/") {
            await saveToDatabase(type, formattedName);
        }

        // Revalidate paths
        revalidatePaths();

        return NextResponse.json({ message: formattedName }, { status: 201 });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "File upload failed" },
            { status: 500 }
        );
    }
}
