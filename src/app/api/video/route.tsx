import { NextResponse } from "next/server";
import {
    PutObjectCommand,
    S3Client,
    ObjectCannedACL,
} from "@aws-sdk/client-s3";

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
        const buffer = Buffer.from(await file.arrayBuffer());
        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const fileKey = file.name;

        const uploadParams = {
            Bucket: bucketName,
            Key: "videos/" + fileKey,
            Body: buffer,
            ACL: ObjectCannedACL.public_read,
            ContentType: file.type,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        return NextResponse.json(
            { message: "File uploaded successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: "File upload failed" },
            { status: 500 }
        );
    }
}
