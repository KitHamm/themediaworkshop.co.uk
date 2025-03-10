"use server";

import {
	S3Client,
	PutObjectCommand,
	ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

// S3 Configuration
const bucketName = process.env.SPACES_BUCKET_NAME;
const endpoint = process.env.SPACES_ENDPOINT;
const region = process.env.SPACES_REGION;
const accessKeyId = process.env.SPACES_ACCESS_KEY;
const secretAccessKey = process.env.SPACES_SECRET_KEY;

export async function POST(request: Request) {
	try {
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

		const { fileName, folder } = await request.json();

		if (!fileName) {
			return NextResponse.json(
				{ error: "File name and folder are required" },
				{ status: 400 }
			);
		}

		const s3Client = new S3Client({
			region,
			endpoint,
			credentials: { accessKeyId, secretAccessKey },
		});

		const key = `${folder}/${fileName}`;

		const command = new PutObjectCommand({
			Bucket: bucketName,
			Key: key,
			ContentType: "video/mp4",
			ACL: ObjectCannedACL.public_read,
		});

		const signedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 3600,
		});

		return NextResponse.json({ signedUrl }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
