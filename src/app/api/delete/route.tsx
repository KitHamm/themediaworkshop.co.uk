"use server";
// packages
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
// functions
import { fetchReferences } from "@/lib/utils/apiUtils/fetchFileReferences";
// types
import { errorResponse } from "@/lib/types";

const bucketName = process.env.SPACES_BUCKET_NAME;
const endpoint = process.env.SPACES_ENDPOINT;
const region = process.env.SPACES_REGION;
const accessKeyId = process.env.SPACES_ACCESS_KEY;
const secretAccessKey = process.env.SPACES_SECRET_KEY;

const modelMap: Record<string, string> = {
	SEGHEAD: "images",
	SEGMENT: "images",
	STUDY: "images",
	THUMBNAIL: "images",
	VIDEO: "videos",
	HEADER: "videos",
	LOGO: "logos",
};

export async function POST(req: Request) {
	try {
		const { fileName } = await req.json();

		if (!fileName) {
			return NextResponse.json(
				{ error: "File path is required" },
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
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});

		// check if file is being used
		let errorResponseArray: errorResponse[] = await fetchReferences(
			fileName
		);

		if (errorResponseArray.length > 0) {
			return NextResponse.json(
				{ errorArray: errorResponseArray },
				{ status: 409 }
			);
		}

		// get metadata
		const prefix = fileName.split("_")[0];
		const folder = modelMap[prefix] || "avatars";
		const filePath = folder + "/" + fileName;

		const deleteActions: { Bucket: string; Key: string }[] = [];

		deleteActions.push({
			Bucket: bucketName,
			Key: filePath,
		});

		if (prefix === "VIDEO" || prefix === "HEADER") {
			const posterName = fileName.split(".")[0] + ".webp";
			const posterPath = "videos/posters/" + posterName;

			deleteActions.push({
				Bucket: bucketName,
				Key: posterPath,
			});
		}

		await Promise.all(
			deleteActions.map((params) =>
				s3.send(new DeleteObjectCommand(params))
			)
		);

		switch (prefix) {
			case "SEGHEAD":
			case "SEGMENT":
			case "STUDY":
			case "THUMBNAIL":
				await prisma.images.delete({
					where: { name: fileName },
				});
				break;
			case "VIDEO":
			case "HEADER":
				await prisma.videos.delete({
					where: { name: fileName },
				});
				break;
			case "LOGO":
				await prisma.logos.delete({
					where: { name: fileName },
				});
				break;
			default:
				throw new Error(`Unrecognized prefix: ${prefix}`);
		}
		return NextResponse.json(
			{ message: "File deleted successfully" },
			{
				status: 200,
			}
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "File deletion failed" },
			{ status: 500 }
		);
	}
}
