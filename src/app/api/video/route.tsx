"use server";
// packages
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
	PutObjectCommand,
	S3Client,
	ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { join } from "path";
import { tmpdir } from "os";
import { writeFile, readFile } from "fs/promises";
import ffmpeg from "fluent-ffmpeg";

// S3 Configuration
const bucketName = process.env.SPACES_BUCKET_NAME;
const endpoint = process.env.SPACES_ENDPOINT;
const region = process.env.SPACES_REGION;
const accessKeyId = process.env.SPACES_ACCESS_KEY;
const secretAccessKey = process.env.SPACES_SECRET_KEY;

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

		// prepare video buffer
		const videoBuffer = Buffer.from(await file.arrayBuffer());
		// get metadata
		const [baseName, extension] = file.name.split(".");
		const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
		const sanitizedBaseName = baseName.split("-")[0].replace(/\s+/g, "-");
		const videoName = `${sanitizedBaseName}-${timestamp}.${extension}`;
		const videoKey = `videos/${videoName}`;

		// temporary paths
		const tempVideoPath = join(tmpdir(), sanitizedBaseName);
		const thumbnailName = `${sanitizedBaseName}-${timestamp}.webp`;
		const tempThumbnailPath = join(tmpdir(), thumbnailName);

		// write video to a temp file for poster generation
		await writeFile(tempVideoPath, videoBuffer);

		// generate poster
		await new Promise((resolve, reject) => {
			ffmpeg(tempVideoPath)
				.on("end", resolve)
				.on("error", reject)
				.thumbnail({
					timemarks: ["0%"],
					size: "1920x1080",
					folder: tmpdir(),
					filename: thumbnailName,
				});
		});

		// prepare poster thumbnail
		const thumbnailBuffer = await readFile(tempThumbnailPath);
		const thumbnailKey = `videos/posters/${thumbnailName}`;

		const uploads: PutObjectCommand[] = [];

		uploads.push(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: thumbnailKey,
				Body: thumbnailBuffer,
				ACL: ObjectCannedACL.public_read,
				ContentType: "image/webp",
			})
		);

		uploads.push(
			new PutObjectCommand({
				Bucket: bucketName,
				Key: videoKey,
				Body: videoBuffer,
				ACL: ObjectCannedACL.public_read,
				ContentType: file.type,
			})
		);

		await Promise.all(uploads.map((upload) => s3.send(upload)));

		// Save video metadata to database
		await prisma.videos.create({ data: { name: videoName } });

		return NextResponse.json({ message: videoName }, { status: 201 });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 500 });
	}
}
