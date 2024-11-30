import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

export async function POST(req: Request) {
    try {
        const { fileName } = await req.json();

        if (!fileName) {
            return NextResponse.json(
                { error: "File path is required" },
                { status: 400 }
            );
        }

        var folder = "";
        const prefix = fileName.split("_")[0];
        switch (prefix) {
            case "SEGHEAD":
            case "SEGMENT":
            case "STUDY":
            case "THUMBNAIL":
                folder = "images/";
                break;
            case "VIDEO":
            case "HEADER":
                folder = "videos/";
                break;
            case "LOGO":
                folder = "logos/";
                break;
            default:
                folder = "avatars/";
        }

        const filePath = folder + fileName;

        const deleteParams = {
            Bucket: bucketName,
            Key: filePath,
        };
        await s3.send(new DeleteObjectCommand(deleteParams));
        try {
            switch (prefix) {
                case "SEGHEAD":
                case "SEGMENT":
                case "STUDY":
                case "THUMBNAIL":
                    await prisma.images.delete({
                        where: {
                            name: fileName,
                        },
                    });
                    break;
                case "VIDEO":
                case "HEADER":
                    await prisma.videos.delete({
                        where: {
                            name: fileName,
                        },
                    });
                    break;
                case "LOGO":
                    await prisma.logos.delete({
                        where: {
                            name: fileName,
                        },
                    });
                    break;
            }
            return NextResponse.json(
                { message: "File deleted successfully" },
                {
                    status: 200,
                }
            );
        } catch (error) {
            return NextResponse.json(
                { error: "Failed to remove from database" },
                { status: 500 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { error: "File deletion failed" },
            { status: 500 }
        );
    }
}
