"use server";
// packages
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
	PutObjectCommand,
	S3Client,
	ObjectCannedACL,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

// S3 Configuration
const bucketName = process.env.SPACES_BUCKET_NAME;
const endpoint = process.env.SPACES_ENDPOINT;
const region = process.env.SPACES_REGION;
const accessKeyId = process.env.SPACES_ACCESS_KEY;
const secretAccessKey = process.env.SPACES_SECRET_KEY;

const folderMap: Record<string, string> = {
	THUMBNAIL: "images/",
	STUDY: "images/",
	SEGMENT: "images/",
	SEGHEAD: "images/",
	LOGO: "logos/",
};

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

		if (
			!region ||
			!endpoint ||
			!accessKeyId ||
			!secretAccessKey ||
			!bucketName
		) {
			return NextResponse.json(
				{ error: "Spaces configuration incomplete" },
				{ status: 400 }
			);
		}

		const s3 = new S3Client({
			region,
			endpoint,
			credentials: { accessKeyId, secretAccessKey },
		});

		// convert to webp
		const buffer = Buffer.from(await file.arrayBuffer());
		const webpBuffer = await sharp(buffer).webp().toBuffer();
		// get metadata
		const date = new Date();
		const baseName = file.name.split(".")[0].replace(" ", "-");
		const type = file.name.split("_")[0];
		const formattedDate = date.toISOString().replace(/:|\./g, "-");
		const formattedName = `${baseName
			.split("-")[0]
			.replace(" ", "_")}-${formattedDate}.webp`;
		// get s3 options
		const folder = folderMap[type] || "avatars/";
		const fileKey = `${folder}${formattedName}`;
		// set s3 options
		const uploadParams = {
			Bucket: bucketName,
			Key: fileKey,
			Body: webpBuffer,
			ACL: ObjectCannedACL.public_read,
			ContentType: file.type,
		};
		// upload to DO Spaces
		await s3.send(new PutObjectCommand(uploadParams));

		// save to the database if applicable
		if (folder !== "avatars/") {
			switch (type) {
				case "THUMBNAIL":
				case "STUDY":
				case "SEGMENT":
				case "SEGHEAD":
					await prisma.images.create({
						data: { name: formattedName },
					});
					break;
				case "LOGO":
					await prisma.logos.create({
						data: { name: formattedName },
					});
					break;
			}
		}

		return NextResponse.json({ message: formattedName }, { status: 201 });
	} catch (error) {
		console.error("Error uploading file:", error);
		return NextResponse.json(
			{ error: "File upload failed" },
			{ status: 500 }
		);
	}
}
